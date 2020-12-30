import { Route } from "./Route";
import { RequestDelegate } from "./RequestHandler";
import { Request } from "./Request";
import { Response } from "./Response";
import { Utils } from "./Utils";

/**
 * Responsible to hold middleware functions
 * and routes.
 */
export class Router {
  /**
   * Router's base path that is common to all routes
   * that belong to this router.
   */
  private _basePath: string;

  /**
   * Router's execution queue that contains all functions
   * that are run when handle method is called.
   */
  private _queue: Array<RequestDelegate>;

  /**
   * Array of routes that belong to this router.
   */
  private _routes: Array<Route>;

  /**
   * Instanciates a new router.
   * @param basePath Router base path that is common to all routes.
   */
  public constructor(basePath: string) {
    this._basePath = Utils.sanitizeUrl(basePath);
    this._queue = new Array();
    this._routes = new Array();
  }

  /**
   * Adds a function to the router execution queue.
   * @param v function that is going to be added.
   */
  public use(v: RequestDelegate): void {
    this._queue.push(v);
  }

  /**
   * Adds an array of routes to the router and updates routes
   * path based on router base path.
   * @param routes routes that are going to be added.
   */
  public useRoutes(routes: Route[]): void {
    routes.forEach((r, i) => {
      routes[i].path = this.basePath + r.path;
    });
    this._routes = this._routes.concat(routes);
  }

  /**
   * Returns the route that matches requested path and method,
   * otherwise undefined.
   * @param path requested path.
   * @param method requested method.
   */
  public match(path: string, method: string): Route | undefined {
    const { _routes } = this;
    for (var route of _routes) {
      const providedPath = Utils.sanitizeUrl(path);
      if (route.doesMatch(providedPath, method)) {
        return route;
      }
    }
  }

  /**
   * Executes router execution queue.
   * @param req http request.
   * @param res http response.
   */
  public async handle(req: Request, res: Response): Promise<void> {
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

  public get basePath(): string {
    return this._basePath;
  }

  public get queue(): RequestDelegate[] {
    return this._queue;
  }
}
