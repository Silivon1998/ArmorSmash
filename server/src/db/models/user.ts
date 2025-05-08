export interface User {
    id: string;
    email: string;
    password_hash: string;
    registered_with: string;
    last_activity: number;
}