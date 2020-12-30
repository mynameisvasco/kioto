import { Event } from "./Event";

/**
 * Defines the necessary methods that all
 * event listeners should implement. This class
 * is not injectable, all needed objects should
 * be passed using the event.
 */
export abstract class EventListener {
  /**
   * Called when the event that this listener is listening to
   * is dispatched.
   * @param event dispatched event
   */
  public abstract handle(event: Event): Promise<any> | any;
}
