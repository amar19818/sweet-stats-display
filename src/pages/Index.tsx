import { useAnalyticsData } from "@/hooks/useAnalyticsData";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import StatCard from "@/components/dashboard/StatCard";
import {
  ClicksPerDayChart, DeviceChart, BrowserChart, CountriesChart, ReferrersChart,
} from "@/components/dashboard/Charts";
import OsBreakdown from "@/components/dashboard/OsBreakdown";
import RecentClicksTable from "@/components/dashboard/RecentClicksTable";
import { Loader2, AlertTriangle, ShieldAlert } from "lucide-react";

export default function Index() {
  const { data, loading, error, is401 } = useAnalyticsData();

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
              <p className="text-muted-foreground">Make sure you are logged in. This API requires a cookie-based JWT token for authentication.</p>
            </>
          ) : (
            <>
              <AlertTriangle className="w-12 h-12 text-destructive mx-auto" />
              <h2 className="text-xl font-bold text-foreground">Failed to Load Data</h2>
              <p className="text-muted-foreground text-sm">{error}</p>
            </>
          )}
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
