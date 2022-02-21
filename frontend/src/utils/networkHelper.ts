import ky from "ky";
import { formatISO } from "date-fns";

export default class NetworkHelper {
    private API =
        import.meta.env.MODE === "production" ? "/api/" : `http://${window.location.host.split(":")[0]}:8000/api/`;

    private getOptionsAndUrl(url: string, queryParams: any | null) {
        const options: any = {
            timeout: 30000,
            credentials: import.meta.env.MODE === "production" ? "same-origin" : "include",
        };
        let fullUrl = this.API + url.replace(/\/\/$/, "/") + "/?format=json&";
        const ignoreCache = false;
        if (ignoreCache) {
            if (!queryParams) {
                queryParams = {};
            }
            queryParams["ts"] = formatISO(Date.now());
        }

        if (queryParams) {
            const mapped = Object.keys(queryParams)
                .filter(k => {
                    const v = queryParams[k];
                    return (v != null && !Array.isArray(v)) || (Array.isArray(v) && v?.length > 0);
                })
                .map(k => `${encodeURIComponent(k)}=${encodeURI(queryParams[k])}`);
            fullUrl += mapped.join("&");
            // const withValues = _.pickBy(
            //   queryParams,
            //   (v) => (!_.isArray(v) && !_.isNil(v)) || (_.isArray(v) && _.size(v) > 0)
            // );
            // const queryString = _.map(
            //   withValues,
            //   (v, k) => `${encodeURIComponent(k)}=${encodeURI(v)}`
            // );
            // fullUrl += _.join(queryString, "&");
        }

        const csrfToken = NetworkHelper.getCookie("csrftoken");
        if (csrfToken) {
            options.headers = {
                "X-CSRFToken": csrfToken,
            };
        }

        return { options, fullUrl: fullUrl };
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

    async get<T>(url: string, queryParams: object | null = null): Promise<T> {
        const { options, fullUrl } = this.getOptionsAndUrl(url, queryParams);
        return (await ky.get(fullUrl, options)).json();
    }

    async patch<T>(url: string, data: object): Promise<T> {
        const { options, fullUrl } = this.getOptionsAndUrl(url, null);
        if (data) {
            options.json = data;
        }
        return (await ky.patch(fullUrl, options)).json();
    }

    async post<T>(url: string, data: object | null = null, expectResponse = true): Promise<T> {
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
        return expectResponse ? res.json() : res;
    }

    async delete(url: string): Promise<object> {
        const { options, fullUrl } = this.getOptionsAndUrl(url, null);
        return ky.delete(fullUrl, options);
    }
}
