import { Middleware } from "../Middleware";
import { Request } from "../Request";
import { Response } from "../Response";

export class BodyParserMiddleware extends Middleware {
  public async handle(req: Request, res: Response, next: Function) {
    req.body = await req.parseBody();
    req.queries = req.parseQueries();
    await next();
  }
}
