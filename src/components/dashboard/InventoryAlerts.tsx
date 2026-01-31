import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { mockInventory, getProductById } from "@/data/mockData";
import { AlertTriangle, Clock } from "lucide-react";
import { differenceInDays } from "date-fns";

export function InventoryAlerts() {
  const today = new Date();

  const lowStockItems = mockInventory
    .map((item) => ({
      item,
      product: getProductById(item.productId),
    }))
    .filter(
      ({ item, product }) =>
        product && item.quantity <= product.reorderLevel
    );

  const expiringItems = mockInventory
    .map((item) => ({
      item,
      product: getProductById(item.productId),
    }))
    .filter(({ item }) => {
      if (!item.expiryDate) return false;
      const daysUntilExpiry = differenceInDays(item.expiryDate, today);
      return daysUntilExpiry >= 0 && daysUntilExpiry <= 7;
    });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Inventory Alerts</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Low Stock */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-warning" />
            <span className="text-sm font-medium">
              Low Stock ({lowStockItems.length})
            </span>
          </div>

          {lowStockItems.length > 0 ? (
            lowStockItems.slice(0, 3).map(({ item, product }) => {
              const percentage = Math.min(
                100,
                Math.max(
                  0,
                  (item.quantity / product!.reorderLevel) * 100
                )
              );

              return (
                <div key={item.id} className="space-y-1.5">
                  <div className="flex justify-between text-sm">
                    <span>{product!.name}</span>
                    <span className="text-muted-foreground">
                      {item.quantity} / {product!.reorderLevel}
                    </span>
                  </div>
                  <Progress value={percentage} className="h-2" />
                </div>
              );
            })
          ) : (
            <p className="text-sm text-muted-foreground">
              No low stock items
            </p>
          )}
        </div>

        {/* Expiring Soon */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-destructive" />
            <span className="text-sm font-medium">
              Expiring Soon ({expiringItems.length})
            </span>
          </div>

          {expiringItems.length > 0 ? (
            expiringItems.slice(0, 3).map(({ item, product }) => {
              const daysLeft = differenceInDays(
                item.expiryDate!,
                today
              );

              return (
                <div
                  key={item.id}
                  className="flex items-center justify-between rounded-md border p-2 text-sm"
                >
                  <div>
                    <p className="font-medium">{product?.name}</p>
                    <p className="text-xs text-muted-foreground">
                      Batch: {item.batchNumber}
                    </p>
                  </div>

                  <Badge variant="destructive" className="text-xs">
                    {daysLeft} days left
                  </Badge>
                </div>
              );
            })
          ) : (
            <p className="text-sm text-muted-foreground">
              No items expiring soon
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
