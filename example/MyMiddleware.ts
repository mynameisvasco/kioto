import { Injectable } from "../src/decorators/DiDecorators";
import { Middleware } from "../src/Middleware";
import { Request } from "../src/Request";
import { RequestHandler } from "../src/RequestHandler";
import { Response } from "../src/Response";
import { MyService } from "./MyService";

@Injectable()
export class MyMiddleware extends Middleware {
  constructor(private myService: MyService) {
    super();
  }

  public handle(req: Request, res: Response, next: Function) {
    console.log(this.myService);
  }
}
