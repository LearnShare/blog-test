import {
  useState,
  useEffect,
} from 'react';

interface CountdownConfig {
  from?: number;
  to?: number;
  step?: number;
  tick?: number;
}

function useCountdown(config: CountdownConfig = {}) {
  const {
    from,
    to,
    step,
    tick,
  } = {
    from: 60,
    to: 0,
    step: 1,
    tick: 1000,
    ...config,
  };

  const [
    value,
    setValue,
  ] = useState(from);
  const [
    start,
    setStart,
  ] = useState(false);

  useEffect(() => {
    if (!start) {
      return () => {};
    }

    const timer = window.setInterval(() => {
      setValue((oldValue) => {
        if (oldValue > to) {
          return oldValue - step;
        }

        return to;
      });
    }, tick);

    if (value <= to) {
      setStart(false);

      window.clearInterval(timer);
    }

    return () => timer
        && window.clearInterval(timer);
  }, [
    start,
    from,
    to,
    value,
    step,
    tick,
  ]);

  const run = () => {
    setStart(true);
  };

  return {
    value,
    ticking: start,
    run,
  };
}

export default useCountdown;
