import type { ComponentType, SVGProps } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export type StatVariant =
  | "default"
  | "primary"
  | "success"
  | "warning"
  | "destructive"
  | "info";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  variant?: StatVariant;
}

const variantStyles: Record<StatVariant, string> = {
  default: "bg-card",
  primary: "bg-primary/5 border-primary/20",
  success: "bg-success/5 border-success/20",
  warning: "bg-warning/5 border-warning/20",
  destructive: "bg-destructive/5 border-destructive/20",
  info: "bg-info/5 border-info/20",
};

const iconVariantStyles: Record<StatVariant, string> = {
  default: "bg-muted text-muted-foreground",
  primary: "bg-primary/10 text-primary",
  success: "bg-success/10 text-success",
  warning: "bg-warning/10 text-warning",
  destructive: "bg-destructive/10 text-destructive",
  info: "bg-info/10 text-info",
};

export function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  variant = "default",
}: StatCardProps) {
  return (
    <Card
      className={cn(
        "transition-all hover:shadow-md",
        variantStyles[variant]
      )}
    >
      <CardContent className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">
              {title}
            </p>

            <div className="flex items-baseline gap-2">
              <p className="text-2xl font-bold">{value}</p>

              {trend && (
                <span
                  className={cn(
                    "text-xs font-medium",
                    trend.isPositive
                      ? "text-success"
                      : "text-destructive"
                  )}
                >
                  {trend.isPositive ? "+" : "-"}
                  {Math.abs(trend.value)}%
                </span>
              )}
            </div>

            {subtitle && (
              <p className="text-xs text-muted-foreground">
                {subtitle}
              </p>
            )}
          </div>

          <div
            className={cn(
              "flex h-10 w-10 items-center justify-center rounded-lg",
              iconVariantStyles[variant]
            )}
          >
            <Icon className="h-5 w-5" aria-hidden />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
