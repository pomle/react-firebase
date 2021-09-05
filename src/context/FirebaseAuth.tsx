import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import firebase from 'firebase';

type FirebaseAuthContextValue = {
  ready: boolean;
  auth: firebase.auth.Auth;
  user?: firebase.User;
};

const Context = createContext<FirebaseAuthContextValue | null>(null);

interface FirebaseAuthContextProps {
  auth: firebase.auth.Auth;
}

export const FirebaseAuthContext: React.FC<FirebaseAuthContextProps> = ({
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
      auth,
      user,
    }),
    [ready, auth, user],
  );

  return <Context.Provider value={value}>{children}</Context.Provider>;
};

export function useFirebaseAuth() {
  const session = useContext(Context);
  if (!session) {
    throw new Error('useFirebaseAuth without FirebaseAuthContext');
  }
  return session;
}
