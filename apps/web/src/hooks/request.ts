import {
  useEffect,
  useState,
  useCallback,
} from 'react';

interface UseRequestReturnType {
  run: () => void;
  data: any;
  error: any;
  loading: boolean;
}

interface UseRequestConfig {
  auto?: boolean;
  onSuccess?: (data: any) => void;
  onError?: (error: any) => void;
}

function useRequest(request: Promise<any>, {
  auto = true,
  onSuccess,
  onError,
}: UseRequestConfig)
    : UseRequestReturnType {
  const [
    data,
    setData,
  ] = useState(null);
  const [
    error,
    setError,
  ] = useState(null);
  const [
    loading,
    setLoading,
  ] = useState(false);

  const run = useCallback(async () => {
    setLoading(true);
    setData(null);
    setError(null);

    try {
      const res = await request();

      setData(res?.data);
      onSuccess?.(res?.data);

      setLoading(false);
    } catch (e) {
      setError(e);
      onError?.(e);

      setLoading(false);
    }
  }, [
    request,
    onSuccess,
    onError,
  ]);

  useEffect(() => {
    if (auto) {
      run();
    }
  }, [
    auto,
    run,
  ]);

  return {
    run,
    data,
    error,
    loading,
  };
}

export default useRequest;
