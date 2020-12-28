import Middleware from "../Middleware";
import { RequestDelegate } from "../RequestHandler";
import Route from "../Route";
import Router from "../Router";
import { Injectable } from "./DiDecorators";

export interface RouteInfo {
  route: Route;
  handler: RequestDelegate;
}

export function defineRouteMetadata(
  path: string,
  method: string,
  middleware: Function[],
  target: any,
  handler: RequestDelegate
) {
  const route = new Route(path, method);
  const rMetadata: RouteInfo = {
    handler,
    route,
  };
  middleware.map((m) => {
    const mInstance: Middleware = Reflect.construct(m, []);
    route.use(mInstance.handle.bind(mInstance) as RequestDelegate);
  });
  let rMetadatas = Reflect.getMetadata("routes-info", target);
  if (!rMetadatas) rMetadatas = new Array<RouteInfo>();
  rMetadatas.push(rMetadata);
  Reflect.defineMetadata("routes-info", rMetadatas, target);
}

export function Get(path: string, middleware: Function[] = []) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    defineRouteMetadata(path, "GET", middleware, target, descriptor.value);
  };
}

export function Post(path: string, middleware: Function[] = []) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    defineRouteMetadata(path, "POST", middleware, target, descriptor.value);
  };
}

export function Put(path: string, middleware: Function[] = []) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    defineRouteMetadata(path, "PUT", middleware, target, descriptor.value);
  };
}

export function Delete(path: string, middleware: Function[] = []) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    defineRouteMetadata(path, "DELETE", middleware, target, descriptor.value);
  };
}

export function Controller(baseUrl: string = "", middleware: Function[] = []) {
  return (constructor: Function) => {
    const router = new Router(baseUrl);
    middleware.forEach((m) =>
      router.use(Reflect.construct(m, []).handle.bind(m))
    );
    Reflect.defineMetadata("router", router, constructor);
    return Injectable()(constructor as any);
  };
}
