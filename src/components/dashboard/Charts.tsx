import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, BarChart, Bar, Legend,
} from "recharts";

const COLORS = [
  "hsl(199, 89%, 48%)",
  "hsl(262, 83%, 58%)",
  "hsl(142, 71%, 45%)",
  "hsl(38, 92%, 50%)",
  "hsl(348, 83%, 47%)",
];

const tooltipStyle = {
  contentStyle: {
    backgroundColor: "hsl(228, 15%, 13%)",
    border: "1px solid hsl(228, 12%, 20%)",
    borderRadius: "8px",
    color: "hsl(210, 20%, 92%)",
    fontSize: "13px",
  },
};

interface ChartCardProps {
  title: string;
  children: React.ReactNode;
  className?: string;
  stagger?: string;
}

function ChartCard({ title, children, className = "", stagger = "" }: ChartCardProps) {
  return (
    <div className={`glass-card p-5 fade-in ${stagger} ${className}`}>
      <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">{title}</h3>
      {children}
    </div>
  );
}

export function ClicksPerDayChart({ data }: { data: { _id: string; count: number }[] }) {
  const formatted = data.map(d => ({
    date: new Date(d._id).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    clicks: d.count,
  }));

  return (
    <ChartCard title="Clicks Per Day" className="col-span-full lg:col-span-2" stagger="stagger-2">
      <ResponsiveContainer width="100%" height={260}>
        <LineChart data={formatted}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(228, 12%, 20%)" />
          <XAxis dataKey="date" tick={{ fill: "hsl(215, 15%, 55%)", fontSize: 12 }} />
          <YAxis tick={{ fill: "hsl(215, 15%, 55%)", fontSize: 12 }} />
          <Tooltip {...tooltipStyle} />
          <Line
            type="monotone"
            dataKey="clicks"
            stroke="hsl(199, 89%, 48%)"
            strokeWidth={2.5}
            dot={{ r: 4, fill: "hsl(199, 89%, 48%)" }}
            animationDuration={1200}
          />
        </LineChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

function DoughnutChart({ data, title, stagger }: { data: { _id: string; count: number }[]; title: string; stagger: string }) {
  return (
    <ChartCard title={title} stagger={stagger}>
      <ResponsiveContainer width="100%" height={240}>
        <PieChart>
          <Pie
            data={data}
            dataKey="count"
            nameKey="_id"
            cx="50%"
            cy="50%"
            innerRadius={55}
            outerRadius={90}
            paddingAngle={3}
            animationDuration={1000}
          >
            {data.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip {...tooltipStyle} />
          <Legend
            formatter={(value) => <span style={{ color: "hsl(210, 20%, 82%)", fontSize: 12 }}>{value}</span>}
          />
        </PieChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

export function DeviceChart({ data }: { data: { _id: string; count: number }[] }) {
  return <DoughnutChart data={data} title="Device Breakdown" stagger="stagger-3" />;
}

export function BrowserChart({ data }: { data: { _id: string; count: number }[] }) {
  return <DoughnutChart data={data} title="Browser Breakdown" stagger="stagger-4" />;
}

function HorizontalBarChart({ data, title, stagger, color }: { data: { _id: string; count: number }[]; title: string; stagger: string; color: string }) {
  return (
    <ChartCard title={title} stagger={stagger}>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data} layout="vertical" margin={{ left: 10 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(228, 12%, 20%)" />
          <XAxis type="number" tick={{ fill: "hsl(215, 15%, 55%)", fontSize: 12 }} />
          <YAxis type="category" dataKey="_id" tick={{ fill: "hsl(215, 15%, 55%)", fontSize: 12 }} width={80} />
          <Tooltip {...tooltipStyle} />
          <Bar dataKey="count" fill={color} radius={[0, 4, 4, 0]} animationDuration={1000} />
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

export function CountriesChart({ data }: { data: { _id: string; count: number }[] }) {
  return <HorizontalBarChart data={data} title="Top Countries" stagger="stagger-5" color="hsl(142, 71%, 45%)" />;
}

export function ReferrersChart({ data }: { data: { _id: string; count: number }[] }) {
  return <HorizontalBarChart data={data} title="Top Referrers" stagger="stagger-6" color="hsl(38, 92%, 50%)" />;
}
