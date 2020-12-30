import { App } from "./App";
import { Config } from "./Config";
import { Di } from "./Di";
import { EventManager } from "./EventManager";
import { RequestHandler } from "./RequestHandler";

/**
 * Responsible to create an app.
 */
export class AppFactory {
  /**
   * Bind all needed dependencies to an app
   * work.
   */
  public static build() {
    Di.bind(Config).toSelf();
    Di.bind(RequestHandler).toSelf();
    Di.bind(EventManager).toSelf();
    Di.bind(App).toSelf();
    return Di.resolve(App);
  }
}
