import { RequestDelegate } from "../RequestHandler";
import { Injectable } from "./DiDecorators";

export interface RouteMeta {
  path: string;
  method: string;
  middlewares: Function[];
  handler: RequestDelegate;
}

export function defineRouteMetadata(
  path: string,
  method: string,
  middlewares: Function[] = [],
  target: any,
  handler: RequestDelegate
) {
  const routeMeta: RouteMeta = {
    path,
    method,
    middlewares,
    handler,
  };
  let routesMetas = Reflect.getMetadata("controller:routesMeta", target);
  if (!routesMetas) routesMetas = new Array<RouteMeta>();
  routesMetas.push(routeMeta);
  Reflect.defineMetadata("controller:routesMeta", routesMetas, target);
}

export function Get(path: string = "", middlewares: Function[] = []) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    defineRouteMetadata(path, "GET", middlewares, target, descriptor.value);
  };
}

export function Post(path: string = "", middlewares: Function[] = []) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    defineRouteMetadata(path, "POST", middlewares, target, descriptor.value);
  };
}

export function Put(path: string = "", middlewares: Function[] = []) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    defineRouteMetadata(path, "PUT", middlewares, target, descriptor.value);
  };
}

export function Delete(path: string = "", middlewares: Function[] = []) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    defineRouteMetadata(path, "DELETE", middlewares, target, descriptor.value);
  };
}

export function Controller(
  basePath: string = "",
  middlewares: Function[] = []
) {
  return (constructor: Function) => {
    Reflect.defineMetadata("controller:middlewares", middlewares, constructor);
    Reflect.defineMetadata("controller:basePath", basePath, constructor);
    return Injectable()(constructor as any);
  };
}
