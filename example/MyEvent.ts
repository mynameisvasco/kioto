import { Listeners } from "../src/decorators/EventDecoratos";
import { Event } from "../src/Event";
import { MyEventListener } from "./MyEventListener";
import { MyService } from "./MyService";

interface MyEventArgs {
  text: string;
}

@Listeners([MyEventListener])
export class MyEvent extends Event {
  constructor(private myService?: MyService) {
    super();
  }

  getArgs() {
    return { text: this.myService!.test() } as MyEventArgs;
  }
}
