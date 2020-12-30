import { Request } from "./Request";
import { RequestDelegate } from "./RequestHandler";
import { Response } from "./Response";
import { Utils } from "./Utils";

/**
 * Responsible to hold information of a route.
 */
export class Route {
  /**
   * Route's path.
   */
  private _path: string;

  /**
   * Route's http method.
   */
  private _method: string;

  /**
   * Route's execution queue.
   */
  private _queue: Array<RequestDelegate>;

  /**
   * Instanciates a new route.
   * @param path route's path
   * @param method route's http method
   */
  public constructor(path: string, method: string) {
    this._path = Utils.sanitizeUrl(path);
    this._method = method.toLowerCase();
    this._queue = new Array();
  }

  /**
   * Adds a function to the route execution queue.
   * @param v function that is going to be added.
   */
  public use(v: RequestDelegate): void {
    this._queue.push(v);
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
        f(req, res, next);
      }
    };
    f && (await f(req, res, next));
  }

  /**
   * Checks if requested path and method match route's details.
   * @param path requested path
   * @param method requested http method
   */
  public doesMatch(path: string, method: string): boolean {
    const hasQuery = path.indexOf("?") !== -1;
    if (hasQuery) {
      path = path.substr(0, path.indexOf("?"));
    }
    return this._path === path && this._method === method.toLowerCase();
  }

  public get path(): string {
    return this._path;
  }

  public set path(p: string) {
    this._path = p;
  }

  public get method(): string {
    return this._method;
  }

  public get queue(): RequestDelegate[] {
    return this._queue;
  }
}
