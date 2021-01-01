import { Http2ServerRequest } from "http2";
import { Injectable } from "../src/decorators/DiDecorators";
import { HttpException } from "../src/HttpException";

@Injectable()
export class MyService {
  constructor() {}

  test() {
    return "Hello World from MyService";
  }

  async test2() {
    throw new HttpException("123", 400);
  }
}
