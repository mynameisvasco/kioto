import { OutgoingHttpHeader, OutgoingHttpHeaders, ServerResponse } from "http";

export class Response {
  private _outcoming: ServerResponse;

  public constructor(outcoming: ServerResponse) {
    this._outcoming = outcoming;
  }

  public setHeaders(code: number, headers: { [key: string]: string }) {
    this._outcoming.writeHead(code, headers);
  }

  public send(content: any, code: number = 200) {
    const { _outcoming } = this;
    _outcoming.statusCode = code;
    if (!_outcoming.getHeader("Content-Type")) {
      this.setHeaders(200, { "Content-Type": "application/json" });
    }
    _outcoming.write(JSON.stringify(content));
    _outcoming.end();
  }
}
