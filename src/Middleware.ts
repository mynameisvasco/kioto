import { Injectable } from "./decorators/DiDecorators";
import { Request } from "./Request";
import { Response } from "./Response";

@Injectable()
export abstract class Middleware {
  public abstract handle(
    req: Request,
    res: Response,
    next: Function
  ): Promise<any> | any;
}
