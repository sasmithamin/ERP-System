import { Routes, Route } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { 
  Plus, Building2, Phone, Mail, MapPin, Package, 
  Truck, Clock, CheckCircle, AlertCircle, Search, Eye, Edit
} from "lucide-react";
import { mockSuppliers, mockPurchaseOrders, getSupplierById, getProductById } from "@/data/mockData";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

const poStatusColors: Record<string, string> = {
  draft: "bg-muted text-muted-foreground",
  pending: "bg-warning/10 text-warning",
  confirmed: "bg-info/10 text-info",
  in_transit: "bg-primary/10 text-primary",
  received: "bg-success/10 text-success",
  cancelled: "bg-destructive/10 text-destructive",
};

const poStatusIcons: Record<string, React.ReactNode> = {
  draft: <Clock className="h-3 w-3" />,
  pending: <Clock className="h-3 w-3" />,
  confirmed: <CheckCircle className="h-3 w-3" />,
  in_transit: <Truck className="h-3 w-3" />,
  received: <Package className="h-3 w-3" />,
  cancelled: <AlertCircle className="h-3 w-3" />,
};

export default function Suppliers() {
  return (
    <Routes>
      <Route index element={<SupplierList />} />
      <Route path="dairy" element={<SupplierList filter="dairy" />} />
      <Route path="biscuit" element={<SupplierList filter="biscuit" />} />
      <Route path="orders" element={<PurchaseOrders />} />
    </Routes>
  );
}

function SupplierList({ filter }: { filter?: "dairy" | "biscuit" }) {
  const suppliers = filter 
    ? mockSuppliers.filter(s => s.agency === filter)
    : mockSuppliers;

  const supplierStats = {
    total: mockSuppliers.length,
    dairy: mockSuppliers.filter(s => s.agency === 'dairy').length,
    biscuit: mockSuppliers.filter(s => s.agency === 'biscuit').length,
    active: mockSuppliers.filter(s => s.isActive).length,
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">
            {filter ? `${filter.charAt(0).toUpperCase() + filter.slice(1)} Suppliers` : "All Suppliers"}
          </h1>
          <p className="text-muted-foreground">Manage your supplier relationships</p>
        </div>
        <Button><Plus className="h-4 w-4 mr-2" /> Add Supplier</Button>
      </div>

      {/* Stats */}
      {!filter && (
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Total Suppliers</CardDescription>
              <CardTitle className="text-2xl">{supplierStats.total}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Dairy Suppliers</CardDescription>
              <CardTitle className="text-2xl text-primary">{supplierStats.dairy}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Biscuit Suppliers</CardDescription>
              <CardTitle className="text-2xl text-warning">{supplierStats.biscuit}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Active</CardDescription>
              <CardTitle className="text-2xl text-success">{supplierStats.active}</CardTitle>
            </CardHeader>
          </Card>
        </div>
      )}

      {/* Search */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search suppliers..." className="pl-9" />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {suppliers.map(supplier => {
          const supplierPOs = mockPurchaseOrders.filter(po => po.supplierId === supplier.id);
          const pendingPOs = supplierPOs.filter(po => po.status === 'pending' || po.status === 'in_transit').length;
          const totalValue = supplierPOs.reduce((sum, po) => sum + po.totalAmount, 0);
          
          return (
            <Card key={supplier.id} className="hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "flex h-10 w-10 items-center justify-center rounded-lg",
                      supplier.agency === 'dairy' ? "bg-primary/10" : "bg-warning/10"
                    )}>
                      <Building2 className={cn(
                        "h-5 w-5",
                        supplier.agency === 'dairy' ? "text-primary" : "text-warning"
                      )} />
                    </div>
                    <div>
                      <CardTitle className="text-base">{supplier.name}</CardTitle>
                      <p className="text-sm text-muted-foreground">{supplier.contactPerson}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <Badge variant={supplier.agency === "dairy" ? "default" : "secondary"}>
                      {supplier.agency}
                    </Badge>
                    {pendingPOs > 0 && (
                      <Badge variant="outline" className="text-xs">
                        {pendingPOs} pending PO
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Phone className="h-4 w-4" /> {supplier.phone}
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Mail className="h-4 w-4" /> {supplier.email}
                </div>
                <div className="flex items-start gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4 mt-0.5" /> {supplier.address}
                </div>
                <div className="pt-3 border-t flex items-center justify-between">
                  <div className="text-sm">
                    <span className="text-muted-foreground">Total Orders: </span>
                    <span className="font-medium">{supplierPOs.length}</span>
                  </div>
                  <div className="text-sm">
                    <span className="text-muted-foreground">Value: </span>
                    <span className="font-medium">Rs. {totalValue.toLocaleString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

function PurchaseOrders() {
  const poStats = {
    total: mockPurchaseOrders.length,
    pending: mockPurchaseOrders.filter(po => po.status === 'pending').length,
    inTransit: mockPurchaseOrders.filter(po => po.status === 'in_transit').length,
    received: mockPurchaseOrders.filter(po => po.status === 'received').length,
  };

  const totalValue = mockPurchaseOrders.reduce((sum, po) => sum + po.totalAmount, 0);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Purchase Orders</h1>
          <p className="text-muted-foreground">Track orders from suppliers</p>
        </div>
        <Button><Plus className="h-4 w-4 mr-2" /> New Purchase Order</Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-5">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Orders</CardDescription>
            <CardTitle className="text-2xl">{poStats.total}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Pending</CardDescription>
            <CardTitle className="text-2xl text-warning">{poStats.pending}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>In Transit</CardDescription>
            <CardTitle className="text-2xl text-info">{poStats.inTransit}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Received</CardDescription>
            <CardTitle className="text-2xl text-success">{poStats.received}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Value</CardDescription>
            <CardTitle className="text-xl">Rs. {totalValue.toLocaleString()}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Filters */}
      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All Orders</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="in_transit">In Transit</TabsTrigger>
          <TabsTrigger value="received">Received</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Orders Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>PO Number</TableHead>
                <TableHead>Supplier</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Total Amount</TableHead>
                <TableHead>Expected Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockPurchaseOrders.map(po => {
                const supplier = getSupplierById(po.supplierId);
                return (
                  <TableRow key={po.id} className="cursor-pointer hover:bg-muted/50">
                    <TableCell className="font-medium">{po.orderNumber}</TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{supplier?.name}</p>
                        <Badge variant="outline" className="text-xs capitalize">{supplier?.agency}</Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {po.items.slice(0, 2).map((item, idx) => (
                          <p key={idx} className="text-muted-foreground">
                            {getProductById(item.productId)?.name} x{item.quantity}
                          </p>
                        ))}
                        {po.items.length > 2 && (
                          <p className="text-xs text-primary">+{po.items.length - 2} more</p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">Rs. {po.totalAmount.toLocaleString()}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        {format(po.expectedDeliveryDate, "PP")}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={cn("capitalize", poStatusColors[po.status])}>
                        <span className="mr-1">{poStatusIcons[po.status]}</span>
                        {po.status.replace("_", " ")}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="icon"><Eye className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="icon"><Edit className="h-4 w-4" /></Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Pending Arrivals Timeline */}
      <Card>
        <CardHeader>
          <CardTitle>Expected Arrivals</CardTitle>
          <CardDescription>Upcoming purchase order deliveries</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockPurchaseOrders
              .filter(po => po.status === 'pending' || po.status === 'in_transit')
              .sort((a, b) => a.expectedDeliveryDate.getTime() - b.expectedDeliveryDate.getTime())
              .map(po => {
                const supplier = getSupplierById(po.supplierId);
                const daysUntil = Math.ceil(
                  (po.expectedDeliveryDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
                );
                return (
                  <div key={po.id} className="flex items-center gap-4 p-3 rounded-lg border">
                    <div className={cn(
                      "flex h-10 w-10 items-center justify-center rounded-full",
                      po.status === 'in_transit' ? "bg-primary/10" : "bg-warning/10"
                    )}>
                      {po.status === 'in_transit' ? (
                        <Truck className="h-5 w-5 text-primary" />
                      ) : (
                        <Clock className="h-5 w-5 text-warning" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{po.orderNumber}</p>
                      <p className="text-sm text-muted-foreground">
                        {supplier?.name} • {po.items.length} items
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{format(po.expectedDeliveryDate, "PP")}</p>
                      <p className={cn(
                        "text-sm",
                        daysUntil <= 1 ? "text-warning" : "text-muted-foreground"
                      )}>
                        {daysUntil === 0 ? "Today" : daysUntil === 1 ? "Tomorrow" : `In ${daysUntil} days`}
                      </p>
                    </div>
                  </div>
                );
              })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
