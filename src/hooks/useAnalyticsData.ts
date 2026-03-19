import { useState, useEffect } from "react";
import type { AnalyticsData } from "@/types/analytics";

const API_URL = "http://localhost:5000/api/analytics/69baead59aab59a446fe219a";

export function useAnalyticsData() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [is401, setIs401] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(API_URL, { credentials: "include" });
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
          setError("Could not reach the API. This might be a CORS issue or the server is down. Make sure http://localhost:5000 is running and allows cross-origin requests.");
        } else {
          setError(err.message || "Unknown error");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return { data, loading, error, is401 };
}
