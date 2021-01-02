import { Listeners } from "../src/decorators/EventDecoratos";
import { Event } from "../src/Event";
import { MyEventListener } from "./MyEventListener";

@Listeners([MyEventListener])
export class MyEvent extends Event {
  message: string;

  constructor(message: string) {
    super();
    this.message = message;
  }
}
