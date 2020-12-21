import { container } from "tsyringe";
import App from "./App";
import Config from "./Config";
import EventManager from "./EventManager";
import RequestHandler from "./RequestHandler";

class AppFactory {
  public static createApp() {
    container.registerSingleton(Config);
    container.registerSingleton(RequestHandler);
    container.registerSingleton(EventManager);
    container.registerSingleton(App);
    return container.resolve(App);
  }
}

export default AppFactory;
