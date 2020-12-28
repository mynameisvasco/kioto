export abstract class Provider {
  abstract boot(): void;
  abstract register(): void;
}
