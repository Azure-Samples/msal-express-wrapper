import { Request } from "express";
export declare class UrlUtils {
    /**
     * Gets the absolute URL from a given request and path string
     * @param {Request} req: express request object
     * @param {string} uri: a given URI
     * @returns {string}
     */
    static ensureAbsoluteUrl: (req: Request, uri: string) => string;
}
