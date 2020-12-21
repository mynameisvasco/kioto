import * as Url from "url";
import Route from "./Route";
import { RequestDelegate } from "./RequestHandler";
import Request from "./Request";
import Response from "./Response";

class Router {
  private _basePath: Url.Url;
  private _queue: Array<RequestDelegate>;
  private _routes: Array<Route>;

  public constructor(basePath: string) {
    this._basePath = Url.parse(basePath);
    this._queue = new Array();
    this._routes = new Array();
  }

  public use(v: RequestDelegate) {
    this._queue.push(v);
  }

  public useRoute(route: Route) {
    this._routes.push(route);
  }

  public useRoutes(routes: Route[]) {
    this._routes = this._routes.concat(routes);
  }

  public matchRoute(path: string, method: string) {
    return this._routes.find((route) => {
      const providedPath = Url.parse(path);
      const finalPath = `/${this.basePath.pathname}/${route.path.pathname}`;
      return (
        finalPath === providedPath.pathname &&
        route.method.toLowerCase() === method.toLowerCase()
      );
    });
  }

  public handle(req: Request, res: Response) {
    let idx = 0;
    let f = this._queue[idx];
    const next = () => {
      if (++idx < this._queue.length) {
        let f = this._queue[idx];
        f(req, res, next);
      }
    };
    f && f(req, res, next);
  }

  public get basePath() {
    return this._basePath;
  }
}

export default Router;
