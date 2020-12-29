import { Injectable } from "./decorators/DiDecorators";
import { EventListener } from "./EventListener";

@Injectable()
export abstract class Event {
  private _listeners: Array<EventListener>;

  protected constructor() {
    this._listeners = new Array();
  }

  public dispatch() {
    this._listeners.forEach((l) => l.handle(this));
  }

  public addListeners(listeners: EventListener[]) {
    this._listeners = this._listeners.concat(listeners);
  }

  public abstract getArgs(): any;
}
