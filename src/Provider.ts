import { Injectable } from "./decorators/DiDecorators";

@Injectable()
export abstract class Provider {
  abstract boot(): void;
  abstract register(): void;
}
