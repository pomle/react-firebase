import * as lib from './index';

describe('index', () => {
  it('exports expected', () => {
    expect(lib.FirebaseAuthContext).toBeTruthy();
    expect(lib.FirebaseStoreContext).toBeTruthy();
    expect(lib.useFirebaseStore).toBeTruthy();
    expect(lib.useFirebaseAuth).toBeTruthy();
    expect(lib.CollectionResult).toBeTruthy();
    expect(lib.useCollectionResult).toBeTruthy();
  });
});
