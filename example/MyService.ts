import { Injectable } from "../src/decorators/DiDecorators";

@Injectable()
export class MyService {
  constructor() {}

  test() {
    return "Hello World from MyService";
  }
}
