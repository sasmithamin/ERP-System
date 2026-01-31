import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { mockOrders, getShopById } from "@/data/mockData";
import { cn } from "@/lib/utils";
import type { Order } from "@/types";

type OrderStatus = Order["status"];

const statusColors: Record<OrderStatus, string> = {
  pending: "bg-warning/10 text-warning border-warning/30",
  approved: "bg-info/10 text-info border-info/30",
  processing: "bg-primary/10 text-primary border-primary/30",
  packed: "bg-primary/10 text-primary border-primary/30",
  out_for_delivery: "bg-info/10 text-info border-info/30",
  delivered: "bg-success/10 text-success border-success/30",
  cancelled: "bg-destructive/10 text-destructive border-destructive/30",
};

export function RecentOrders() {
  const navigate = useNavigate();
  const recentOrders = mockOrders.slice(0, 5);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg">Recent Orders</CardTitle>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate("/orders")}
        >
          View All
        </Button>
      </CardHeader>

      <CardContent>
        {recentOrders.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No recent orders found.
          </p>
        ) : (
          <div className="space-y-3">
            {recentOrders.map((order) => {
              const shop = getShopById(order.shopId);

              return (
                <div
                  key={order.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => navigate(`/orders/${order.id}`)}
                  onKeyDown={(e) =>
                    e.key === "Enter" &&
                    navigate(`/orders/${order.id}`)
                  }
                  className="flex items-center justify-between rounded-lg border p-3 transition-colors hover:bg-muted/50 cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/40"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium">
                        {order.orderNumber}
                      </p>

                      <Badge
                        variant="outline"
                        className={cn(
                          "text-xs capitalize",
                          statusColors[order.status]
                        )}
                      >
                        {order.status.replace("_", " ")}
                      </Badge>
                    </div>

                    <p className="text-xs text-muted-foreground">
                      {shop?.name ?? "Unknown shop"} •{" "}
                      {order.items.length} items
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-sm font-semibold">
                      Rs. {order.totalAmount.toLocaleString()}
                    </p>
                    <p className="text-xs text-muted-foreground capitalize">
                      {order.paymentMethod}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
