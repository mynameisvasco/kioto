import * as Url from "url";
import { Route } from "./Route";
import { RequestDelegate } from "./RequestHandler";
import { Request } from "./Request";
import { Response } from "./Response";
import { Utils } from "./Utils";

export class Router {
  private _basePath: Url.Url;
  private _queue: Array<RequestDelegate>;
  private _routes: Array<Route>;

  public constructor(basePath: string) {
    this._basePath = Url.parse(Utils.sanitizeUrl(basePath)) ?? "";
    this._queue = new Array();
    this._routes = new Array();
  }

  public use(v: RequestDelegate) {
    this._queue.push(v);
  }

  public useRoutes(routes: Route[]) {
    this._routes = this._routes.concat(routes);
  }

  public matchRoute(path: string, method: string) {
    for (var route of this._routes) {
      const providedPath = Url.parse(Utils.sanitizeUrl(path));
      const finalPathName = `${
        this._basePath.pathname ? "/" + this._basePath.pathname : ""
      }${route.path.pathname ? "/" + route.path.pathname : ""}`;
      if (
        finalPathName === providedPath.pathname &&
        route.method === method.toLowerCase()
      ) {
        return route;
      }
    }
  }

  public async handle(req: Request, res: Response) {
    let idx = 0;
    let f = this._queue[idx];
    const next = async () => {
      if (++idx < this._queue.length) {
        let f = this._queue[idx];
        await f(req, res, next);
      }
    };
    f && (await f(req, res, next));
  }

  public get basePath() {
    return this._basePath;
  }
}
