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
   * Route's path parameters
   */
  private _params: Array<string>;

  /**
   * Route's execution queue.
   */
  private _queue: Array<RequestDelegate>;

  /**
   * Route's parameters resolved at doesMatch
   */
  public matchedParams: any;

  /**
   * Instanciates a new route.
   * @param path route's path
   * @param method route's http method
   */
  public constructor(path: string, method: string) {
    this.matchedParams = {};
    this._queue = new Array();
    this._path = Utils.sanitizeUrl(path.replace(/(:[a-zA-Z]*)/g, ""));
    this._method = method.toLowerCase();
    this._params = path.match(/(:[a-zA-Z]*)/g) ?? new Array<string>();
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
        await f(req, res, next);
      }
    };
    f && (await f(req, res, next));
  }

  /**
   * Checks if requested path and method match route's details.
   * @param path requested path
   * @param method requested http method
   */
  public match(path: string, method: string): boolean {
    const hasQuery = path.indexOf("?") !== -1;
    if (hasQuery) {
      path = path.substr(0, path.indexOf("?"));
    }
    const hasParams = this._params.length > 0;
    if (hasParams) {
      let paramsCounter = 0;
      const pathArr = path.split("/");
      path = "";
      for (var i = pathArr.length; i >= 0; i--) {
        if (i > this._params.length) {
          path += pathArr[pathArr.length - i] + "/";
        } else {
          if (paramsCounter < this._params.length) {
            this.matchedParams[this._params[paramsCounter].replace(":", "")] =
              pathArr[pathArr.length - i];
            paramsCounter++;
          }
        }
      }
    }
    path = Utils.sanitizeUrl(path);
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
