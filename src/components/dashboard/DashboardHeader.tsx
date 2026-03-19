import { BarChart3, ExternalLink, Clock, Zap } from "lucide-react";
import type { AnalyticsData } from "@/types/analytics";

interface HeaderProps {
  data: AnalyticsData;
}

export default function DashboardHeader({ data }: HeaderProps) {
  const created = new Date(data.url.createdAt).toLocaleDateString("en-US", {
    year: "numeric", month: "short", day: "numeric",
  });

  return (
    <header className="glass-card p-6 fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
            <BarChart3 className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground tracking-tight">Link Analytics</h1>
            <p className="text-sm text-muted-foreground font-mono">/{data.url.shortUrl}</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {data.fromCache && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-warning/15 text-warning border border-warning/20">
              <Zap className="w-3 h-3" /> Cached
            </span>
          )}
          <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
            <Clock className="w-3 h-3" /> {created}
          </span>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
        <ExternalLink className="w-3.5 h-3.5 shrink-0" />
        <a
          href={data.url.longUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="truncate hover:text-primary transition-colors"
        >
          {data.url.longUrl}
        </a>
      </div>
    </header>
  );
}
