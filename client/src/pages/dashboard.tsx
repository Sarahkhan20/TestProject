import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import MainLayout from "@/components/layout/main-layout";
import StatsCard from "@/components/dashboard/stats-card";
import DataUsageChart from "@/components/dashboard/data-usage-chart";
import TenantsTable from "@/components/dashboard/tenants-table";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, ChevronDown } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

export default function Dashboard() {
  useEffect(() => {
    document.title = "futureKonnect | Dashboard";
  }, []);

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["/api/dashboard/stats"],
  });

  const { data: topTenants, isLoading: tenantsLoading } = useQuery({
    queryKey: ["/api/tenants/top"],
  });

  return (
    <MainLayout>
      <div className="flex-1 p-6 overflow-auto">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {statsLoading ? (
            <>
              <Skeleton className="h-24 bg-background-card/50" />
              <Skeleton className="h-24 bg-background-card/50" />
              <Skeleton className="h-24 bg-background-card/50" />
            </>
          ) : (
            <>
              {/* Total Data Card */}
              <StatsCard
                title="TOTAL DATA EXCHANGED"
                value={`${(stats?.totalDataExchanged / (1024 * 1024 * 1024)).toFixed(1)} TB`}
                icon="data-exchange"
              />
              
              {/* Hotspot Users Card */}
              <StatsCard
                title="HOTSPOT USERS"
                value={`${stats?.hotspotUsers.active}/${stats?.hotspotUsers.total}`}
                icon="hotspot-users"
                linkTo="/hotspot-users"
              />
              
              {/* Online Routers Card */}
              <StatsCard
                title="ONLINE ROUTERS"
                value={`${stats?.onlineRouters.online}/${stats?.onlineRouters.total}`}
                icon="routers"
                linkTo="/routers"
              />
            </>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {statsLoading ? (
            <>
              <Skeleton className="h-24 bg-background-card/50" />
              <Skeleton className="h-24 bg-background-card/50" />
            </>
          ) : (
            <>
              {/* Fleets Card */}
              <StatsCard
                title="FLEETS"
                value={stats?.totalFleets.toString() || "0"}
                icon="fleets"
                linkTo="/fleets"
              />
              
              {/* Tenants Card */}
              <StatsCard
                title="TENANTS"
                value={stats?.totalTenants.toString() || "0"}
                icon="tenants"
                linkTo="/tenants"
              />
            </>
          )}
        </div>
        
        {/* Search and Filter */}
        <div className="mb-6 flex flex-wrap gap-4">
          <div className="relative flex items-center">
            <Search className="absolute left-3 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search for Tenant" 
              className="pl-10 bg-background-card border-background-lighter w-60"
            />
          </div>
          <Select defaultValue="30">
            <SelectTrigger className="w-40 bg-background-card border-background-lighter">
              <SelectValue placeholder="Time Period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Last 7 Days</SelectItem>
              <SelectItem value="30">Last 30 Days</SelectItem>
              <SelectItem value="60">Last 60 Days</SelectItem>
              <SelectItem value="90">Last 90 Days</SelectItem>
              <SelectItem value="180">Last 6 Months</SelectItem>
              <SelectItem value="365">Last Year</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {/* Chart and Table */}
        <div className="grid grid-cols-1 gap-6">
          {/* Data Usage Chart */}
          <div className="bg-background-card rounded-lg p-6 shadow-sm">
            <DataUsageChart />
          </div>
          
          {/* Tenants Table */}
          <div className="bg-background-card rounded-lg shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-background">
              <h3 className="font-medium">Top Tenants</h3>
            </div>
            {tenantsLoading ? (
              <div className="p-6">
                <Skeleton className="h-40 bg-background/50" />
              </div>
            ) : (
              <TenantsTable tenants={topTenants || []} />
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
