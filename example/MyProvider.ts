import { Injectable } from "../src/decorators/DiDecorators";
import { Di, Types } from "../src/Di";
import { Event } from "../src/Event";
import { Middleware } from "../src/Middleware";
import { MyController } from "./MyController";
import { MyEvent } from "./MyEvent";
import { MyMiddleware } from "./MyMiddleware";

@Injectable()
export class MyProvider {
  register() {
    Di.bind(Types.Controller).to(MyController);
    Di.bind(Event).to(MyEvent);
    Di.bind(Middleware).to(MyMiddleware);
  }

  boot() {}
}
