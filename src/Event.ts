import { Injectable } from "./decorators/DiDecorators";
import { EventListener } from "./EventListener";

/**
 * Defines the methods that all
 * events share.
 */
@Injectable()
export class Event {
  private _listeners: Array<EventListener>;

  /**
   * Instanciates a new event.
   */
  protected constructor() {
    this._listeners = new Array();
  }

  /**
   * Dispatches this event.
   */
  public dispatch(): void {
    this._listeners.forEach((l) => l.handle(this));
  }

  /**
   * Adds an array of listeners to the event.
   * @param listeners listeners to be added
   */
  public addListeners(listeners: EventListener[]): void {
    this._listeners = this._listeners.concat(listeners);
  }
}
