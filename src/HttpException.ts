class HttpException extends Error {
  private _code: number;
  private _content: any;

  public constructor(content: any, code: number) {
    super(content);
    this._content = content;
    this._code = code;
    Object.setPrototypeOf(this, HttpException.prototype);
  }

  public get code() {
    return this._code;
  }

  public get content() {
    return this._content;
  }
}

export default HttpException;
