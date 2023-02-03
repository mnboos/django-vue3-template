import { describe, it, expect, beforeEach, afterEach, vi, assert } from "vitest";
import ky, { HTTPError } from "ky";
import type { SpyInstance } from "vitest";
import { Notify } from "quasar";

import NetworkHelper from "../networkHelper";

function mockCsrfToken(token: string) {
    Object.defineProperty(window.document, "cookie", {
        writable: true,
        value: `csrftoken=${token}`,
    });
}

describe("NetworkHelper", () => {
    let mockedKy: SpyInstance | null = null;
    const api: NetworkHelper = new NetworkHelper();
    const notifyMock = vi.fn(Notify.create);

    beforeEach(() => {
        mockCsrfToken("somecsrftoken");
        Notify.create = notifyMock;
        mockedKy = null;
    });

    afterEach(() => {
        notifyMock.mockClear();
        assert(mockedKy, "ky was not mocked properly");
        mockedKy.mockRestore();
        mockedKy = null;
    });

    it("expects json not to be set if status is 204", async () => {
        mockedKy = vi.spyOn(ky, "post").mockResolvedValue({ status: 204 } as Response);

        const res = await api.post<Response>("");
        expect(res).toBeNull();
    });

    it("expects json to be set if status is 200", async () => {
        mockedKy = vi
            .spyOn(ky, "post")
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            .mockResolvedValue({ status: 200, json: vi.fn().mockResolvedValue({ foo: "bar" }) });

        const res = await api.postSafe<{ foo: string }>("");
        expect(res).toBeDefined();
        expect((res as { foo: string }).foo).toBe("bar");
    });

    it("expects post of FormData to work", async () => {
        mockedKy = vi
            .spyOn(ky, "post")
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            .mockResolvedValue({ status: 200, json: vi.fn().mockResolvedValue({ foo: "bar" }) });

        const data = new FormData();
        data.set("bla", "blub");
        const res = await api.postSafe<{ foo: string }>("", data);
        expect(res).toBeDefined();
        expect((res as { foo: string }).foo).toBe("bar");
    });

    it("expects patch to work", async () => {
        mockedKy = vi
            .spyOn(ky, "patch")
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            .mockResolvedValue({ status: 200, json: vi.fn().mockResolvedValue({ foo: "bar" }) });

        const res = await api.patchSafe<{ foo: string }>("", { some: "data" });
        expect(res).toBeDefined();
        expect((res as { foo: string }).foo).toBe("bar");
    });

    it("expects patch to fail", async () => {
        mockedKy = vi
            .spyOn(ky, "patch")
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            .mockRejectedValue({ status: 500 });

        const res = await api.patchSafe<{ foo: string }>("", { some: "data" });
        expect(res).toBeNull();
        expect(notifyMock).toBeCalledTimes(1);
    });

    it("expects delete to work", async () => {
        mockedKy = vi
            .spyOn(ky, "delete")
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            .mockResolvedValue({ status: 204 });

        const res = await api.deleteSafe("");
        expect(res).toBeDefined();
        expect((res as { status: number }).status).toBe(204);
    });

    it("expects delete to fail", async () => {
        mockedKy = vi
            .spyOn(ky, "delete")
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            .mockRejectedValue({ status: 500 });

        const res = await api.deleteSafe("");
        expect(res).toBeNull();
        expect(notifyMock).toBeCalledTimes(1);
    });

    it("tests a mocked csrftoken", async () => {
        mockedKy = vi
            .spyOn(ky, "post")
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            .mockResolvedValue({ status: 200, json: vi.fn().mockResolvedValue({ foo: "bar" }) });

        const res = await api.post<{ foo: string }>("", { some: "data" });
        expect(res).toBeDefined();
        expect(res?.foo).toBe("bar");
    });

    it("tests a get call", async () => {
        mockedKy = vi
            .spyOn(ky, "get")
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            .mockResolvedValue({ status: 200, json: vi.fn().mockResolvedValue({ foo: "bar" }) });

        const res = await api.get<{ foo: string }>("myurl", { some: "data", array: [1, 2, 3] });
        expect(res.foo).toBe("bar");
    });

    it("tests for HTTPError 409", async () => {
        mockedKy = vi.spyOn(ky, "get").mockRejectedValue(
            new HTTPError(
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                {
                    status: 409,
                    json: vi.fn().mockResolvedValue({
                        error: "errormessage",
                        detail: "detailmessage",
                    }),
                },
                {},
                {}
            )
        );

        await api.getSafe<{ foo: string }>("myurl");
        expect(notifyMock.mock.calls.length).toBe(1);
        expect(notifyMock.mock.calls[0].length).toBe(1);
        expect(notifyMock.mock.calls[0][0]).toEqual({
            caption: "errormessage",
            message: "detailmessage",
            type: "negative",
        });
    });

    it("tests for failing post HTTPError 409", async () => {
        mockedKy = vi.spyOn(ky, "get").mockRejectedValue(
            new HTTPError(
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                {
                    status: 409,
                    json: vi.fn().mockResolvedValue({
                        error: "errormessage",
                        detail: "detailmessage",
                    }),
                },
                {},
                {}
            )
        );

        const res = await api.postSafe<{ foo: string }>("myurl");
        expect(res).toBeNull();
    });

    it("tests for HTTPError 404", async () => {
        mockedKy = vi.spyOn(ky, "get").mockRejectedValue(
            new HTTPError(
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                {
                    status: 404,
                    json: vi.fn().mockResolvedValue({
                        error: "errormessage",
                        detail: "detailmessage",
                    }),
                },
                {},
                {}
            )
        );

        await api.getSafe<{ foo: string }>("myurl");
        expect(notifyMock.mock.calls.length).toBe(1);
        expect(notifyMock.mock.calls[0].length).toBe(1);
        expect(notifyMock.mock.calls[0][0]).toEqual({
            message: "HTTP Error: Request failed with status code 404",
            type: "negative",
        });
    });

    it("test for another network error", async () => {
        mockedKy = vi.spyOn(ky, "get").mockRejectedValue({
            status: 404,
        });

        await api.getSafe<{ foo: string }>("myurl");
        expect(notifyMock.mock.calls.length).toBe(1);
        expect(notifyMock.mock.calls[0].length).toBe(1);
        expect(notifyMock.mock.calls[0][0]).toEqual({
            caption: "Unbekannter Fehler",
            message: "Etwas ist schiefgelaufen, bitte wenden Sie sich an den Administrator.",
            type: "negative",
        });
    });
});
