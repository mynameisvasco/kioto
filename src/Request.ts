import { IncomingMessage } from "http";
import * as url from "url";
import { Utils } from "./Utils";

class Request {
  private _incoming: IncomingMessage;

  public constructor(incoming: IncomingMessage) {
    this._incoming = incoming;
    this._incoming.url = Utils.sanitizeUrl(this._incoming.url);
  }

  public async body<T>() {
    if (this._incoming.method?.toLowerCase() === "get") {
      throw new Error("GET methods do not allow a body.");
    }
    return (await this._readBody()) as T;
  }

  public queries<T>() {
    const path = url.parse(this._incoming.url ?? "/");
    const objs = {} as any;
    path.query
      ?.replace("?", "")
      .split("&")
      .forEach((query) => {
        const [key, value] = query.split("=");
        objs[key] = value;
      });
    return objs as T;
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

export default Request;
