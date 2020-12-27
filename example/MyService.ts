import { Injectable } from "../src/Decorators";

@Injectable()
export class MyService {
  constructor() {}

  test() {
    return "Hello World from MyService";
  }
}
