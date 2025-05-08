import { ENV } from "@env";
import { ServerResponse } from "@shared/types";

export type APIResponse<T = any> = {
    success: boolean;
    message: string;
    data: T;
};

export type APIResponseFallback<T = any> = {
    message: string;
    data: T;
};

export type WeakAPIResponseFallback<T = any> = {
    message?: string;
    data?: T;
};

export const DEFAULT_RESPONSE: APIResponseFallback = { message: 'Request failed', data: null }
export function fallback<T>(message: string = DEFAULT_RESPONSE.message, data: T = DEFAULT_RESPONSE.data): APIResponseFallback<T> { return { message, data } }

export async function response<T>(response: Response, def: WeakAPIResponseFallback<T> = DEFAULT_RESPONSE): Promise<APIResponse<T>> {
    var { message, data } = fallback<T>(def?.message, def?.data);

    try {
        var { message: serverMessage, data: serverData } = await response.json() as ServerResponse;
        if (serverMessage) message = serverMessage;
        if (serverData) data = serverData as T;
    } catch (error) {
        if (ENV !== "production") console.error(error);
    }
    finally {
        return { success: response.ok, message, data } as APIResponse<T>;
    }

}

