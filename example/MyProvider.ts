import { Injectable } from "../src/decorators/DiDecorators";
import { Di, Types } from "../src/Di";
import { Event } from "../src/Event";
import { MyController } from "./MyController";
import { MyEvent } from "./MyEvent";

@Injectable()
export class MyProvider {
  register() {
    Di.bind(Types.Controller).to(MyController);
    Di.bind(Event).to(MyEvent);
  }

  boot() {}
}
