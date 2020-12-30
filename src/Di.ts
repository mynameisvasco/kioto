import { Container } from "inversify";

/**
 * Di container
 */
export const Di = new Container({
  autoBindInjectable: true,
  defaultScope: "Singleton",
});

/**
 * Types needed for dependency injection
 */
export const Types = {
  Controller: Symbol.for("Controller"),
};
