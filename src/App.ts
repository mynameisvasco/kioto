import "reflect-metadata";
import { createServer, Server } from "http";
import { autoInjectable } from "tsyringe";
import { RouteMetadata } from "./Decorators";
import Config from "./Config";
import RequestHandler from "./RequestHandler";
import Router from "./Router";
import EventManager from "./EventManager";

@autoInjectable()
class App {
  private readonly _config: Config;
  private readonly _requestHandler: RequestHandler;
  private readonly _eventManager: EventManager;
  private readonly _server: Server;

  public constructor(
    config: Config,
    requestHandler: RequestHandler,
    eventManager: EventManager
  ) {
    this._config = config;
    this._requestHandler = requestHandler;
    this._eventManager = eventManager;
    this._server = createServer(
      this._requestHandler.handleRequest.bind(this._requestHandler)
    );
  }

  public start() {
    const port = this._config.get("port");
    this._server.listen(port, () => {
      console.log(`🔥 Pluto running on port ${port}`);
    });
    this._eventManager.start();
  }

  public useRouters(routers: Router[]) {
    routers.forEach((r) => this._requestHandler.useRouter(r));
  }

  public useControllers(controllers: Function[]) {
    controllers.forEach((c) => {
      const cInstance = Reflect.construct(c, []);
      const router: Router = Reflect.getMetadata("router", c);
      const routesMetadata = Reflect.getMetadata("routeMetadata", c.prototype);
      routesMetadata.forEach((rMetadata: RouteMetadata) => {
        rMetadata.route.use(rMetadata.handler.bind(cInstance));
        router.useRoute(rMetadata.route);
      });
      this._requestHandler.useRouter(router);
    });
  }
}

export default App;
