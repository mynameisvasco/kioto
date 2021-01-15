import { Middleware } from "../Middleware";
import { Request } from "../Request";
import { Response } from "../Response";

export class RequestParserMiddleware extends Middleware {
  public async handle(req: Request, res: Response, next: Function) {
    req.body = await req.parseBody();
    req.queries = req.parseQueries();
    this.parseNumbers(req);
    this.parseDates(req);
    await next();
  }

  private parseNumbers(req: Request) {
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
  }

  private parseDates(req: Request) {
    req.body &&
      Object.keys(req.body).forEach((key) => {
        const date = Date.parse(req.body[key]);
        if (!isNaN(date.valueOf()) && typeof req.body[key] !== "number") {
          req.body[key] = new Date(req.body[key]);
        }
      });
    req.queries &&
      Object.keys(req.queries).forEach((key) => {
        const date = Date.parse(req.queries[key]);
        if (!isNaN(date.valueOf()) && typeof req.queries[key] !== "number") {
          req.queries[key] = new Date(req.queries[key]);
        }
      });
  }
}
