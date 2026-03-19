import { useState, useCallback } from "react";
import type { AnalyticsData } from "@/types/analytics";

export function useAnalyticsData() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [is401, setIs401] = useState(false);

  const fetchData = useCallback(async (apiUrl: string) => {
    setLoading(true);
    setError(null);
    setIs401(false);
    setData(null);
    try {
      const res = await fetch(apiUrl, { credentials: "include" });
      if (res.status === 401) {
        setIs401(true);
        setError("Unauthorized — please log in first.");
        return;
      }
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      setData(json);
    } catch (err: any) {
      if (err.name === "TypeError" && err.message === "Failed to fetch") {
        setError("Could not reach the API. This might be a CORS issue or the server is down.");
      } else {
        setError(err.message || "Unknown error");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  return { data, loading, error, is401, fetchData };
}
