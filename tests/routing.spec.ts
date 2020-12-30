import { Request } from "../src/Request";
import { Response } from "../src/Response";
import { Route } from "../src/Route";
import { Router } from "../src/Router";

describe("Routing", () => {
  let router: Router;
  let route1: Route;
  let route2: Route;

  console.log = () => {};

  test("Create router instance /abc", () => {
    router = new Router("/abc");
    expect(router).toBeDefined();
    expect(router.basePath).toBe("/abc");
    expect(router.queue.length).toBe(0);
  });

  test("Add 2 functions to router execution queue", () => {
    router.use(async (req, res, next) => {
      console.log(123);
      next();
    });
    router.use(async (req, res, next) => {
      console.log(421);
      next();
    });
    expect(router.queue.length).toBe(2);
    expect(router.queue[0]).toBeInstanceOf(Function);
    expect(router.queue[1]).toBeInstanceOf(Function);
  });

  test("Execute router execution queue", async () => {
    const consoleSpy = jest.spyOn(console, "log");
    const fakeReq = {} as Request;
    const fakeRes = {} as Response;
    await router.handle(fakeReq, fakeRes);
    expect(consoleSpy).toBeCalledTimes(2);
  });

  test("Create route GET to /1", () => {
    route1 = new Route("/1", "GET");
    expect(route1).toBeDefined();
    expect(route1.path).toBe("/1");
    expect(route1.queue.length).toBe(0);
  });

  test("Create route POST to /2", () => {
    route2 = new Route("2", "POST");
    expect(route2).toBeDefined();
    expect(route2.path).toBe("/2");
    expect(route2.queue.length).toBe(0);
  });

  test("Assign routes to router", () => {
    router.useRoutes([route1, route2]);
    expect(router.queue.length).toBe(2);
  });

  test("Routes path should include router base path", () => {
    expect(route1.path).toBe("/abc/1");
    expect(route2.path).toBe("/abc/2");
  });

  test("Add 1 function to route GET /1 execution queue", () => {
    route1.use(async (req, res, next) => {
      console.log(123);
    });
    expect(route1.queue.length).toBe(1);
    expect(route1.queue[0]).toBeInstanceOf(Function);
  });

  test("Add 1 functions to route POST /2 execution queue", () => {
    route2.use(async (req, res, next) => {
      console.log(123);
    });
    expect(route2.queue.length).toBe(1);
    expect(route2.queue[0]).toBeInstanceOf(Function);
  });

  test("Execute routes execution queue GET /1 and POST /2", async () => {
    const consoleSpy = jest.spyOn(console, "log");
    const fakeReq = {} as Request;
    const fakeRes = {} as Response;
    await route1.handle(fakeReq, fakeRes);
    await route2.handle(fakeReq, fakeRes);
    expect(consoleSpy).toBeCalledTimes(4);
  });
});
