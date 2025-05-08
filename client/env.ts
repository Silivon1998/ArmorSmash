export const API_URL = import.meta.env.VITE_API_URL;
export const ENV : "production" | "development" = import.meta.env.ENV || "development";

if (!API_URL) throw new Error('VITE_API_URL is not defined');