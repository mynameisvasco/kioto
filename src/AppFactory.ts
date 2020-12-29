import { App } from "./App";
import { Config } from "./Config";
import { Di } from "./Di";
import { EventManager } from "./EventManager";
import { RequestHandler } from "./RequestHandler";

export class AppFactory {
  public static build() {
    Di.bind(Config).toSelf();
    Di.bind(RequestHandler).toSelf();
    Di.bind(EventManager).toSelf();
    Di.bind(App).toSelf();
    return Di.resolve(App);
  }
}
