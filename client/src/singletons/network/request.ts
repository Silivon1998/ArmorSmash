import { API_URL } from "@env";
import { APIResponse, response, WeakAPIResponseFallback } from "./response";

if (!API_URL) throw new Error("API base URL is required");

type RequestOptions = {
    method?: 'GET' | 'POST' | 'PATCH' | 'DELETE';
    body?: any;
    query?: Record<string, string | number | undefined>;
};

const headers = { 'Content-Type': 'application/json' };

export async function request<T>(path: string, options: RequestOptions = {}, def ?: WeakAPIResponseFallback<T>): Promise<APIResponse<T>> {
    const url = new URL(API_URL + path);

    if (options.query)
        for (const [key, value] of Object.entries(options.query))
            if (value !== undefined) url.searchParams.append(key, value.toString());

    const method = options.method || 'GET';
    const res = await fetch(url.toString(), {
        method, headers, credentials: 'include',
        body: method !== 'GET' && options.body ? JSON.stringify(options.body) : undefined,
    });

    return response(res,def);
}

export function get    <T>(path: string, query?: RequestOptions['query'], fallback ?: WeakAPIResponseFallback<T>) { return request<T>(path, { method: 'GET', query }, fallback); }
export function post   <T>(path: string, body?: any, def ?: WeakAPIResponseFallback<T>) { return request<T>(path, { method: 'POST', body }, def); }
export function patch  <T>(path: string, body?: any, def ?: WeakAPIResponseFallback<T>) { return request<T>(path, { method: 'PATCH', body }, def); }
export function del    <T>(path: string, body?: any, def ?: WeakAPIResponseFallback<T>) { return request<T>(path, { method: 'DELETE', body }, def); }


