import EventListener from "./EventListener";

abstract class Event {
  private _listeners: Array<EventListener>;
  private _args: unknown;

  protected constructor(args: unknown) {
    this._listeners = new Array();
    this._args = args;
  }

  public dispatch() {
    this._listeners.forEach((l) => l.handle(this._args));
  }

  public addListener(listener: EventListener) {
    this._listeners.push(listener);
  }

  public addListeners(listeners: EventListener[]) {
    this._listeners = this._listeners.concat(listeners);
  }
}

export default Event;
