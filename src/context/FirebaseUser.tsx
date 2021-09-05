import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import firebase from 'firebase';

type FirebaseUserContextValue = {
  ready: boolean;
  user?: firebase.User;
};

const Context = createContext<FirebaseUserContextValue | null>(null);

interface FirebaseUserContextProps {
  auth: firebase.auth.Auth;
}

export const FirebaseUserContext: React.FC<FirebaseUserContextProps> = ({
  auth,
  children,
}) => {
  const [ready, setReady] = useState<boolean>(false);
  const [user, setUser] = useState<firebase.User>();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(undefined);
      }
      setReady(true);
    });
    return unsubscribe;
  }, [auth]);

  const value = useMemo(
    () => ({
      ready,
      user,
    }),
    [ready, user],
  );

  return <Context.Provider value={value}>{children}</Context.Provider>;
};

export function useFirebaseUser() {
  const session = useContext(Context);
  if (!session) {
    throw new Error('useFirebaseUser without FirebaseUserContext');
  }
  return session;
}
