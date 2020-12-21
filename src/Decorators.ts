import { autoInjectable } from "tsyringe";

import Middleware from "./Middleware";
import { RequestDelegate } from "./RequestHandler";
import Route from "./Route";
import Router from "./Router";

export interface RouteMetadata {
  route: Route;
  handler: RequestDelegate;
}

function defineRouteMetadata(
  path: string,
  method: string,
  middleware: Function[],
  target: any,
  handler: RequestDelegate
) {
  const route = new Route(path, method);
  const rMetadata: RouteMetadata = {
    handler,
    route,
  };
  middleware.map((m) => {
    const mInstance: Middleware = Reflect.construct(m, []);
    route.use(mInstance.handle.bind(mInstance) as RequestDelegate);
  });
  let rMetadatas = Reflect.getMetadata("routeMetadata", target);
  if (!rMetadatas) rMetadatas = new Array<RouteMetadata>();
  rMetadatas.push(rMetadata);
  Reflect.defineMetadata("routeMetadata", rMetadatas, target);
}

function Get(path: string, middleware: Function[] = []) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    defineRouteMetadata(path, "GET", middleware, target, descriptor.value);
  };
}

function Post(path: string, middleware: Function[] = []) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    defineRouteMetadata(path, "POST", middleware, target, descriptor.value);
  };
}

function Put(path: string, middleware: Function[] = []) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    defineRouteMetadata(path, "PUT", middleware, target, descriptor.value);
  };
}

function Delete(path: string, middleware: Function[] = []) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    defineRouteMetadata(path, "DELETE", middleware, target, descriptor.value);
  };
}

function Controller(baseUrl: string, middleware: Function[] = []) {
  return (constructor: Function) => {
    const router = new Router(baseUrl);
    middleware.forEach((m) =>
      router.use(Reflect.construct(m, []).handle.bind(m))
    );
    Reflect.defineMetadata("router", router, constructor);
    return autoInjectable()(constructor as any);
  };
}

function Listeners(listeners: Function[]) {
  return (constructor: Function) => {
    Reflect.defineMetadata("listeners", listeners, constructor);
    return autoInjectable()(constructor as any);
  };
}

export { Get, Post, Put, Delete, Controller, Listeners };
