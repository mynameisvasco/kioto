/**
 * Error that represents a http exception
 */
export class HttpException extends Error {
  /**
   * Http code.
   */
  private _code: number;

  /**
   * Content of the error
   */
  private _content: any;

  /**
   * Instanciates a new HttpException
   * @param content content of the error
   * @param code http code
   */
  public constructor(message: string, code: number) {
    super(message);
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
