import { useMemo, useRef } from 'react';
import { CollectionResult } from './CollectionResult';

export function useStableIndex<T>(
  ids: string[],
  get: (id: string) => T | undefined,
) {
  const initial = useMemo(() => new CollectionResult<T>(), []);

  const cache = useRef<CollectionResult<T>>(initial);

  return useMemo(() => {
    if (ids.length === 0) {
      return initial;
    }

    const result = new CollectionResult<T>();

    let updateCache = ids.length !== cache.current.size;

    for (const id of ids) {
      const content = get(id);
      if (!content) {
        return initial;
      }

      result.set(id, content);
      if (cache.current.get(id) !== content) {
        updateCache = true;
      }
    }

    if (updateCache) {
      cache.current = result;
    }

    return cache.current;
  }, [ids, get, initial]);
}
