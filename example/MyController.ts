import { Controller, Get } from "../src/Decorators";
import EventManager from "../src/EventManager";
import Request from "../src/Request";
import Response from "../src/Response";
import { MyEvent } from "./MyEvent";
import { MyService } from "./MyService";

@Controller("bb")
export class MyController {
  constructor(
    private _myService: MyService,
    private _eventManager: EventManager
  ) {}

  @Get("a")
  async test(req: Request, res: Response) {
    const test = this._myService.test();
    this._eventManager.enqueue(MyEvent);
    res.sendJson({ test });
  }
}
