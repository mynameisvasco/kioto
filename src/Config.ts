import * as Fs from "fs";
import * as Path from "path";
import { Injectable } from "./decorators/DiDecorators";

/**
 * Responsible to read nelso.json file
 * and provide the contents as an object.
 */
@Injectable()
export class Config {
  /**
   * Object that contains all config keys and values.
   */
  private _config: any;

  /**
   * Instanciates a new Config
   */
  public constructor() {
    try {
      const configPath = Path.resolve("nelso.json");
      const configFile = Fs.readFileSync(configPath, {
        encoding: "utf-8",
      });
      this._config = JSON.parse(configFile);
    } catch (e) {
      throw new Error(
        `The file nelso.json does not exist in the root of the project, 
        or it's not a valid json file.`
      );
    }
  }

  /**
   * Returns the value associated with the provided key,
   * for example `db.host`, `enable-logging`, etc.
   * @param key config key
   */
  public get<T>(key: string): T {
    let value = this._config;
    key.split(".").forEach((k) => {
      value = value[k];
    });
    return value as T;
  }
}
