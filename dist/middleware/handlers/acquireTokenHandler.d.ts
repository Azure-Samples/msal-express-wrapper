import { WebAppAuthProvider } from "../../provider/WebAppAuthProvider";
import { RequestHandler } from "../MiddlewareTypes";
import { TokenRequestOptions, TokenRequestMiddlewareOptions } from "../MiddlewareOptions";
declare function acquireTokenHandler(this: WebAppAuthProvider, options: TokenRequestOptions, useAsMiddlewareOptions?: TokenRequestMiddlewareOptions): RequestHandler;
export default acquireTokenHandler;
