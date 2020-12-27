import { Container, interfaces } from "inversify";
import App from "./App";
import Config from "./Config";
import { Di, Types } from "./Di";
import Event from "./Event";
import EventManager from "./EventManager";
import RequestHandler from "./RequestHandler";

class AppFactory {
  public static useControllers(controllers: interfaces.Newable<any>[]) {
    controllers.forEach((c) => Di.bind<any>(Types.Controller).to(c));
    return this;
  }

  public static useProviders(providers: interfaces.Newable<any>[]) {
    providers.forEach((p) => Di.bind<any>(p).toSelf());
    return this;
  }

  public static useEvents(events: interfaces.Newable<any>[]) {
    events.forEach((e) => Di.bind(Event).to(e).inTransientScope());
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
