import * as Fs from "fs";
import * as Path from "path";
import { Injectable } from "./decorators/DiDecorators";

@Injectable()
export class Config {
  private _config: any;

  public constructor() {
    try {
      const configFile = Fs.readFileSync(Path.resolve("nelso.json"), {
        encoding: "utf-8",
      });
      this._config = JSON.parse(configFile);
    } catch (e) {
      throw new Error(
        `nelso.json does not exist in the root of the project, 
        or it's not a valid json file.`
      );
    }
  }

  public get<T>(key: string) {
    let value = this._config;
    key.split(".").forEach((k) => {
      value = value[k];
    });
    return value as T;
  }
}
