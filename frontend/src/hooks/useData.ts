import { useEffect, useState } from "react";
import apiClient from "../services/api-client";
import { CanceledError } from "axios";

const useData = <T>(url: string) => {
  const [data, setData] = useState<T[]>([]);
  const [error, setError] = useState("");
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    setLoading(true);
    const fetchGames = async () => {
      try {
        const response = await apiClient.get<T[]>(url, {
          signal: controller.signal,
        });
        setData(response.data);
        setLoading(false);
      } catch (error) {
        if (error instanceof CanceledError) return;
        setError("Error fetching games");
        setLoading(false);
      }
    };
    fetchGames();

    return () => {
      controller.abort();
    };
  }, []);
  return { data, error, isLoading };
};

export default useData;
