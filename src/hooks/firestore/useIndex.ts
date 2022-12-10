import { useCallback } from 'react';
import { useFirebaseStore } from 'context/FirebaseStore';

export function useIndex<T>(path: (id: string) => string) {
  const { set: setEntry, get: getEntry } = useFirebaseStore().data.entries;

  const get = useCallback(
    (id: string) => {
      const key = path(id);
      return getEntry(key).data as T | undefined;
    },
    [path, getEntry],
  );

  const set = useCallback(
    (id: string, data: T) => {
      const key = path(id);
      setEntry(key, data);
    },
    [path, setEntry],
  );

  return {
    get,
    set,
  };
}
