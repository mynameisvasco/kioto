import { ServerResponse } from "http";

class Response {
  private _outcoming: ServerResponse;

  public constructor(outcoming: ServerResponse) {
    this._outcoming = outcoming;
  }

  public send(content: any, headers: Map<string, string>, code: number = 200) {
    this._outcoming.statusCode = code;
    this._outcoming.setHeader("Content-Type", "application/json");
    this._outcoming.write(JSON.stringify(content));
    this._outcoming.end();
  }

  public sendJson(content: any, code: number = 200) {
    const headers = new Map();
    headers.set("Content-Type", "application/json");
    this.send(content, headers, code);
  }

  public sendHtml(content: any, code: number = 200) {
    const headers = new Map();
    headers.set("Content-Type", "text/html");
    this.send(content, headers, code);
  }

  public sendText(content: any, code: number = 200) {
    const headers = new Map();
    headers.set("Content-Type", "text/plain");
    this.send(content, headers, code);
  }
}

export default Response;
