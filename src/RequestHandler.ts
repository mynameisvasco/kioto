import { IncomingMessage, ServerResponse } from "http";
import { Request } from "./Request";
import { Response } from "./Response";
import { Router } from "./Router";
import { HttpException } from "./HttpException";
import { Injectable } from "./decorators/DiDecorators";
import { Di, Types } from "./Di";
import { Config } from "./Config";
import { Middleware } from "./Middleware";
import { Utils } from "./Utils";
import { Route } from "./Route";

/**
 * Represents request handler functions.
 */
export type RequestDelegate = (
  req: Request,
  res: Response,
  next?: Function
) => Promise<any> | any;

/**
 * Responsible for handle an incoming http
 * request and call the matching router and routing
 * handler.
 */
@Injectable()
export class RequestHandler {
  private _routers: Array<Router>;

  /**
   * Instanciates a new RequestHandler
   * @param config Config instance
   */
  public constructor(private config: Config) {
    this._routers = new Array();
  }

  /**
   * Starts all routes and routers, using the controller
   * instances registered in the DI.
   */
  public start(): void {
    const controllers = Di.getAll<any>(Types.Controller);
    controllers.forEach((controller) => {
      const controllerMeta = Utils.getControllerMetadata(controller);
      const { basePath, middlewares, routesMeta } = controllerMeta;
      let middlewaresInst = middlewares.map((m: any) => Di.get(m));
      const router = new Router(basePath);
      middlewaresInst.forEach((m: Middleware) =>
        router.use(m.handle.bind(m) as RequestDelegate)
      );
      const routes = new Array<Route>();
      routesMeta.forEach((routeMeta) => {
        const { handler, method, middlewares, path } = routeMeta;
        const route = new Route(path, method);
        let middlewaresInst = middlewares.map((m: any) =>
          Di.get(m)
        ) as Middleware[];
        middlewaresInst.forEach((m: Middleware) =>
          route.use(m.handle.bind(m) as RequestDelegate)
        );
        route.use(handler.bind(controller));
        routes.push(route);
      });
      router.useRoutes(routes);
      this._useRouter(router);
    });
  }

  /**
   * Executes the router and route execution queue for matched
   * route.
   * @param input http request
   * @param output http response
   */
  public async handleRequest(input: IncomingMessage, output: ServerResponse) {
    const { _routers } = this;
    const path = input.url ?? "/";
    const method = input.method ?? "GET";
    const request = new Request(input);
    const response = new Response(output);
    try {
      for (var router of _routers) {
        const route = router.match(path, method);
        if (route) {
          await router.handle(request, response);
          await route.handle(request, response);
          return;
        }
      }
      throw new HttpException(`${method} ${path} not found!`, 404);
    } catch (e) {
      this._handleError(e, response);
    }
  }

  /**
   * Respond to the http request with a specified error,
   * when code throws an Exception while handling
   * the request.
   * @param err error
   * @param res http response
   */
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

  /**
   * Adds a new router to routers array.
   * @param router router instance to add
   */
  private _useRouter(router: Router) {
    this._routers.push(router);
  }
}
