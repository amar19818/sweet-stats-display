import { Globe, Smartphone, Monitor, Link2 } from "lucide-react";

interface Click {
  timestamp: string;
  country: string;
  device: string;
  browser: string;
  referrer: string;
}

interface Props {
  clicks: Click[];
}

export default function RecentClicksTable({ clicks }: Props) {
  return (
    <div className="glass-card p-5 fade-in stagger-6 col-span-full overflow-x-auto">
      <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">Recent Clicks</h3>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border text-left text-muted-foreground">
            <th className="pb-3 font-medium">Time</th>
            <th className="pb-3 font-medium">Country</th>
            <th className="pb-3 font-medium">Device</th>
            <th className="pb-3 font-medium">Browser</th>
            <th className="pb-3 font-medium">Referrer</th>
          </tr>
        </thead>
        <tbody>
          {clicks.map((click, i) => (
            <tr key={i} className="border-b border-border/50 hover:bg-secondary/40 transition-colors">
              <td className="py-3 text-foreground font-mono text-xs">
                {new Date(click.timestamp).toLocaleString()}
              </td>
              <td className="py-3">
                <span className="inline-flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-muted-foreground" />
                  {click.country}
                </span>
              </td>
              <td className="py-3">
                <span className="inline-flex items-center gap-1.5">
                  {click.device === "mobile" ? <Smartphone className="w-3.5 h-3.5 text-muted-foreground" /> : <Monitor className="w-3.5 h-3.5 text-muted-foreground" />}
                  {click.device}
                </span>
              </td>
              <td className="py-3 text-foreground">{click.browser}</td>
              <td className="py-3">
                <span className="inline-flex items-center gap-1.5 text-muted-foreground">
                  <Link2 className="w-3.5 h-3.5" />
                  <span className="truncate max-w-[200px]">{click.referrer}</span>
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
