import { Routes, Route } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Plus, Search, FileText, Download, Eye, CheckCircle, Clock, CreditCard } from "lucide-react";
import { mockOrders, mockShops, getShopById, getProductById } from "@/data/mockData";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

const statusColors: Record<string, string> = {
  pending: "bg-warning/10 text-warning",
  approved: "bg-info/10 text-info",
  processing: "bg-primary/10 text-primary",
  packed: "bg-primary/10 text-primary",
  out_for_delivery: "bg-info/10 text-info",
  delivered: "bg-success/10 text-success",
  cancelled: "bg-destructive/10 text-destructive",
};

const paymentStatusColors: Record<string, string> = {
  pending: "bg-warning/10 text-warning",
  partial: "bg-info/10 text-info",
  paid: "bg-success/10 text-success",
};

export default function Orders() {
  return (
    <Routes>
      <Route index element={<OrderList />} />
      <Route path="pending" element={<OrderList filter="pending" />} />
      <Route path="invoices" element={<Invoices />} />
    </Routes>
  );
}

function OrderList({ filter }: { filter?: string }) {
  const orders = filter ? mockOrders.filter(o => o.status === filter) : mockOrders;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{filter ? "Pending Orders" : "All Orders"}</h1>
          <p className="text-muted-foreground">Manage shop orders and invoices</p>
        </div>
        <Button><Plus className="h-4 w-4 mr-2" /> New Order</Button>
      </div>

      {/* Order Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Orders</CardDescription>
            <CardTitle className="text-2xl">{mockOrders.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Pending</CardDescription>
            <CardTitle className="text-2xl text-warning">
              {mockOrders.filter(o => o.status === 'pending').length}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Delivered Today</CardDescription>
            <CardTitle className="text-2xl text-success">
              {mockOrders.filter(o => o.status === 'delivered').length}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Revenue</CardDescription>
            <CardTitle className="text-2xl">
              Rs. {mockOrders.reduce((sum, o) => sum + o.totalAmount, 0).toLocaleString()}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search orders..." className="pl-9" />
        </div>
        <Tabs defaultValue="all" className="w-auto">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="dairy">Dairy</TabsTrigger>
            <TabsTrigger value="biscuit">Biscuits</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order #</TableHead>
                <TableHead>Shop</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map(order => {
                const shop = getShopById(order.shopId);
                return (
                  <TableRow key={order.id} className="cursor-pointer hover:bg-muted/50">
                    <TableCell className="font-medium">{order.orderNumber}</TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{shop?.name}</p>
                        <p className="text-xs text-muted-foreground">{shop?.area}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {order.items.slice(0, 2).map((item, idx) => (
                          <p key={idx} className="text-muted-foreground">
                            {getProductById(item.productId)?.name} x{item.quantity}
                          </p>
                        ))}
                        {order.items.length > 2 && (
                          <p className="text-xs text-primary">+{order.items.length - 2} more</p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">Rs. {order.totalAmount.toLocaleString()}</p>
                        {order.discount > 0 && (
                          <p className="text-xs text-muted-foreground">-Rs. {order.discount} disc.</p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <Badge variant="outline" className="capitalize">{order.paymentMethod.replace('_', ' ')}</Badge>
                        <Badge className={cn("capitalize block w-fit", paymentStatusColors[order.paymentStatus])}>
                          {order.paymentStatus}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={cn("capitalize", statusColors[order.status])}>
                        {order.status.replace("_", " ")}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p>{format(order.createdAt, "PP")}</p>
                        {order.isRecurring && (
                          <Badge variant="outline" className="text-xs">Recurring</Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="icon"><Eye className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="icon"><FileText className="h-4 w-4" /></Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

function Invoices() {
  // Generate invoices from delivered orders
  const invoices = mockOrders
    .filter(o => o.status === 'delivered' || o.paymentStatus !== 'pending')
    .map((order, idx) => ({
      id: `inv-${idx + 1}`,
      invoiceNumber: `INV-2025-${String(idx + 1).padStart(4, '0')}`,
      order,
      shop: getShopById(order.shopId),
      totalAmount: order.totalAmount,
      paidAmount: order.paymentStatus === 'paid' ? order.totalAmount : 
                  order.paymentStatus === 'partial' ? order.totalAmount * 0.5 : 0,
      dueDate: order.dueDate || new Date(),
      status: order.paymentStatus,
      createdAt: order.createdAt,
    }));

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Invoices</h1>
          <p className="text-muted-foreground">Manage billing and payment tracking</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline"><Download className="h-4 w-4 mr-2" /> Export</Button>
          <Button><Plus className="h-4 w-4 mr-2" /> Create Invoice</Button>
        </div>
      </div>

      {/* Invoice Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Invoiced</CardDescription>
            <CardTitle className="text-2xl">
              Rs. {invoices.reduce((sum, i) => sum + i.totalAmount, 0).toLocaleString()}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Collected</CardDescription>
            <CardTitle className="text-2xl text-success">
              Rs. {invoices.reduce((sum, i) => sum + i.paidAmount, 0).toLocaleString()}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Outstanding</CardDescription>
            <CardTitle className="text-2xl text-warning">
              Rs. {invoices.reduce((sum, i) => sum + (i.totalAmount - i.paidAmount), 0).toLocaleString()}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Overdue</CardDescription>
            <CardTitle className="text-2xl text-destructive">
              {invoices.filter(i => i.status !== 'paid' && new Date(i.dueDate) < new Date()).length}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Filters */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList>
          <TabsTrigger value="all">All Invoices</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="paid">Paid</TabsTrigger>
          <TabsTrigger value="overdue">Overdue</TabsTrigger>
        </TabsList>
      </Tabs>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice #</TableHead>
                <TableHead>Shop</TableHead>
                <TableHead>Order Ref</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Paid</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoices.map(invoice => (
                <TableRow key={invoice.id} className="cursor-pointer hover:bg-muted/50">
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      {invoice.invoiceNumber}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{invoice.shop?.name}</p>
                      <p className="text-xs text-muted-foreground">{invoice.shop?.ownerName}</p>
                    </div>
                  </TableCell>
                  <TableCell>{invoice.order.orderNumber}</TableCell>
                  <TableCell className="font-medium">Rs. {invoice.totalAmount.toLocaleString()}</TableCell>
                  <TableCell>
                    <span className={invoice.paidAmount > 0 ? "text-success" : "text-muted-foreground"}>
                      Rs. {invoice.paidAmount.toLocaleString()}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      {format(invoice.dueDate, "PP")}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={cn("capitalize", paymentStatusColors[invoice.status])}>
                      {invoice.status === 'paid' && <CheckCircle className="h-3 w-3 mr-1" />}
                      {invoice.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="icon"><Eye className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon"><Download className="h-4 w-4" /></Button>
                      {invoice.status !== 'paid' && (
                        <Button variant="ghost" size="icon"><CreditCard className="h-4 w-4" /></Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
