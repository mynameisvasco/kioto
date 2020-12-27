import { IncomingMessage, ServerResponse } from "http";
import Request from "./Request";
import Response from "./Response";
import Router from "./Router";
import HttpException from "./HttpException";
import { Injectable } from "./Decorators";

export type RequestDelegate = (
  req: Request,
  res: Response,
  next: Function
) => Promise<any> | any;

@Injectable()
class RequestHandler {
  private _routers: Array<Router>;

  public constructor() {
    this._routers = new Array();
  }

  public useRouter(router: Router) {
    this._routers.push(router);
  }

  public async handleRequest(input: IncomingMessage, output: ServerResponse) {
    const path = input.url ?? "/";
    const method = input.method ?? "GET";
    const request = new Request(input);
    const response = new Response(output);
    try {
      for (var router of this._routers) {
        const route = router.matchRoute(path, method);
        if (!route) {
          throw new HttpException(`${method} ${path} not found!`, 404);
        }
        await router.handle(request, response);
        await route.handle(request, response);
      }
    } catch (e) {
      this._handleError(e, response);
    }
  }

  private _handleError(err: any, res: Response) {
    if (err instanceof HttpException) {
      res.sendJson({ message: err.message, code: err.code });
    } else {
      res.sendJson({ message: "Something went wrong.", code: 502 });
    }
  }
}

export default RequestHandler;
