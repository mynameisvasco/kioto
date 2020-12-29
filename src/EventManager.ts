import { Injectable } from "./decorators/DiDecorators";
import { Di } from "./Di";
import { Event } from "./Event";

@Injectable()
export class EventManager {
  private _queue: Array<Event>;

  public constructor() {
    this._queue = new Array();
  }

  public start(interval: number) {
    setInterval(() => {
      this.dispatchFromQueue();
    }, interval);
  }

  public enqueue(event: Function) {
    const eventInstance = Di.get<Event>(event);
    let listeners = Reflect.getMetadata("listeners", event);
    listeners = listeners.map((l: Function) => Reflect.construct(l, []));
    eventInstance.addListeners(listeners);
    this._queue.push(eventInstance);
  }

  public async dispatch(event: Function) {
    const eventInstance = Di.get<Event>(event);
    let listeners = Reflect.getMetadata("listeners", event);
    listeners = listeners.map((l: Function) => Reflect.construct(l, []));
    eventInstance.addListeners(listeners);
    eventInstance.dispatch();
  }

  private async dispatchFromQueue() {
    const e = this._queue.pop();
    e?.dispatch();
  }
}
