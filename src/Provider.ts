import { Injectable } from "./decorators/DiDecorators";

/**
 * Defines the necessary methods that all
 * providers should implement.
 */
@Injectable()
export abstract class Provider {
  /**
   * Called on register process.
   */
  abstract register(): void;

  /**
   * Called on boot proccess (after register)
   */
  abstract boot(): void;
}
