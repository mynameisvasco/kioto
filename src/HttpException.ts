class HttpException extends Error {
  private _code: number;

  public constructor(message: string, code: number) {
    super(message);
    this._code = code;
    Object.setPrototypeOf(this, HttpException.prototype);
  }

  public get code() {
    return this._code;
  }
}

export default HttpException;
