import { useCallback } from 'react';
import { firestore } from 'firebase/app';
import { Entry } from './types';
import { useStableIndex } from './useStableIndex';
import { useSubscribers } from './useSubscribers';
import { useIndex } from './useIndex';
import { CollectionResult } from './CollectionResult';
import { useStableIds } from './useStableIds';

function usePath(collection: firestore.CollectionReference) {
  return useCallback((id: string) => `${collection.path}/${id}`, [collection]);
}

export function useCollectionResult<T>(
  collection: firestore.CollectionReference<T>,
  unstableIds: string[],
): CollectionResult<Entry<T>> {
  const ids = useStableIds(unstableIds);

  const path = usePath(collection);

  const index = useIndex<Entry<T>>(path);

  useSubscribers(collection, index.set, ids);

  return useStableIndex<Entry<T>>(ids, index.get);
}
