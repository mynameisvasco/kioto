import { inject, injectable } from "inversify";

export function Injectable() {
  return (constructor: Function) => {
    return injectable()(constructor as any);
  };
}

export function Inject(token: any) {
  return function (
    target: Object,
    propertyKey: string,
    parameterIndex: number
  ) {
    return inject(token)(target, propertyKey, parameterIndex);
  };
}
