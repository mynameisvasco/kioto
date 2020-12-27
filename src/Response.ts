import { Serializable } from "child_process";
import { ServerResponse } from "http";

class Response {
  private _outcoming: ServerResponse;

  public constructor(outcoming: ServerResponse) {
    this._outcoming = outcoming;
  }

  public send(content: any, headers: Map<string, string>, code: number = 200) {
    const { _outcoming } = this;
    _outcoming.statusCode = code;
    _outcoming.setHeader(
      "Content-Type",
      headers.get("Content-Type") ?? "application/json"
    );
    _outcoming.write(JSON.stringify(content));
    _outcoming.end();
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

  public sendImage(content: ArrayBuffer, format: string, code: number = 200) {
    const headers = new Map();
    headers.set("Content-Type", `image/${format}`);
    this.send(content, headers, code);
  }
}

export default Response;
