interface Props {
  data: { _id: string; count: number }[];
}

export default function OsBreakdown({ data }: Props) {
  const max = Math.max(...data.map(d => d.count));

  const colors = [
    "bg-primary",
    "bg-accent",
    "bg-success",
    "bg-warning",
    "bg-destructive",
  ];

  return (
    <div className="glass-card p-5 fade-in stagger-5">
      <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">OS Breakdown</h3>
      <div className="space-y-3">
        {data.map((item, i) => (
          <div key={item._id}>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-foreground font-medium">{item._id}</span>
              <span className="text-muted-foreground tabular-nums">{item.count}</span>
            </div>
            <div className="h-2 rounded-full bg-secondary overflow-hidden">
              <div
                className={`h-full rounded-full ${colors[i % colors.length]} transition-all duration-1000 ease-out`}
                style={{ width: `${(item.count / max) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
