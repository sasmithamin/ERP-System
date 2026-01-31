import {
  DashboardStats,
  QuickActions,
  RecentActivity,
  RecentOrders,
  InventoryAlerts,
} from "@/components/dashboard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Milk, Cookie } from "lucide-react";

export default function Dashboard() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back! Here's an overview of your distribution operations.
        </p>
      </div>

      <DashboardStats />

      <QuickActions />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <RecentOrders />
        </div>
        <div>
          <RecentActivity />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Agency Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="dairy">
                <TabsList className="mb-4">
                  <TabsTrigger value="dairy" className="gap-2">
                    <Milk className="h-4 w-4" />
                    Dairy
                  </TabsTrigger>
                  <TabsTrigger value="biscuit" className="gap-2">
                    <Cookie className="h-4 w-4" />
                    Biscuits
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="dairy">
                  <div className="grid gap-4 sm:grid-cols-3">
                    <div className="rounded-lg border p-4 bg-chart-dairy/5">
                      <p className="text-sm text-muted-foreground">Products</p>
                      <p className="text-2xl font-bold">5</p>
                    </div>
                    <div className="rounded-lg border p-4 bg-chart-dairy/5">
                      <p className="text-sm text-muted-foreground">Today's Orders</p>
                      <p className="text-2xl font-bold">8</p>
                    </div>
                    <div className="rounded-lg border p-4 bg-chart-dairy/5">
                      <p className="text-sm text-muted-foreground">Revenue</p>
                      <p className="text-2xl font-bold">Rs. 85,400</p>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="biscuit">
                  <div className="grid gap-4 sm:grid-cols-3">
                    <div className="rounded-lg border p-4 bg-chart-biscuit/5">
                      <p className="text-sm text-muted-foreground">Products</p>
                      <p className="text-2xl font-bold">5</p>
                    </div>
                    <div className="rounded-lg border p-4 bg-chart-biscuit/5">
                      <p className="text-sm text-muted-foreground">Today's Orders</p>
                      <p className="text-2xl font-bold">4</p>
                    </div>
                    <div className="rounded-lg border p-4 bg-chart-biscuit/5">
                      <p className="text-sm text-muted-foreground">Revenue</p>
                      <p className="text-2xl font-bold">Rs. 60,200</p>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
        <div>
          <InventoryAlerts />
        </div>
      </div>
    </div>
  );
}
