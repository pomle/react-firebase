import { renderHook } from '@testing-library/react-hooks';
import { ResultMap } from '../CollectionResult';
import { useStableIndex } from '../useStableIndex';

function createIndex(store: Record<string, unknown>) {
  return (key: string) => store[key];
}

describe('useStableIndex', () => {
  const source: Record<string, string> = {
    a: 'Alpha',
    b: 'Beta',
    c: 'Citrus',
    d: 'Delta',
    e: 'Epsilon',
    f: 'Foxtrot',
  };

  it('returns empty if any source not found', () => {
    const ids = ['x', 'c', 'd'];

    const index = createIndex(source);

    const hook = renderHook(({ ids, index }) => useStableIndex(ids, index), {
      initialProps: {
        ids,
        index,
      },
    });

    expect(hook.result.current).toEqual(new ResultMap());
  });

  it('returns empty when ids empty', () => {
    const ids: string[] = [];

    const index = createIndex(source);

    const hook = renderHook(({ ids, source }) => useStableIndex(ids, index), {
      initialProps: {
        ids,
        source,
      },
    });

    expect(hook.result.current).toEqual(new ResultMap());
  });

  it('returns empty if source removed', () => {
    const ids = ['b', 'c', 'd'];

    const index = createIndex(source);

    const hook = renderHook(({ ids, index }) => useStableIndex(ids, index), {
      initialProps: {
        ids,
        index,
      },
    });

    expect(hook.result.current).toEqual(
      ResultMap.from({
        b: 'Beta',
        c: 'Citrus',
        d: 'Delta',
      }),
    );

    const newSource = { ...source };
    delete newSource.b;

    hook.rerender({
      ids,
      index: createIndex(newSource),
    });

    expect(hook.result.current).toEqual(new ResultMap());
  });

  it('returns a subset of source based on ids if all sources found', () => {
    const ids = ['b', 'c', 'd'];

    const index = createIndex(source);

    const hook = renderHook(({ ids, index }) => useStableIndex(ids, index), {
      initialProps: {
        ids,
        index,
      },
    });

    expect(hook.result.current).toEqual(
      ResultMap.from({
        b: 'Beta',
        c: 'Citrus',
        d: 'Delta',
      }),
    );
  });

  it('is referentially stable when ids does not change', () => {
    const ids = ['b', 'c', 'd'];

    const index = createIndex(source);

    const hook = renderHook(({ ids, index }) => useStableIndex(ids, index), {
      initialProps: {
        ids,
        index,
      },
    });

    const ref = hook.result.current;

    hook.rerender();

    expect(hook.result.current).toBe(ref);
  });

  it('is referentially stable when ids change if output does not change', () => {
    const ids = ['b', 'c', 'd'];

    const index = createIndex(source);

    const hook = renderHook(({ ids, index }) => useStableIndex(ids, index), {
      initialProps: {
        ids,
        index,
      },
    });

    const ref = hook.result.current;

    hook.rerender({
      ids: ['c', 'b', 'd'],
      index,
    });

    expect(hook.result.current).toBe(ref);
  });

  it('is referentially stable when source change if output does not change', () => {
    const ids = ['b', 'c', 'd'];

    const index = createIndex(source);

    const hook = renderHook(({ ids, index }) => useStableIndex(ids, index), {
      initialProps: {
        ids,
        index,
      },
    });

    const ref = hook.result.current;

    hook.rerender({
      ids,
      index: createIndex({
        a: 'Alluminium',
        b: 'Beta',
        c: 'Citrus',
        d: 'Delta',
      }),
    });

    expect(hook.result.current).toBe(ref);
  });

  it('returns output when id list shrunk', () => {
    const longList = ['a', 'b'];
    const shortList = ['a'];

    const index = createIndex(source);

    const hook = renderHook(({ ids, index }) => useStableIndex(ids, index), {
      initialProps: {
        ids: longList,
        index,
      },
    });

    expect(hook.result.current).toEqual(
      ResultMap.from({
        a: 'Alpha',
        b: 'Beta',
      }),
    );

    const ref = hook.result.current;

    hook.rerender({
      ids: shortList,
      index,
    });

    expect(hook.result.current).not.toBe(ref);

    expect(hook.result.current).toEqual(
      ResultMap.from({
        a: 'Alpha',
      }),
    );
  });

  it('returns new index if source changes any accessed value', () => {
    const ids = ['b', 'c', 'd'];

    const index = createIndex(source);

    const hook = renderHook(({ ids, index }) => useStableIndex(ids, index), {
      initialProps: {
        ids,
        index,
      },
    });

    const ref = hook.result.current;

    hook.rerender({
      ids,
      index: createIndex({
        a: 'Alluminium',
        b: 'Beta',
        c: 'Cirrus Logic',
        d: 'Delta',
      }),
    });

    expect(hook.result.current).not.toBe(ref);
    expect(hook.result.current).toEqual(
      ResultMap.from({
        b: 'Beta',
        c: 'Cirrus Logic',
        d: 'Delta',
      }),
    );
  });

  it('returns new index if ids changes so that output is affected', () => {
    const ids = ['b', 'c', 'd'];

    const index = createIndex(source);

    const hook = renderHook(({ ids, index }) => useStableIndex(ids, index), {
      initialProps: {
        ids,
        index,
      },
    });

    const ref = hook.result.current;

    hook.rerender({
      ids: ['a', 'b', 'c', 'd'],
      index,
    });

    expect(hook.result.current).not.toBe(ref);
    expect(hook.result.current).toEqual(
      ResultMap.from({
        a: 'Alpha',
        b: 'Beta',
        c: 'Citrus',
        d: 'Delta',
      }),
    );
  });
});
