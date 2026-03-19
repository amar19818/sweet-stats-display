import { useState } from "react";
import { useAnalyticsData } from "@/hooks/useAnalyticsData";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import StatCard from "@/components/dashboard/StatCard";
import {
  ClicksPerDayChart, DeviceChart, BrowserChart, CountriesChart, ReferrersChart,
} from "@/components/dashboard/Charts";
import OsBreakdown from "@/components/dashboard/OsBreakdown";
import RecentClicksTable from "@/components/dashboard/RecentClicksTable";
import { Loader2, AlertTriangle, ShieldAlert, BarChart3, ArrowRight } from "lucide-react";

export default function Index() {
  const [apiUrl, setApiUrl] = useState(() => localStorage.getItem("analytics_api_url") || "");
  const { data, loading, error, is401, fetchData } = useAnalyticsData();

  const handleFetch = () => {
    const trimmed = apiUrl.trim();
    if (!trimmed) return;
    localStorage.setItem("analytics_api_url", trimmed);
    fetchData(trimmed);
  };

  // Landing / URL input state
  if (!data && !loading && !error) {
    return (
      <div className="flex min-h-screen items-center justify-center p-6">
        <div className="glass-card p-8 max-w-lg w-full space-y-6 text-center fade-in">
          <div className="w-14 h-14 rounded-xl bg-primary/15 flex items-center justify-center mx-auto">
            <BarChart3 className="w-7 h-7 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Link Analytics</h1>
            <p className="text-muted-foreground text-sm mt-1">Paste your analytics API URL to get started</p>
          </div>
          <div className="flex gap-2">
            <input
              type="url"
              value={apiUrl}
              onChange={(e) => setApiUrl(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleFetch()}
              placeholder="http://localhost:5000/api/analytics/..."
              className="flex-1 rounded-lg bg-secondary border border-border px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 font-mono"
            />
            <button
              onClick={handleFetch}
              disabled={!apiUrl.trim()}
              className="px-4 py-2.5 rounded-lg bg-primary text-primary-foreground font-medium text-sm hover:bg-primary/90 transition-colors disabled:opacity-40 flex items-center gap-2"
            >
              Fetch <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          <p className="text-xs text-muted-foreground">Requires cookie-based JWT auth — make sure you're logged in on the API domain.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-muted-foreground text-sm">Loading analytics…</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center p-6">
        <div className="glass-card p-8 max-w-lg text-center space-y-4">
          {is401 ? (
            <>
              <ShieldAlert className="w-12 h-12 text-warning mx-auto" />
              <h2 className="text-xl font-bold text-foreground">Authentication Required</h2>
              <p className="text-muted-foreground">Make sure you are logged in. This API requires a cookie-based JWT token.</p>
            </>
          ) : (
            <>
              <AlertTriangle className="w-12 h-12 text-destructive mx-auto" />
              <h2 className="text-xl font-bold text-foreground">Failed to Load Data</h2>
              <p className="text-muted-foreground text-sm">{error}</p>
            </>
          )}
          <button
            onClick={() => { fetchData(apiUrl.trim()); }}
            className="mt-2 px-4 py-2 rounded-lg bg-secondary text-secondary-foreground text-sm font-medium hover:bg-secondary/80 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="min-h-screen p-4 md:p-8 max-w-7xl mx-auto space-y-6">
      <DashboardHeader data={data} />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard totalClicks={data.totalClicks} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ClicksPerDayChart data={data.clicksPerDay} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <DeviceChart data={data.deviceBreakdown} />
        <BrowserChart data={data.browserBreakdown} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <CountriesChart data={data.topCountries} />
        <ReferrersChart data={data.topReferrers} />
        <OsBreakdown data={data.osBreakdown} />
      </div>

      <RecentClicksTable clicks={data.recentClicks} />
    </div>
  );
}
