import * as lib from './index';

describe('index', () => {
  it('exports useFirebaseStore hook', () => {
    expect(lib.useFirebaseStore).toBeTruthy();
  });

  it('exports useCollectionResult hook', () => {
    expect(lib.useCollectionResult).toBeTruthy();
  });
});
