import { IncomingMessage, ServerResponse } from "http";
import Request from "./Request";
import Response from "./Response";
import Router from "./Router";
import HttpException from "./HttpException";
import { autoInjectable } from "tsyringe";

export type RequestDelegate = (
  req: Request,
  res: Response,
  next: Function
) => Promise<any> | any;

@autoInjectable()
class RequestHandler {
  private _routers: Array<Router>;

  public constructor() {
    this._routers = new Array();
  }

  public useRouter(router: Router) {
    this._routers.push(router);
  }

  public handleRequest(input: IncomingMessage, output: ServerResponse) {
    const path = input.url ?? "/";
    const method = input.method ?? "GET";
    const request = new Request(input);
    const response = new Response(output);
    try {
      this._routers.forEach((router) => {
        const route = router.matchRoute(path, method);
        if (!route) {
          throw new HttpException(`${method} ${path} not found!`, 404);
        }
        router.handle(request, response);
        route.handle(request, response);
      });
    } catch (e) {
      this.handleError(e, response);
    }
  }

  private handleError(err: any, res: Response) {
    if (err instanceof HttpException) {
      res.sendJson({ message: err.message, code: err.code });
    } else {
      res.sendJson({ message: "Something went wrong.", code: 502 });
    }
  }
}

export default RequestHandler;
