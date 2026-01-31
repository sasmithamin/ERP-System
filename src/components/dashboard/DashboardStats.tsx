import {
  ShoppingCart,
  Truck,
  Package,
  AlertTriangle,
  TrendingUp,
  DollarSign,
} from "lucide-react";

import { StatCard } from "./StatCard";
import { mockDashboardStats } from "@/data/mockData";
import type { DashboardStats as DashboardStatsType } from "@/types";

export function DashboardStats() {
  const stats: DashboardStatsType = mockDashboardStats;

  const revenueFormatted = `Rs. ${stats.todayRevenue.toLocaleString()}`;
  const weeklyGrowthFormatted = `${stats.weeklyGrowth}%`;

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
