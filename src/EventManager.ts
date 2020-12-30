import { Injectable } from "./decorators/DiDecorators";
import { Di } from "./Di";
import { Event } from "./Event";

/**
 * Responsible for manage events
 */
@Injectable()
export class EventManager {
  /**
   * Queue of events ready to dispatch
   */
  private _queue: Array<Event>;

  /**
   * Instanciates a new EventManager
   */
  public constructor() {
    this._queue = new Array();
  }

  /**
   * Starts the event manager
   * @param interval interval between dispatch of events in milliseconds
   */
  public start(interval: number): void {
    setInterval(() => {
      this.dispatchFromQueue();
    }, interval);
  }

  /**
   * Queues a new event.
   * @param event event to be queued
   */
  public enqueue(event: Function): void {
    const eventInstance = Di.get<Event>(event);
    let listeners = Reflect.getMetadata("event:listeners", event);
    listeners = listeners.map((l: Function) => Reflect.construct(l, []));
    eventInstance.addListeners(listeners);
    this._queue.push(eventInstance);
  }

  /**
   * Dispatches a new event immediately.
   * @param event event to be dispatched
   */
  public dispatch(event: Function): void {
    const eventInstance = Di.get<Event>(event);
    let listeners = Reflect.getMetadata("listeners", event);
    listeners = listeners.map((l: Function) => Reflect.construct(l, []));
    eventInstance.addListeners(listeners);
    eventInstance.dispatch();
  }

  /**
   * Dispatches next queued event.
   */
  private dispatchFromQueue(): void {
    const e = this._queue.pop();
    e?.dispatch();
  }
}
