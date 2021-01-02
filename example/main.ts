import "reflect-metadata";
import { AppFactory } from "../src/AppFactory";
import { Di } from "../src/Di";
import { Provider } from "../src/Provider";
import { IntParserMiddleware } from "../src/middlewares/IntParserMiddleware";
import { MyProvider } from "./MyProvider";

function register() {
  Di.bind(Provider).to(MyProvider);
  const providers = Di.getAll(Provider);
  providers.forEach((p) => p.register());
}

function boot() {
  const providers = Di.getAll(Provider);
  providers.forEach((p) => p.boot());
}

const app = AppFactory.build();
register();
boot();
app.start();
