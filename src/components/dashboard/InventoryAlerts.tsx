import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useInventoryAlerts } from "@/hooks/use-dashboard";
import { mockInventory, getProductById } from "@/data/mockData";
import { AlertTriangle, Clock, Loader2 } from "lucide-react";
import { differenceInDays } from "date-fns";

export function InventoryAlerts() {
  const { alerts, loading } = useInventoryAlerts();
  const today = new Date();

  // Use API data if available, otherwise fallback to mock data
  const hasApiData = alerts && (alerts.lowStock.length > 0 || alerts.expiringItems.length > 0);

  // Fallback mock data calculations
  const mockLowStockItems = mockInventory
    .map((item) => ({
      item,
      product: getProductById(item.productId),
    }))
    .filter(
      ({ item, product }) =>
        product && item.quantity <= product.reorderLevel
    );

  const mockExpiringItems = mockInventory
    .map((item) => ({
      item,
      product: getProductById(item.productId),
    }))
    .filter(({ item }) => {
      if (!item.expiryDate) return false;
      const daysUntilExpiry = differenceInDays(item.expiryDate, today);
      return daysUntilExpiry >= 0 && daysUntilExpiry <= 7;
    });

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Inventory Alerts</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-[200px]">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  const lowStockItems = hasApiData ? alerts.lowStock : mockLowStockItems;
  const expiringItems = hasApiData ? alerts.expiringItems : mockExpiringItems;

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
              Low Stock ({hasApiData ? alerts.lowStockCount : lowStockItems.length})
            </span>
          </div>

          {lowStockItems.length > 0 ? (
            lowStockItems.slice(0, 3).map((item: any) => {
              // Handle both API and mock data formats
              const name = hasApiData ? item.productName : item.product?.name;
              const quantity = hasApiData ? item.currentQuantity : item.item?.quantity;
              const reorderLevel = hasApiData ? item.reorderLevel : item.product?.reorderLevel;
              const id = hasApiData ? item.id : item.item?.id;
              
              const percentage = Math.min(
                100,
                Math.max(0, (quantity / reorderLevel) * 100)
              );

              return (
                <div key={id} className="space-y-1.5">
                  <div className="flex justify-between text-sm">
                    <span>{name}</span>
                    <span className="text-muted-foreground">
                      {quantity} / {reorderLevel}
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
              Expiring Soon ({hasApiData ? alerts.expiringCount : expiringItems.length})
            </span>
          </div>

          {expiringItems.length > 0 ? (
            expiringItems.slice(0, 3).map((item: any) => {
              // Handle both API and mock data formats
              const name = hasApiData ? item.productName : item.product?.name;
              const batchNumber = hasApiData ? item.batchNumber : item.item?.batchNumber;
              const id = hasApiData ? item.id : item.item?.id;
              const daysLeft = hasApiData 
                ? item.daysLeft 
                : differenceInDays(item.item?.expiryDate!, today);

              return (
                <div
                  key={id}
                  className="flex items-center justify-between rounded-md border p-2 text-sm"
                >
                  <div>
                    <p className="font-medium">{name}</p>
                    <p className="text-xs text-muted-foreground">
                      Batch: {batchNumber}
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
