import { IncomingMessage, ServerResponse } from "http";
import { Request } from "./Request";
import { Response } from "./Response";
import { Router } from "./Router";
import { HttpException } from "./HttpException";
import { Injectable } from "./decorators/DiDecorators";
import { Di, Types } from "./Di";
import { RouteInfo } from "./decorators/RoutingDecorators";
import { Config } from "./Config";

export type RequestDelegate = (
  req: Request,
  res: Response,
  next: Function
) => Promise<any> | any;

@Injectable()
export class RequestHandler {
  private _routers: Array<Router>;

  public constructor(private config: Config) {
    this._routers = new Array();
  }

  public start() {
    let controllers;
    try {
      controllers = Di.getAll<any>(Types.Controller);
    } catch (e) {
      return;
    }
    for (var c of controllers) {
      const router = Reflect.getMetadata("router", c.constructor) as Router;
      const routesInfo = Reflect.getMetadata("routes-info", c) as RouteInfo[];
      for (var routeInfo of routesInfo) {
        routeInfo.route.use(routeInfo.handler.bind(c));
      }
      router.useRoutes(routesInfo.map((r) => r.route));
      this.useRouter(router);
    }
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
      res.send({ message: err.content, code: err.code });
    } else {
      res.send({ message: "Something went wrong.", code: 502 });
    }
    if (this.config.get<string>("enable-logging-errors")) {
      console.log(err);
    }
  }

  private useRouter(router: Router) {
    this._routers.push(router);
  }
}
