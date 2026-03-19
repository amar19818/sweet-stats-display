import { MousePointerClick } from "lucide-react";

interface Props {
  totalClicks: number;
}

export default function StatCard({ totalClicks }: Props) {
  return (
    <div className="glass-card stat-glow p-6 fade-in stagger-1 flex items-center gap-5">
      <div className="w-14 h-14 rounded-xl bg-primary/15 flex items-center justify-center">
        <MousePointerClick className="w-7 h-7 text-primary" />
      </div>
      <div>
        <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Total Clicks</p>
        <p className="text-4xl font-extrabold text-foreground tabular-nums">{totalClicks.toLocaleString()}</p>
      </div>
    </div>
  );
}
