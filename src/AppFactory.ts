import { App } from "./App";
import { Config } from "./Config";
import { Di } from "./Di";
import { EventManager } from "./EventManager";
import { Middleware } from "./Middleware";
import { RequestParserMiddleware } from "./middlewares/RequestParserMiddleware";
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
    Di.bind(Middleware).to(RequestParserMiddleware);
    Di.bind(App).toSelf();
    const app = Di.resolve(App);
    app.useGlobalMiddleware([RequestParserMiddleware]);
    return app;
  }
}
