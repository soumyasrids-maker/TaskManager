export class User {
    id?: number;
    name?: string;
    email?: string;
    password?: string;
    role?: string;
    accessToken?: string;
    user?: any;
    permissions?: string[];
    [key: string]: any;  // Allow any additional properties
}