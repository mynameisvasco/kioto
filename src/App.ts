import "reflect-metadata";
import { createServer, Server } from "http";
import { Injectable, RouteInfo } from "./Decorators";
import Config from "./Config";
import RequestHandler from "./RequestHandler";
import Router from "./Router";
import EventManager from "./EventManager";
import { Container } from "inversify";
import { Di, Types } from "./Di";
import Event from "./Event";

@Injectable()
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
    this.startControllers();
    this.startEventManager();
    this.startServer();
  }

  private startControllers() {
    const controller = Di.getAll<any>(Types.Controller);
    for (var c of controller) {
      const router = Reflect.getMetadata("router", c.constructor) as Router;
      const routesInfo = Reflect.getMetadata("routes-info", c) as RouteInfo[];
      for (var routeInfo of routesInfo) {
        routeInfo.route.use(routeInfo.handler.bind(c));
      }
      router.useRoutes(routesInfo.map((r) => r.route));
      this._requestHandler.useRouter(router);
    }
  }

  private startEvents() {
    const events = Di.getAll<Event>(Types.Controller);
    for (var e of events) {
      const listeners = Reflect.getMetadata("listeners", e.constructor);
      e.addListeners(listeners);
    }
  }

  private startServer() {
    const port = this._config.get("port");
    this._server.listen(port, () => {
      console.log(`🔥 Pluto running on port ${port}`);
    });
  }

  private startEventManager() {
    const eventsInterval = this._config.get<number>("events-interval");
    this._eventManager.start(eventsInterval);
  }
}

export default App;
