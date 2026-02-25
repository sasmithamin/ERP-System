import { useState, useEffect, useCallback } from "react";
import api from "@/lib/api";
import type { DashboardStats, ActivityItem, Order } from "@/types";

// Types for API responses
export interface LowStockAlert {
  id: string;
  productId: string;
  productName: string;
  sku: string;
  currentQuantity: number;
  reorderLevel: number;
  location: string;
  category: string;
  percentage: number;
}

export interface ExpiringItem {
  id: string;
  productId: string;
  productName: string;
  batchNumber: string;
  quantity: number;
  expiryDate: Date;
  daysLeft: number;
  location: string;
}

export interface InventoryAlerts {
  lowStock: LowStockAlert[];
  expiringItems: ExpiringItem[];
  lowStockCount: number;
  expiringCount: number;
}

export interface DashboardData {
  stats: DashboardStats;
  recentOrders: Order[];
  lowStockAlerts: LowStockAlert[];
  expiringItems: ExpiringItem[];
  recentActivities: ActivityItem[];
}

// Hook for fetching dashboard stats
export function useDashboardStats() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get<DashboardStats>("/dashboard/stats");
      setStats(response.data);
    } catch (err: any) {
      console.error("Error fetching dashboard stats:", err);
      setError(err.response?.data?.detail || "Failed to fetch dashboard stats");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return { stats, loading, error, refetch: fetchStats };
}

// Hook for fetching recent orders
export function useRecentOrders(limit: number = 5) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get<Order[]>("/dashboard/recent-orders", {
        params: { limit },
      });
      setOrders(response.data);
    } catch (err: any) {
      console.error("Error fetching recent orders:", err);
      setError(err.response?.data?.detail || "Failed to fetch recent orders");
    } finally {
      setLoading(false);
    }
  }, [limit]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  return { orders, loading, error, refetch: fetchOrders };
}

// Hook for fetching inventory alerts
export function useInventoryAlerts() {
  const [alerts, setAlerts] = useState<InventoryAlerts | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAlerts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get<InventoryAlerts>("/dashboard/inventory-alerts");
      setAlerts(response.data);
    } catch (err: any) {
      console.error("Error fetching inventory alerts:", err);
      setError(err.response?.data?.detail || "Failed to fetch inventory alerts");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAlerts();
  }, [fetchAlerts]);

  return { alerts, loading, error, refetch: fetchAlerts };
}

// Hook for fetching recent activities
export function useRecentActivities(limit: number = 10) {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchActivities = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get<ActivityItem[]>("/dashboard/activities", {
        params: { limit },
      });
      setActivities(response.data);
    } catch (err: any) {
      console.error("Error fetching activities:", err);
      setError(err.response?.data?.detail || "Failed to fetch activities");
    } finally {
      setLoading(false);
    }
  }, [limit]);

  useEffect(() => {
    fetchActivities();
  }, [fetchActivities]);

  return { activities, loading, error, refetch: fetchActivities };
}

// Hook for fetching all dashboard data at once
export function useDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboard = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get<DashboardData>("/dashboard/full");
      setData(response.data);
    } catch (err: any) {
      console.error("Error fetching dashboard:", err);
      setError(err.response?.data?.detail || "Failed to fetch dashboard data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  return { data, loading, error, refetch: fetchDashboard };
}
