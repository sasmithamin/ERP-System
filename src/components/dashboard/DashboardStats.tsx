import {
  ShoppingCart,
  Truck,
  Package,
  AlertTriangle,
  TrendingUp,
  DollarSign,
  Loader2,
} from "lucide-react";

import { StatCard } from "./StatCard";
import { useDashboardStats } from "@/hooks/use-dashboard";
import { mockDashboardStats } from "@/data/mockData";
import type { DashboardStats as DashboardStatsType } from "@/types";

export function DashboardStats() {
  const { stats: apiStats, loading } = useDashboardStats();
  
  // Fallback to mock data if API fails or is loading
  const stats: DashboardStatsType = apiStats || mockDashboardStats;

  const revenueFormatted = `Rs. ${stats.todayRevenue.toLocaleString()}`;
  const weeklyGrowthFormatted = `${stats.weeklyGrowth}%`;

  if (loading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-[120px] rounded-lg border bg-card animate-pulse flex items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      <StatCard
        title="Today's Orders"
        value={stats.todayOrders}
        subtitle="Orders received today"
        icon={ShoppingCart}
        variant="primary"
      />

      <StatCard
        title="Pending Deliveries"
        value={stats.pendingDeliveries}
        subtitle="Awaiting dispatch"
        icon={Truck}
        variant="info"
      />

      <StatCard
        title="Low Stock Alerts"
        value={stats.lowStockAlerts}
        subtitle="Items below reorder level"
        icon={Package}
        variant="warning"
      />

      <StatCard
        title="Expiring Items"
        value={stats.expiringItems}
        subtitle="Expires within 7 days"
        icon={AlertTriangle}
        variant="destructive"
      />

      <StatCard
        title="Today's Revenue"
        value={revenueFormatted}
        subtitle="Total sales today"
        icon={DollarSign}
        variant="success"
      />

      <StatCard
        title="Weekly Growth"
        value={weeklyGrowthFormatted}
        subtitle="Compared to last week"
        icon={TrendingUp}
        trend={{
          value: stats.weeklyGrowth,
          isPositive: stats.weeklyGrowth > 0,
        }}
        variant="default"
      />
    </div>
  );
}
