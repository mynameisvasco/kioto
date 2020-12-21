abstract class EventListener {
  public abstract handle(args: unknown): Promise<any> | any;
}

export default EventListener;
