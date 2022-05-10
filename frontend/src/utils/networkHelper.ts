import ky, { HTTPError } from "ky";
import type { Options } from "ky";
import { Notify } from "quasar";
import _ from "lodash";

export default class NetworkHelper {
    private API =
        import.meta.env.MODE === "production" ? "/api/" : `http://${window.location.host.split(":")[0]}:8000/api/`;

    private getOptionsAndUrl(url: string, queryParams: object | null) {
        const options = {
            timeout: 30000,
            credentials: import.meta.env.MODE === "production" ? "same-origin" : "include",
        } as Options;
        let fullUrl = this.API + url.replace(/\/\/$/, "/") + "/?format=json&";

        if (queryParams) {
            const withValues = _.pickBy(
                queryParams,
                v => (!_.isArray(v) && !_.isNil(v)) || (_.isArray(v) && _.size(v) > 0)
            );
            const queryString = _.map(withValues, (v, k) => `${encodeURIComponent(k)}=${encodeURI(v)}`);
            fullUrl += _.join(queryString, "&");
        }

        const csrfToken = NetworkHelper.getCookie("csrftoken");
        if (csrfToken) {
            options.headers = {
                "X-CSRFToken": csrfToken,
            };
        }

        return { options, fullUrl };
    }

    private static getCookie(name: string) {
        let cookieValue: string | null = null;
        if (document.cookie && document.cookie !== "") {
            const cookies = document.cookie.split(";");
            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i].trim();
                // Does this cookie string begin with the name we want?
                if (cookie.substring(0, name.length + 1) === name + "=") {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }

    private static async handleError(err: object) {
        if (err instanceof HTTPError) {
            if (err.response.status === 409) {
                const { error, detail } = await err.response.json();
                Notify.create({ caption: error, message: detail, type: "negative" });
            } else {
                Notify.create({ message: `HTTP Error: ${err.message}`, type: "negative" });
            }
        } else {
            Notify.create({
                caption: "Unbekannter Fehler",
                message: "Etwas ist schiefgelaufen, bitte wenden Sie sich an den Administrator.",
                type: "negative",
            });
        }
    }

    async getSafe<T>(url: string, queryParams: object | null = null): Promise<T | null> {
        try {
            return await this.get(url, queryParams);
        } catch (err) {
            await NetworkHelper.handleError(err as object);
            return null;
        }
    }

    async get<T>(url: string, queryParams: object | null = null): Promise<T> {
        const { options, fullUrl } = this.getOptionsAndUrl(url, queryParams);
        return (await ky.get(fullUrl, options)).json();
    }

    async patchSafe<T>(url: string, data: object): Promise<T | null> {
        try {
            return await this.patch(url, data);
        } catch (err) {
            await NetworkHelper.handleError(err as object);
            return null;
        }
    }

    async patch<T>(url: string, data: object): Promise<T> {
        const { options, fullUrl } = this.getOptionsAndUrl(url, null);
        if (data) {
            options.json = data;
        }
        return (await ky.patch(fullUrl, options)).json();
    }

    async postSafe<T>(url: string, data: object | null = null): Promise<T | null> {
        try {
            return await this.post(url, data);
        } catch (err) {
            await NetworkHelper.handleError(err as object);
            return null;
        }
    }

    async post<T>(url: string, data: object | null = null): Promise<T | null> {
        const { options, fullUrl } = this.getOptionsAndUrl(url, null);
        if (data instanceof FormData) {
            options.body = data;
        } else if (data) {
            options.json = data;
        }
        const csrfToken = NetworkHelper.getCookie("csrftoken");
        if (csrfToken) {
            options.headers = {
                "X-CSRFToken": csrfToken,
            };
        }
        const res = await ky.post(fullUrl, options);
        if (res.status !== 204) {
            return res.json();
        } else {
            return null;
        }
    }

    async delete(url: string) {
        const { options, fullUrl } = this.getOptionsAndUrl(url, null);
        return ky.delete(fullUrl, options);
    }

    async deleteSafe(url: string) {
        try {
            return await this.delete(url);
        } catch (err) {
            await NetworkHelper.handleError(err as object);
            return null;
        }
    }
}
