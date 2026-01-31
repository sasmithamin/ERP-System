import { Routes, Route } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  Truck, MapPin, Clock, Phone, Package, 
  CheckCircle, AlertCircle, Navigation, Plus, Edit
} from "lucide-react";
import { 
  mockDeliveries, mockRoutes, mockUsers, 
  getOrderById, getShopById, getUserById, getRouteById 
} from "@/data/mockData";
import { cn } from "@/lib/utils";

const statusColors: Record<string, string> = {
  pending: "bg-muted text-muted-foreground",
  packed: "bg-warning/10 text-warning",
  out_for_delivery: "bg-info/10 text-info",
  delivered: "bg-success/10 text-success",
  failed: "bg-destructive/10 text-destructive",
  returned: "bg-destructive/10 text-destructive",
};

const statusIcons: Record<string, React.ReactNode> = {
  pending: <Clock className="h-4 w-4" />,
  packed: <Package className="h-4 w-4" />,
  out_for_delivery: <Truck className="h-4 w-4" />,
  delivered: <CheckCircle className="h-4 w-4" />,
  failed: <AlertCircle className="h-4 w-4" />,
};

export default function Deliveries() {
  return (
    <Routes>
      <Route index element={<DeliveryList />} />
      <Route path="routes" element={<RoutePlanning />} />
      <Route path="drivers" element={<DriverManagement />} />
    </Routes>
  );
}

function DeliveryList() {
  const deliveryStats = {
    total: mockDeliveries.length,
    packed: mockDeliveries.filter(d => d.status === 'packed').length,
    outForDelivery: mockDeliveries.filter(d => d.status === 'out_for_delivery').length,
    delivered: mockDeliveries.filter(d => d.status === 'delivered').length,
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Today's Deliveries</h1>
          <p className="text-muted-foreground">Track and manage delivery operations</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline"><Navigation className="h-4 w-4 mr-2" /> Optimize Routes</Button>
          <Button><Truck className="h-4 w-4 mr-2" /> Dispatch All</Button>
        </div>
      </div>

      {/* Delivery Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Deliveries</CardDescription>
            <CardTitle className="text-2xl">{deliveryStats.total}</CardTitle>
          </CardHeader>
          <CardContent>
            <Progress value={(deliveryStats.delivered / deliveryStats.total) * 100} className="h-2" />
            <p className="text-xs text-muted-foreground mt-1">
              {Math.round((deliveryStats.delivered / deliveryStats.total) * 100)}% completed
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Packed & Ready</CardDescription>
            <CardTitle className="text-2xl text-warning">{deliveryStats.packed}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Out for Delivery</CardDescription>
            <CardTitle className="text-2xl text-info">{deliveryStats.outForDelivery}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Completed</CardDescription>
            <CardTitle className="text-2xl text-success">{deliveryStats.delivered}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Delivery Pipeline */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Packed */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-warning" />
            <h3 className="font-semibold">Packed ({deliveryStats.packed})</h3>
          </div>
          {mockDeliveries.filter(d => d.status === 'packed').map(delivery => (
            <DeliveryCard key={delivery.id} delivery={delivery} />
          ))}
        </div>

        {/* Out for Delivery */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-info" />
            <h3 className="font-semibold">Out for Delivery ({deliveryStats.outForDelivery})</h3>
          </div>
          {mockDeliveries.filter(d => d.status === 'out_for_delivery').map(delivery => (
            <DeliveryCard key={delivery.id} delivery={delivery} />
          ))}
        </div>

        {/* Delivered */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-success" />
            <h3 className="font-semibold">Delivered ({deliveryStats.delivered})</h3>
          </div>
          {mockDeliveries.filter(d => d.status === 'delivered').map(delivery => (
            <DeliveryCard key={delivery.id} delivery={delivery} />
          ))}
        </div>
      </div>
    </div>
  );
}

function DeliveryCard({ delivery }: { delivery: typeof mockDeliveries[0] }) {
  const order = getOrderById(delivery.orderId);
  const shop = order ? getShopById(order.shopId) : null;
  const driver = delivery.driverId ? getUserById(delivery.driverId) : null;
  const route = delivery.routeId ? getRouteById(delivery.routeId) : null;

  return (
    <Card className="hover:shadow-md transition-shadow cursor-pointer">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">{order?.orderNumber}</CardTitle>
          <Badge className={cn("capitalize", statusColors[delivery.status])}>
            <span className="mr-1">{statusIcons[delivery.status]}</span>
            {delivery.status.replace("_", " ")}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-start gap-2">
          <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
          <div>
            <p className="font-medium text-sm">{shop?.name}</p>
            <p className="text-xs text-muted-foreground">{shop?.address}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Truck className="h-4 w-4 text-muted-foreground" />
          <span>{driver?.name || "Unassigned"}</span>
          {route && (
            <Badge variant="outline" className="text-xs ml-auto">{route.name}</Badge>
          )}
        </div>
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Package className="h-4 w-4" />
            <span>{order?.items.length} items</span>
          </div>
          <span className="font-medium text-foreground">Rs. {order?.totalAmount.toLocaleString()}</span>
        </div>
        {delivery.proofOfDelivery && (
          <div className="pt-2 border-t">
            <p className="text-xs text-success flex items-center gap-1">
              <CheckCircle className="h-3 w-3" />
              Received by: {delivery.proofOfDelivery.receivedBy}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function RoutePlanning() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Route Planning</h1>
          <p className="text-muted-foreground">Manage delivery routes for Negombo area</p>
        </div>
        <Button><Plus className="h-4 w-4 mr-2" /> Create Route</Button>
      </div>

      {/* Route Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Active Routes</CardDescription>
            <CardTitle className="text-2xl">{mockRoutes.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Shops Covered</CardDescription>
            <CardTitle className="text-2xl">
              {mockRoutes.reduce((sum, r) => sum + r.shops.length, 0)}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Est. Daily Time</CardDescription>
            <CardTitle className="text-2xl">
              {mockRoutes.reduce((sum, r) => sum + r.estimatedTime, 0)} min
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Route Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {mockRoutes.map(route => {
          const driver = route.assignedDriver ? getUserById(route.assignedDriver) : null;
          const shops = route.shops.map(id => getShopById(id)).filter(Boolean);
          
          return (
            <Card key={route.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{route.name}</CardTitle>
                  <Button variant="ghost" size="icon"><Edit className="h-4 w-4" /></Button>
                </div>
                <CardDescription className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" /> {route.area}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>{driver?.name.charAt(0) || '?'}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">{driver?.name || "Unassigned"}</p>
                    <p className="text-xs text-muted-foreground">{driver?.phone}</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-xs font-medium text-muted-foreground">STOPS ({shops.length})</p>
                  {shops.map((shop, idx) => (
                    <div key={shop?.id} className="flex items-center gap-2 text-sm">
                      <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium">
                        {idx + 1}
                      </div>
                      <span>{shop?.name}</span>
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-between pt-2 border-t">
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>{route.estimatedTime} min</span>
                  </div>
                  <Button size="sm" variant="outline">View Map</Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

function DriverManagement() {
  const drivers = mockUsers.filter(u => u.role === 'delivery');
  
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Driver Management</h1>
          <p className="text-muted-foreground">Manage delivery personnel and assignments</p>
        </div>
        <Button><Plus className="h-4 w-4 mr-2" /> Add Driver</Button>
      </div>

      {/* Driver Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Drivers</CardDescription>
            <CardTitle className="text-2xl">{drivers.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Active Today</CardDescription>
            <CardTitle className="text-2xl text-success">
              {drivers.filter(d => d.isActive).length}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>On Delivery</CardDescription>
            <CardTitle className="text-2xl text-info">
              {mockDeliveries.filter(d => d.status === 'out_for_delivery').length}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Completed Today</CardDescription>
            <CardTitle className="text-2xl">
              {mockDeliveries.filter(d => d.status === 'delivered').length}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Driver List */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Driver</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Assigned Route</TableHead>
                <TableHead>Today's Deliveries</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {drivers.map(driver => {
                const assignedRoutes = mockRoutes.filter(r => r.assignedDriver === driver.id);
                const todayDeliveries = mockDeliveries.filter(d => d.driverId === driver.id);
                const completedToday = todayDeliveries.filter(d => d.status === 'delivered').length;
                
                return (
                  <TableRow key={driver.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarFallback>{driver.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{driver.name}</p>
                          <p className="text-xs text-muted-foreground">{driver.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm">
                        <Phone className="h-3 w-3" /> {driver.phone}
                      </div>
                    </TableCell>
                    <TableCell>
                      {assignedRoutes.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {assignedRoutes.map(r => (
                            <Badge key={r.id} variant="outline">{r.name}</Badge>
                          ))}
                        </div>
                      ) : (
                        <span className="text-muted-foreground">None assigned</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Progress value={(completedToday / Math.max(todayDeliveries.length, 1)) * 100} className="w-20 h-2" />
                        <span className="text-sm">{completedToday}/{todayDeliveries.length}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={driver.isActive ? "default" : "secondary"}>
                        {driver.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="icon"><Navigation className="h-4 w-4" /></Button>
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
    </div>
  );
}
