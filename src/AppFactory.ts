import { Container, interfaces } from "inversify";
import App from "./App";
import Config from "./Config";
import { Di, Types } from "./Di";
import Event from "./Event";
import EventManager from "./EventManager";
import Middleware from "./Middleware";
import { Provider } from "./Provider";
import RequestHandler from "./RequestHandler";

class AppFactory {
  public static useProviders(providers: interfaces.Newable<any>[]) {
    providers.forEach((p) => Di.bind(Provider).to(p));
    return this;
  }

  public static build() {
    Di.bind(Config).toSelf();
    Di.bind(RequestHandler).toSelf();
    Di.bind(EventManager).toSelf();
    Di.bind(App).toSelf();
    return Di.resolve(App);
  }
}

export default AppFactory;
