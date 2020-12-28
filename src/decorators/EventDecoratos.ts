import { Injectable } from "./DiDecorators";

export function Listeners(listeners: Function[]) {
  return (constructor: Function) => {
    Reflect.defineMetadata("listeners", listeners, constructor);
    return Injectable()(constructor as any);
  };
}
