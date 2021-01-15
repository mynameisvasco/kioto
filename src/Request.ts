import { IncomingMessage } from "http";
import { interfaces } from "inversify";
import * as Url from "url";
import { HttpException } from "./HttpException";
import { Utils } from "./Utils";

/**
 * Responsible for provide a set of methods
 * to manipulate a http request
 */
export class Request {
  /**
   * Http incoming request
   */
  private _incoming: IncomingMessage;

  /**
   * Parsed http request body, empty if method
   * does not support body.
   */
  public body: any;

  /**
   * Parsed http queries.
   */
  public queries: any;

  /**
   * Parsed http params.
   */
  public params: any;

  /**
   * Instanciates a new Request
   * @param incoming instance of http incoming request
   */
  public constructor(incoming: IncomingMessage) {
    this._incoming = incoming;
    this._incoming.url = Utils.sanitizeUrl(this._incoming.url);
  }

  /**
   * Returns validated http request body.
   * @param BodyType expected body data type.
   */
  public async bodyAs<T>(BodyType: interfaces.Newable<T>): Promise<T> {
    if (this._incoming.method?.toLowerCase() === "get") {
      throw new Error("GET methods do not allow a body.");
    }
    try {
      return await Utils.mapValidateOrFail(BodyType, this.body);
    } catch (e) {
      throw new HttpException(e.message, 400);
    }
  }

  /**
   * Returns validated http request queries.
   * @param QueryType expected query data type.
   */
  public async queriesAs<T>(QueryType: interfaces.Newable<T>): Promise<T> {
    try {
      return await Utils.mapValidateOrFail(QueryType, this.queries);
    } catch (e) {
      throw new HttpException(e.message, 400);
    }
  }

  /**
   * Returns http request headers.
   */
  public get headers(): NodeJS.Dict<string | string[]> {
    return this._incoming.headers;
  }

  /**
   * Reads http request body from buffer
   * and returns it's contents as a json object.
   */
  async parseBody(): Promise<any> {
    return new Promise((resolve, reject) => {
      let responseBody = "";
      this._incoming.setEncoding("utf8");
      this._incoming.on("data", (chunk) => (responseBody += chunk));
      this._incoming.on("end", () => {
        if (responseBody.length === 0) {
          responseBody = "{}";
        }
        resolve(JSON.parse(responseBody));
      });
      this._incoming.on("error", (err) => reject(err));
    });
  }

  /**
   * Reads http request queries
   * and returns it's contents as a json object.
   */
  parseQueries() {
    let queries: any = {};
    const path = Url.parse(this._incoming.url ?? "/");
    path.query
      ?.replace("?", "")
      .split("&")
      .forEach((query) => {
        const [key, value] = query.split("=");
        queries[key] = value;
      });
    return queries;
  }
}
