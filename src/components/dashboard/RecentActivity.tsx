import { ShoppingCart, Truck, Package, User } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { mockActivities } from "@/data/mockData";
import { formatDistanceToNow } from "date-fns";
import type { Activity } from "@/types";

type ActivityType = Activity["type"];

const activityIcons: Record<ActivityType, React.ElementType> = {
  order: ShoppingCart,
  delivery: Truck,
  stock: Package,
  user: User,
};

const activityColors: Record<ActivityType, string> = {
  order: "bg-primary/10 text-primary",
  delivery: "bg-info/10 text-info",
  stock: "bg-warning/10 text-warning",
  user: "bg-success/10 text-success",
};

export function RecentActivity() {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-lg">Recent Activity</CardTitle>
      </CardHeader>

      <CardContent className="p-0">
        <ScrollArea className="h-[300px] px-6">
          {mockActivities.length === 0 ? (
            <p className="py-6 text-sm text-muted-foreground">
              No recent activity.
            </p>
          ) : (
            <div className="space-y-4 pb-4">
              {mockActivities.map((activity) => {
                const Icon = activityIcons[activity.type];

                return (
                  <div key={activity.id} className="flex gap-3">
                    <div
                      className={cn(
                        "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
                        activityColors[activity.type]
                      )}
                    >
                      <Icon className="h-4 w-4" aria-hidden />
                    </div>

                    <div className="flex-1 space-y-1">
                      <p className="text-sm leading-tight">
                        {activity.message}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatDistanceToNow(activity.timestamp, {
                          addSuffix: true,
                        })}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
