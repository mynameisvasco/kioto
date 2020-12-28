import { Injectable } from "./decorators/DiDecorators";
import Request from "./Request";
import Response from "./Response";

@Injectable()
abstract class Middleware {
  public abstract handle(
    req: Request,
    res: Response,
    next: Function
  ): Promise<any> | any;
}

export default Middleware;
