import { useState } from 'react';
import type { AxiosResponse } from 'axios';
import axios from 'axios';

export function useApi<T>() {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const execute = async (apiCall: Promise<AxiosResponse<T>>) => {
    try {
      setLoading(true);
      setError(null);

      const response = await apiCall;
      setData(response.data);

      return response.data;
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || '...');
      } else {
        setError('Une erreur est survenue');
      }
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, execute };
}
