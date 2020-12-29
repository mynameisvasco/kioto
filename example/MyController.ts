import { IsEmail, Min } from "class-validator";
import { Controller, Get, Post } from "../src/decorators/RoutingDecorators";
import { EventManager } from "../src/EventManager";
import { Request } from "../src/Request";
import { Response } from "../src/Response";
import { MyEvent } from "./MyEvent";

export class TestDto {
  @Min(1, { message: "i must be a number greater or equal to 1" })
  i!: number;

  @IsEmail()
  email!: string;
}

@Controller("test")
export class MyController {
  constructor(private _eventManager: EventManager) {}

  @Get("ab")
  async test(req: Request, res: Response) {
    this._eventManager.enqueue(MyEvent);
    res.send({ message: "worked" });
  }
}
