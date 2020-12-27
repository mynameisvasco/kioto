import Event from "./Event";

abstract class EventListener {
  public abstract handle(event: Event): Promise<any> | any;
}

export default EventListener;
