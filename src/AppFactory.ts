import { App } from "./App";
import { Config } from "./Config";
import { Di } from "./Di";
import { EventManager } from "./EventManager";
import { Middleware } from "./Middleware";
import { BodyParserMiddleware } from "./middlewares/BodyParserMiddleware";
import { DateParserMiddleware } from "./middlewares/DateParserMiddleware";
import { IntParserMiddleware } from "./middlewares/IntParserMiddleware";
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
    Di.bind(Middleware).to(IntParserMiddleware);
    Di.bind(Middleware).to(BodyParserMiddleware);
    Di.bind(Middleware).to(DateParserMiddleware);
    Di.bind(App).toSelf();
    const app = Di.resolve(App);
    app.useGlobalMiddleware([
      BodyParserMiddleware,
      IntParserMiddleware,
      DateParserMiddleware,
    ]);
    return app;
  }
}
