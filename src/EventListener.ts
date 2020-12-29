import { Event } from "./Event";

export abstract class EventListener {
  public abstract handle(event: Event): Promise<any> | any;
}
