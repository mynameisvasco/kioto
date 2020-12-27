import { Container } from "inversify";

export const Di = new Container({
  autoBindInjectable: true,
  defaultScope: "Singleton",
});

export const Types = {
  Controller: Symbol.for("Controller"),
  Service: Symbol.for("Service"),
};
