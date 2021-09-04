export class CollectionResult<T> extends Map<string, T> {
  static from<T>(source: Record<string, T>): CollectionResult<T> {
    const me = new CollectionResult<T>();
    for (const key of Object.keys(source)) {
      me.set(key, source[key]);
    }
    return me;
  }

  map<R>(fn: (result: T, index: number) => R): R[] {
    let i = 0;
    return Array.from(this).map(([, value]) => fn(value, i++));
  }
}
