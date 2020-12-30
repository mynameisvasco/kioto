import { validate } from "class-validator";
import { interfaces } from "inversify";
import { RouteMeta } from "./decorators/RoutingDecorators";

export class Utils {
  public static sanitizeUrl(url: string = "/") {
    if (url === "") url = "/";
    else if (url.charAt(0) !== "/") url = `/${url}`;
    let sanitizedUrl = url.replace(/([^:]\/)\/+/g, "$1");
    return sanitizedUrl;
  }

  public static getControllerMetadata(controller: any) {
    const middlewares = Reflect.getMetadata(
      "controller:middlewares",
      controller.constructor
    );
    const basePath = Reflect.getMetadata(
      "controller:basePath",
      controller.constructor
    );
    const routesMeta = Reflect.getMetadata(
      "controller:routesMeta",
      controller
    ) as RouteMeta[];
    return { middlewares, basePath, routesMeta };
  }

  public static async mapValidateOrFail<T>(
    TargetClass: interfaces.Newable<T>,
    source: any
  ) {
    const target = new TargetClass();
    Object.assign(target, source);
    const errors = await validate(target);
    if (errors.length > 0) {
      let errorMessages = new Array<string>();
      for (var error of errors) {
        errorMessages = [
          ...errorMessages,
          ...Object.values(error.constraints!),
        ];
      }
      throw Error(errorMessages.join(", "));
    }
    return target;
  }
}
