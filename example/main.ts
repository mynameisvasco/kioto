import "reflect-metadata";
import AppFactory from "../src/AppFactory";
import { Di } from "../src/Di";
import { Provider } from "../src/Provider";
import { MyProvider } from "./MyProvider";

AppFactory.useProviders([MyProvider]);

function register() {
  const providers = Di.getAll(Provider);
  providers.forEach((p) => p.register());
}

function boot() {
  const providers = Di.getAll(Provider);
  providers.forEach((p) => p.boot());
}

async function bootstrap() {
  const app = AppFactory.build();
  app.start();
}

register();
boot();
bootstrap();
