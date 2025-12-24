import { Request, Response, NextFunction } from "express";

export enum Method {
    GET = 'get',
    POST = 'post',
    PUT = 'put',
    DELETE = 'delete',
    PATCH = 'patch',
}

export interface Route {
    handler: (req: Request) => Promise<any>;
    method: Method;
    middlewares?: any[];
    path: string;
    send?: (data: any, req: Request, res: Response) => void;
}
