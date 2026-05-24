import { useState, useEffect } from "react";
import { fetchFromTmdb } from "../components/api/tmdb";

export function useFetchTmdb(endpoint: string, params?: Record<string, any>) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    let isMounted = true; 

    const fetchData = async () => {
      try {
        const result = await fetchFromTmdb(endpoint, params);
        if (isMounted) setData(result);
      } catch (err) {
        if (isMounted) setError(err);
        console.error(err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchData();

    return () => {
      isMounted = false; 
    };
  }, [endpoint, JSON.stringify(params)]); 

  return { data, loading, error };
}
