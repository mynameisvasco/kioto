import { Injectable } from "./decorators/DiDecorators";
import { Request } from "./Request";
import { RequestHandler } from "./RequestHandler";
import { Response } from "./Response";

/**
 * Defines the necessary methods that all
 * middlewares should implement.
 */
@Injectable()
export abstract class Middleware {
  /**
   * Method called when middleware is used inside a
   * execution queue.
   * @param req http request
   * @param res http response
   * @param next next function on execution queue
   */
  public abstract handle(
    req: Request,
    res: Response,
    next?: Function
  ): Promise<any> | any;
}
