import { useNavigate } from "react-router-dom";
import {
  Plus,
  Package,
  Truck,
  ClipboardList,
  FileText,
} from "lucide-react";
import type { ComponentType, SVGProps } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type QuickAction = {
  title: string;
  description: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  href: string;
  variant: "default" | "outline";
  roles?: Array<"admin" | "warehouse" | "delivery">;
};

const quickActions: QuickAction[] = [
  {
    title: "New Order",
    description: "Create a new shop order",
    icon: Plus,
    href: "/orders/new",
    variant: "default",
    roles: ["admin", "warehouse"],
  },
  {
    title: "Stock Entry",
    description: "Record incoming stock",
    icon: Package,
    href: "/inventory/movements",
    variant: "outline",
    roles: ["warehouse"],
  },
  {
    title: "Dispatch Delivery",
    description: "Send out pending deliveries",
    icon: Truck,
    href: "/deliveries",
    variant: "outline",
    roles: ["admin", "delivery"],
  },
  {
    title: "Purchase Order",
    description: "Order from suppliers",
    icon: ClipboardList,
    href: "/suppliers/orders/new",
    variant: "outline",
    roles: ["admin"],
  },
  {
    title: "Generate Report",
    description: "View sales reports",
    icon: FileText,
    href: "/reports/sales",
    variant: "outline",
    roles: ["admin"],
  },
];

export function QuickActions() {
  const navigate = useNavigate();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Quick Actions</CardTitle>
      </CardHeader>

      <CardContent>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
          {quickActions.map((action) => (
            <Button
              key={action.title}
              variant={action.variant}
              className="flex h-auto flex-col gap-2 py-4"
              onClick={() => navigate(action.href)}
            >
              <action.icon className="h-5 w-5" aria-hidden />
              <div className="text-center">
                <p className="font-medium">{action.title}</p>
                <p className="text-xs font-normal text-muted-foreground">
                  {action.description}
                </p>
              </div>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
