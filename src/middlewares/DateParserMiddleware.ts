import { isNumber } from "class-validator";
import { Middleware } from "../Middleware";
import { Request } from "../Request";
import { Response } from "../Response";

export class DateParserMiddleware extends Middleware {
  public async handle(req: Request, res: Response, next: Function) {
    req.body &&
      Object.keys(req.body).forEach((key) => {
        const date = Date.parse(req.body[key]);
        if (!isNaN(date.valueOf()) && !isNumber(req.body[key])) {
          req.body[key] = new Date(req.body[key]);
        }
      });
    req.queries &&
      Object.keys(req.queries).forEach((key) => {
        const date = Date.parse(req.queries[key]);
        if (!isNaN(date.valueOf()) && !isNumber(req.queries[key])) {
          req.queries[key] = new Date(req.queries[key]);
        }
      });
    await next();
  }
}
