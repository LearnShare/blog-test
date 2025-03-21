import {
  EffectCallback,
  DependencyList,
  useRef,
  useEffect,
} from 'react';

/**
 * useEffect, but skip first run
 */
function useSkipFirstEffect(
  effect: EffectCallback,
  deps?: DependencyList,
) {
  const isFirst = useRef(true);

  useEffect(() => {
    if (isFirst.current) {
      isFirst.current = false;
    } else {
      effect();
    }
  }, [
    effect,
    deps,
  ]);
}

export default useSkipFirstEffect;
