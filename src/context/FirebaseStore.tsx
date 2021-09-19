import React, {
  createContext,
  useContext,
  useState,
  useMemo,
  useCallback,
} from 'react';
import { throttle } from 'lib/throttle';

type Entries = Record<string, unknown>;

type FirebaseStoreContextValue = {
  store: Entries;
  update: (entries: Entries) => void;
  queue: (id: string, data: unknown) => void;
};

const Context = createContext<FirebaseStoreContextValue | null>(null);

const EMPTY = {};

export const FirebaseStoreContext: React.FC = ({ children }) => {
  const [store, setStore] = useState<Entries>(EMPTY);

  const update = useCallback(
    (entries: Entries) => {
      setStore((store) => {
        return { ...store, ...entries };
      });
    },
    [setStore],
  );

  const queue = useMemo(() => {
    let buffer: Entries = {};

    const flush = throttle(() => {
      update(buffer);
      buffer = {};
    }, 150);

    return (id: string, data: unknown) => {
      buffer[id] = data;
      flush();
    };
  }, [update]);

  const value = useMemo(
    () => ({
      store,
      update,
      queue,
    }),
    [store, update, queue],
  );

  return <Context.Provider value={value}>{children}</Context.Provider>;
};

export function useFirebaseStore() {
  const context = useContext(Context);
  if (context === null) {
    throw new Error('useFirebaseStore without FirebaseStoreContext');
  }
  return context;
}
