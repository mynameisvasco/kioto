export class Utils {
  public static sanitizeUrl(url: string = "/") {
    let sanitizedUrl = url.replace(/([^:]\/)\/+/g, "$1");
    return sanitizedUrl;
  }

  public static createObject<TEntity>(type: { new (): TEntity }): TEntity {
    return new type();
  }
}
