import "reflect-metadata";
import App from "../src/App";
import AppFactory from "../src/AppFactory";
import { MyController } from "./MyController";
import { MyEvent } from "./MyEvent";
import { MyService } from "./MyService";

function configure() {
  AppFactory.useControllers([MyController])
    .useEvents([MyEvent])
    .useProviders([MyService]);
}

async function bootstrap() {
  const app = AppFactory.build();
  app.start();
}

configure();
bootstrap();
