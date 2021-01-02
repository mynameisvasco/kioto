import { Injectable } from "../src/decorators/DiDecorators";
import { Di, Types } from "../src/Di";
import { Middleware } from "../src/Middleware";
import { MyController } from "./MyController";
import { MyMiddleware } from "./MyMiddleware";

@Injectable()
export class MyProvider {
  register() {
    Di.bind(Types.Controller).to(MyController);
    Di.bind(Middleware).to(MyMiddleware);
  }

  boot() {}
}
