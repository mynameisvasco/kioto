import { EventListener } from "./EventListener";

/**
 * Defines the methods that all
 * events share. This class is not injectable
 */
export class Event {
  private _listeners = new Array<EventListener>();

  /**
   * Instanciates a new event.
   */
  protected constructor() {}

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
