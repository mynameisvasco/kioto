import "reflect-metadata";
import { createServer, Server } from "http";
import Config from "./Config";
import RequestHandler from "./RequestHandler";
import EventManager from "./EventManager";
import { Injectable } from "./decorators/DiDecorators";

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
    const eventsInterval = this._config.get<number>("events-interval");
    const port = this._config.get("port");
    this._requestHandler.start();
    this._eventManager.start(eventsInterval);
    this._server.listen(port, () =>
      console.log(`🔥 Pluto running on port ${port}`)
    );
  }
}

export default App;
