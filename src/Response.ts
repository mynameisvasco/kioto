import { ServerResponse } from "http";

/**
 * Responsible for provide a set of methods
 * to response to a http request
 */
export class Response {
  private _outcoming: ServerResponse;

  /**
   * Instanciates a new Response
   * @param outcoming http response
   */
  public constructor(outcoming: ServerResponse) {
    this._outcoming = outcoming;
  }

  /**
   * Produces an http response based on provided
   * params.
   * @param content content of the response.
   * @param code http code.
   * @param contentType http content-type header
   * @param headers http headers
   */
  public send(
    content: any,
    code: number = 200,
    contentType: string = "application/json",
    headers?: { [key: string]: string }
  ): void {
    const { _outcoming } = this;
    _outcoming.statusCode = code;
    if (headers) {
      Object.keys(headers).map((k) => this.setHeader(k, headers[k]));
    }
    if (!_outcoming.getHeader("Content-Type")) {
      this._outcoming.setHeader("Content-Type", contentType);
    }
    _outcoming.write(JSON.stringify(content));
    _outcoming.end();
  }

  /**
   * Writes http header to the http response buffer.
   * @param key http header key
   * @param val http header val
   */
  public setHeader(key: string, val: string): void {
    this._outcoming.setHeader(key, val);
  }
}
