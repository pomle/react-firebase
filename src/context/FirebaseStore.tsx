import { useEntity, createStoreContext } from '@pomle/react-flat-store';

function useEntities() {
  return {
    data: useEntity<unknown>(),
  };
}

const Context = createStoreContext(useEntities);

type FirebaseStoreContext = ({
  children,
}: {
  children: React.ReactNode;
}) => React.FunctionComponentElement<
  React.ProviderProps<ReturnType<typeof useEntities>>
>;

export const FirebaseStoreContext = Context.StoreContext as FirebaseStoreContext;

export const useFirebaseStore = Context.useStore;
