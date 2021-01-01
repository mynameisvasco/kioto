import { IsEmail, Min } from "class-validator";
import { Http2ServerRequest } from "http2";
import { Controller, Get, Post } from "../src/decorators/RoutingDecorators";
import { EventManager } from "../src/EventManager";
import { HttpException } from "../src/HttpException";
import { Request } from "../src/Request";
import { Response } from "../src/Response";
import { MyEvent } from "./MyEvent";
import { MyMiddleware } from "./MyMiddleware";
import { MyService } from "./MyService";

export class TestDto {
  @Min(1, { message: "i must be a number greater or equal to 1" })
  i!: number;

  @IsEmail()
  email!: string;
}

class TestQueries {
  @Min(0)
  id!: number;

  @IsEmail()
  email!: string;
}

@Controller("test")
export class MyController {
  constructor(
    private _eventManager: EventManager,
    private _myservice: MyService
  ) {}

  @Get("ab", [MyMiddleware])
  async test(req: Request, res: Response) {
    await this._myservice.test2();
    this._eventManager.enqueue(MyEvent);
    res.send({ message: "worked" });
  }
}
