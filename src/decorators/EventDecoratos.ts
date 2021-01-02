export function Listeners(listeners: Function[]) {
  return (constructor: Function) => {
    Reflect.defineMetadata("event:listeners", listeners, constructor);
  };
}
