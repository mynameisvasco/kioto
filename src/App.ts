import "reflect-metadata";
import { createServer, Server } from "http";
import { Config } from "./Config";
import { RequestHandler } from "./RequestHandler";
import { EventManager } from "./EventManager";
import { Injectable } from "./decorators/DiDecorators";

/**
 * Responsible to hold all needed information
 * to app work.
 */
@Injectable()
export class App {
  /**
   * Config instance.
   */
  private readonly _config: Config;

  /**
   * RequestHandler instance
   */
  private readonly _requestHandler: RequestHandler;

  /**
   * EventManager instance.
   */
  private readonly _eventManager: EventManager;

  /**
   * Server instance.
   */
  private readonly _server: Server;

  /**
   * Instanciates a new app.
   * @param config config instance
   * @param requestHandler request handler instance
   * @param eventManager event manager instance
   */
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

  /**
   * Starts all needed instances to app work.
   */
  public start() {
    const { _eventManager, _requestHandler, _server } = this;
    const eventsInterval = this._config.get<number>("events-interval");
    const port = this._config.get("port");
    _requestHandler.start();
    _eventManager.start(eventsInterval);
    _server.listen(port, () => console.log(`🔥 Kioto running on port ${port}`));
  }
}
