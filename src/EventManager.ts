import { Injectable } from "./decorators/DiDecorators";
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
  public enqueue(event: Event): void {
    let listeners = Reflect.getMetadata("event:listeners", event.constructor);
    listeners = listeners.map((l: Function) => Reflect.construct(l, []));
    event.addListeners(listeners);
    this._queue.push(event);
  }

  /**
   * Dispatches a new event immediately.
   * @param event event to be dispatched
   */
  public dispatch(event: Event): void {
    let listeners = Reflect.getMetadata("event:listeners", event.constructor);
    listeners = listeners.map((l: Function) => Reflect.construct(l, []));
    event.addListeners(listeners);
    event.dispatch();
  }

  /**
   * Dispatches next queued event.
   */
  private dispatchFromQueue(): void {
    const e = this._queue.pop();
    e?.dispatch();
  }
}
