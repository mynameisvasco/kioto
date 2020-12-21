import Request from "./Request";
import Response from "./Response";

abstract class Middleware {
  public abstract handle(
    req: Request,
    res: Response,
    next: Function
  ): Promise<any> | any;
}

export default Middleware;
