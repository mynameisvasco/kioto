import { Middleware } from "../Middleware";
import { Request } from "../Request";
import { Response } from "../Response";

export class IntParserMiddleware extends Middleware {
  public async handle(req: Request, res: Response, next: Function) {
    req.body &&
      Object.keys(req.body).forEach((key) => {
        const int = Number(req.body[key]);
        if (!isNaN(int)) req.body[key] = int;
      });
    req.queries &&
      Object.keys(req.queries).forEach((key) => {
        const int = Number(req.queries[key]);
        if (!isNaN(int)) req.queries[key] = int;
      });
    await next();
  }
}
