import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  Truck,
  ShoppingCart,
  Users,
  Building2,
  FileText,
  Settings,
  LogOut,
  ChevronDown,
  Milk,
  Cookie,
  ClipboardList,
  Route,
  BarChart3,
  AlertTriangle,
  Warehouse,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

const mainNavItems = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    href: "/dashboard",
  },
];

const operationsNavItems = [
  {
    title: "Suppliers",
    icon: Building2,
    href: "/suppliers",
    children: [
      { title: "All Suppliers", href: "/suppliers" },
      { title: "Dairy Agency", href: "/suppliers/dairy", icon: Milk },
      { title: "Biscuit Agency", href: "/suppliers/biscuit", icon: Cookie },
      { title: "Purchase Orders", href: "/suppliers/orders", icon: ClipboardList },
    ],
  },
  {
    title: "Inventory",
    icon: Warehouse,
    href: "/inventory",
    children: [
      { title: "Stock Overview", href: "/inventory" },
      { title: "Products", href: "/inventory/products", icon: Package },
      { title: "Stock Movements", href: "/inventory/movements" },
      { title: "Waste Tracking", href: "/inventory/waste", icon: AlertTriangle },
    ],
  },
  {
    title: "Orders",
    icon: ShoppingCart,
    href: "/orders",
    children: [
      { title: "All Orders", href: "/orders" },
      { title: "Pending Approval", href: "/orders/pending" },
      { title: "Invoices", href: "/orders/invoices", icon: FileText },
    ],
  },
  {
    title: "Deliveries",
    icon: Truck,
    href: "/deliveries",
    children: [
      { title: "Today's Deliveries", href: "/deliveries" },
      { title: "Route Planning", href: "/deliveries/routes", icon: Route },
      { title: "Driver Management", href: "/deliveries/drivers" },
    ],
  },
  {
    title: "Shops",
    icon: Users,
    href: "/shops",
  },
];

const reportNavItems = [
  {
    title: "Reports",
    icon: BarChart3,
    href: "/reports",
    children: [
      { title: "Sales Report", href: "/reports/sales" },
      { title: "Inventory Report", href: "/reports/inventory" },
      { title: "Delivery Report", href: "/reports/delivery" },
    ],
  },
];

const settingsNavItems = [
  {
    title: "Settings",
    icon: Settings,
    href: "/settings",
  },
];

export function AppSidebar() {
  const location = useLocation();
  const [openGroups, setOpenGroups] = useState<string[]>([
    "Suppliers",
    "Inventory",
    "Orders",
    "Deliveries",
    "Reports",
  ]);

  const toggleGroup = (title: string) => {
    setOpenGroups((prev) =>
      prev.includes(title)
        ? prev.filter((g) => g !== title)
        : [...prev, title]
    );
  };

  const isActive = (href: string) => location.pathname === href;
  const isGroupActive = (item: { href: string; children?: { href: string }[] }) => {
    if (isActive(item.href)) return true;
    return item.children?.some((child) => isActive(child.href));
  };

  const renderNavItem = (item: typeof operationsNavItems[0]) => {
    if (item.children) {
      return (
        <Collapsible
          key={item.title}
          open={openGroups.includes(item.title)}
          onOpenChange={() => toggleGroup(item.title)}
        >
          <SidebarMenuItem>
            <CollapsibleTrigger asChild>
              <SidebarMenuButton
                className={cn(
                  "w-full justify-between",
                  isGroupActive(item) && "bg-sidebar-accent text-sidebar-accent-foreground"
                )}
              >
                <span className="flex items-center gap-3">
                  <item.icon className="h-4 w-4" />
                  <span>{item.title}</span>
                </span>
                <ChevronDown
                  className={cn(
                    "h-4 w-4 transition-transform",
                    openGroups.includes(item.title) && "rotate-180"
                  )}
                />
              </SidebarMenuButton>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <SidebarMenuSub>
                {item.children.map((child) => (
                  <SidebarMenuSubItem key={child.href}>
                    <SidebarMenuSubButton
                      asChild
                      isActive={isActive(child.href)}
                    >
                      <NavLink to={child.href}>
                        {child.icon && <child.icon className="h-3.5 w-3.5" />}
                        <span>{child.title}</span>
                      </NavLink>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                ))}
              </SidebarMenuSub>
            </CollapsibleContent>
          </SidebarMenuItem>
        </Collapsible>
      );
    }

    return (
      <SidebarMenuItem key={item.title}>
        <SidebarMenuButton asChild isActive={isActive(item.href)}>
          <NavLink to={item.href}>
            <item.icon className="h-4 w-4" />
            <span>{item.title}</span>
          </NavLink>
        </SidebarMenuButton>
      </SidebarMenuItem>
    );
  };

  return (
    <Sidebar className="border-r border-sidebar-border">
      <SidebarHeader className="border-b border-sidebar-border p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
            <Package className="h-5 w-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-sidebar-foreground">
              SAS Negombo
            </span>
            <span className="text-xs text-sidebar-foreground/60">
              Distribution System
            </span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2 py-4">
        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground/50 text-xs uppercase tracking-wider">
            Overview
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNavItems.map(renderNavItem)}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground/50 text-xs uppercase tracking-wider">
            Operations
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {operationsNavItems.map(renderNavItem)}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground/50 text-xs uppercase tracking-wider">
            Analytics
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {reportNavItems.map(renderNavItem)}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground/50 text-xs uppercase tracking-wider">
            System
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {settingsNavItems.map(renderNavItem)}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-sidebar-primary text-sidebar-primary-foreground text-xs">
                KP
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="text-sm font-medium text-sidebar-foreground">
                Kamal Perera
              </span>
              <Badge
                variant="secondary"
                className="w-fit text-[10px] bg-sidebar-accent text-sidebar-accent-foreground"
              >
                Admin
              </Badge>
            </div>
          </div>
          <NavLink
            to="/login"
            className="rounded-md p-2 text-sidebar-foreground/60 hover:bg-sidebar-accent hover:text-sidebar-foreground"
          >
            <LogOut className="h-4 w-4" />
          </NavLink>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}