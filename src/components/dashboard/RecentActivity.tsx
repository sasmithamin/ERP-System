import { ShoppingCart, Truck, Package, User, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { useRecentActivities } from "@/hooks/use-dashboard";
import { mockActivities } from "@/data/mockData";
import { formatDistanceToNow } from "date-fns";
import type { ActivityItem } from "@/types";

type ActivityType = ActivityItem["type"];

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
  const { activities: apiActivities, loading } = useRecentActivities(10);
  
  // Fallback to mock data if API fails
  const activities = apiActivities.length > 0 ? apiActivities : mockActivities;

  if (loading) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="text-lg">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-[300px]">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-lg">Recent Activity</CardTitle>
      </CardHeader>

      <CardContent className="p-0">
        <ScrollArea className="h-[300px] px-6">
          {activities.length === 0 ? (
            <p className="py-6 text-sm text-muted-foreground">
              No recent activity.
            </p>
          ) : (
            <div className="space-y-4 pb-4">
              {activities.map((activity) => {
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
                        {formatDistanceToNow(new Date(activity.timestamp), {
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
