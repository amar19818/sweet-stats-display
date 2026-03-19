import { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useAnalyticsData } from "@/hooks/useAnalyticsData";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import StatCard from "@/components/dashboard/StatCard";
import {
  ClicksPerDayChart, DeviceChart, BrowserChart, CountriesChart, ReferrersChart,
} from "@/components/dashboard/Charts";
import OsBreakdown from "@/components/dashboard/OsBreakdown";
import RecentClicksTable from "@/components/dashboard/RecentClicksTable";
import { Loader2, AlertTriangle, ArrowLeft, Link2 } from "lucide-react";

export default function Analytics() {
  const { urlId } = useParams();
  const { apiBase } = useAuth();
  const { data, loading, error, is401, fetchData } = useAnalyticsData();

  useEffect(() => {
    if (urlId) {
      fetchData(`${apiBase}/api/analytics/${urlId}`);
    }
  }, [urlId, apiBase, fetchData]);

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
          <AlertTriangle className="w-12 h-12 text-destructive mx-auto" />
          <h2 className="text-xl font-bold text-foreground">
            {is401 ? "Authentication Required" : "Failed to Load"}
          </h2>
          <p className="text-muted-foreground text-sm">{error}</p>
          <div className="flex gap-3 justify-center">
            <Link
              to="/dashboard"
              className="px-4 py-2 rounded-lg bg-secondary text-secondary-foreground text-sm font-medium hover:bg-secondary/80"
            >
              Back to Dashboard
            </Link>
            <button
              onClick={() => fetchData(`${apiBase}/api/analytics/${urlId}`)}
              className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="min-h-screen">
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-3 flex items-center gap-3">
          <Link
            to="/dashboard"
            className="p-2 rounded-lg hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div className="flex items-center gap-2">
            <Link2 className="w-4 h-4 text-primary" />
            <span className="font-semibold text-foreground text-sm">Analytics</span>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-6">
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
    </div>
  );
}
