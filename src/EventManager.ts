import { autoInjectable } from "tsyringe";
import Event from "./Event";

@autoInjectable()
class EventManager {
  private _queue: Array<Event>;

  public constructor() {
    this._queue = new Array();
  }

  public start() {
    setInterval(() => {
      this.dispatchFromQueue();
    }, 500);
  }

  public enqueue(event: Event) {
    let listeners = Reflect.getMetadata("listeners", event.constructor);
    listeners = listeners.map((l: Function) => Reflect.construct(l, []));
    event.addListeners(listeners);
    this._queue.push(event);
  }

  public async dispatch(event: Event) {
    let listeners = Reflect.getMetadata("listeners", event.constructor);
    listeners = listeners.map((l: Function) => Reflect.construct(l, []));
    event.addListeners(listeners);
    event.dispatch();
  }

  private async dispatchFromQueue() {
    const e = this._queue.pop();
    e?.dispatch();
  }
}

export default EventManager;
