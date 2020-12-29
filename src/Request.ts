import { validate } from "class-validator";
import { IncomingMessage } from "http";
import { interfaces } from "inversify";
import * as url from "url";
import { HttpException } from "./HttpException";
import { Utils } from "./Utils";

export class Request {
  private _incoming: IncomingMessage;

  public constructor(incoming: IncomingMessage) {
    this._incoming = incoming;
    this._incoming.url = Utils.sanitizeUrl(this._incoming.url);
  }

  public async body<T>(obj: interfaces.Newable<T>) {
    if (this._incoming.method?.toLowerCase() === "get") {
      throw new Error("GET methods do not allow a body.");
    }
    let body = new obj();
    Object.assign(body, await this._readBody());
    const errors = await validate(body);
    if (errors.length > 0) {
      let errorMessages = new Array<string>();
      for (var error of errors) {
        errorMessages = [
          ...errorMessages,
          ...Object.values(error.constraints!),
        ];
      }
      throw new HttpException({ errors: errorMessages }, 400);
    }
    return body;
  }

  public async queries<T>(obj: interfaces.Newable<T>) {
    const path = url.parse(this._incoming.url ?? "/");
    let objs: any = {};
    path.query
      ?.replace("?", "")
      .split("&")
      .forEach((query) => {
        const [key, value] = query.split("=");
        objs[key] = parseInt(value) !== NaN ? parseInt(value) : value;
      });
    let query = new obj();
    Object.assign(query, objs);
    const errors = await validate(query);
    if (errors.length > 0) {
      let errorMessages = new Array<string>();
      for (var error of errors) {
        errorMessages = [
          ...errorMessages,
          ...Object.values(error.constraints!),
        ];
      }
      throw new HttpException({ errors: errorMessages }, 400);
    }
    return query;
  }

  public get headers() {
    return this._incoming.headers;
  }

  private async _readBody() {
    return new Promise((resolve, reject) => {
      this._incoming.setEncoding("utf8");
      let responseBody = "";
      this._incoming.on("data", (chunk) => {
        responseBody += chunk;
      });
      this._incoming.on("end", () => {
        if (responseBody.length === 0) {
          responseBody = "{}";
        }
        resolve(JSON.parse(responseBody));
      });
      this._incoming.on("error", (err) => {
        reject(err);
      });
    });
  }
}
