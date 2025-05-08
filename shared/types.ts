export interface ServerResponse<T = any> {
    message: string;
    data: T;
}

export namespace Auth {
    var basePath = "/auth";
    export namespace Register {
        export const path = basePath + '/register';
        export type Request = { email: string; password: string; code: string; };
        export type Response = { test: string; };
        export type Error = { error: string; };
    }

    export namespace Login {
        export const path = basePath + '/login';
        export type Request = { email: string; password: string; };
        export type Response = {};
        export type Error = {};
    }
}

export namespace License {
    const basePath = "/license";

    export namespace Create {
        export const path = basePath + '/create';
        export type Request = { max_users: number; expires: number; };
        export type Response = string;
        export type Error = {};
    }

    export namespace Delete {
        export const path = basePath + '/delete';
        export type Request = { code: string; };
        export type Response = boolean;
        export type Error = {};
    }

    export namespace Update {
        export const path = basePath + '/update';
        export type Request = { code: string; max_users?: number; expires?: number; };
        export type Response = boolean;
        export type Error = {};
    }

    export namespace GetAll {
        export const path = basePath + "/all";
        export type Request = {};
        export type Response = Model[]; 
    }

    export type Model = {
        id: string;
        code: string;
        created: number;
        expires: number;
        max_uses: number;
        uses: number;
    };
}

export namespace User {
    var basePath = "/user";
    export namespace GetData {
        export const path = basePath + '/data';
        export type Request = { userId: string };
        export type Response = { email: string; last_activity: number, code?: string };
        export type Error = {};
    }

    export namespace ValidateToken {
        export const path = basePath + '/validate-token';
        export type Request = {};
        export type Response = boolean;
        export type Error = {};
    }

    export namespace Logout {
        export const path = basePath + '/logout';
        export type Request = {};
        export type Response = {};
        export type Error = {};
    }

    export namespace GetSessions {
        export const path = basePath + '/sessions';
        export type Request = { userId: string };
        export type Response = { count: number; sessions: { id: string; timestamp: number }[]; };
        export type Error = {};
    }
}


