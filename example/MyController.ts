import { IsEmail, Min } from "class-validator";
import { Controller, Post } from "../src/decorators/RoutingDecorators";
import EventManager from "../src/EventManager";
import Request from "../src/Request";
import Response from "../src/Response";
import { MyEvent } from "./MyEvent";
import { MyService } from "./MyService";

export class TestDto {
  @Min(1, { message: "i must be a number greater or equal to 1" })
  i!: number;

  @IsEmail()
  email!: string;
}

@Controller("bb")
export class MyController {
  constructor(private _eventManager: EventManager) {}

  @Post("a")
  async test(req: Request, res: Response) {
    const body = await req.body(TestDto);
    console.log(body);
    this._eventManager.enqueue(MyEvent);
    res.sendJson({ message: "worked" });
  }
}
