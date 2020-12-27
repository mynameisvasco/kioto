import * as Url from "url";
import Request from "./Request";
import { RequestDelegate } from "./RequestHandler";
import Response from "./Response";
import { Utils } from "./Utils";

export class Route {
  private _path: Url.Url;
  private _method: string;
  private _queue: Array<RequestDelegate>;

  public constructor(path: string, method: string) {
    this._path = Url.parse(Utils.sanitizeUrl("/" + path));
    this._method = method.toLowerCase();
    this._queue = new Array();
  }

  public use(v: RequestDelegate) {
    this._queue.push(v);
  }

  public async handle(req: Request, res: Response) {
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

  public get path() {
    return this._path;
  }

  public get method() {
    return this._method;
  }

  public get queue() {
    return this._queue;
  }
}

export default Route;
