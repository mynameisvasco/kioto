import "reflect-metadata";
import { Controller, Get, Listeners } from "../src/Decorators";
import AppFactory from "../src/AppFactory";
import Event from "../src/Event";
import EventListener from "../src/EventListener";
import EventManager from "../src/EventManager";
import Middleware from "../src/Middleware";
import Request from "../src/Request";
import Response from "../src/Response";

interface ITestEventArgs {
  date: Date;
}

class TestEventListener extends EventListener {
  public handle(args: ITestEventArgs) {
    console.log("From Test Listener --> " + args.date.toISOString());
  }
}

class Test2EventListener extends EventListener {
  public handle(args: ITestEventArgs) {
    console.log("From Test2 Listener --> " + args.date.toISOString());
  }
}

@Listeners([TestEventListener, Test2EventListener])
class TestEvent extends Event {
  public constructor(args: ITestEventArgs) {
    super(args);
  }
}

class TestControllerMiddleware extends Middleware {
  public handle(req: Request, res: Response, next: Function) {
    console.log("CONTROLLER MIDDLEWARE");
    next();
  }
}

@Controller("test", [TestControllerMiddleware])
class MyController {
  public constructor(private _eventManager: EventManager) {}

  @Get("hello/:id")
  public async hello(req: Request, res: Response) {
    this._eventManager.enqueue(new TestEvent({ date: new Date() }));
    res.sendText("Hello World!");
  }
}

const app = AppFactory.createApp();
app.useControllers([MyController]);
app.start();
