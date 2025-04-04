import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

// Mock chart data - in a real app, this would come from the API
const generateMockChartData = () => {
  const days = 7;
  const today = new Date();
  const data = [];

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    data.push({
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      usage: 800 + Math.random() * 700, // Random data between 800 and 1500
    });
  }

  return data;
};

const chartData = generateMockChartData();

export default function DataUsageChart() {
  const { data: tenants, isLoading } = useQuery({
    queryKey: ["/api/tenants"],
  });

  if (isLoading) {
    return <Skeleton className="h-[200px] w-full" />;
  }

  return (
    <div>
      <div className="h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorUsage" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#4094D7" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#4094D7" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <XAxis 
              dataKey="date" 
              stroke="#94a3b8"
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 12 }}
            />
            <YAxis 
              stroke="#94a3b8"
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 12 }}
              tickFormatter={(value) => `${value.toFixed(0)}`}
            />
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: "#0f172a", 
                border: "1px solid #334155",
                borderRadius: "4px"
              }}
              itemStyle={{ color: "#f8fafc" }}
              labelStyle={{ color: "#94a3b8" }}
              formatter={(value: number) => [`${value.toFixed(2)} MB`, "Usage"]}
            />
            <Area 
              type="monotone" 
              dataKey="usage" 
              stroke="#4094D7" 
              strokeWidth={2}
              fillOpacity={1} 
              fill="url(#colorUsage)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div className="text-center text-sm text-muted-foreground mt-4">
        Tenants Data Usage Pattern
      </div>
    </div>
  );
}
