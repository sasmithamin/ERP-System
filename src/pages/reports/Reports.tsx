import { Routes, Route, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { 
  BarChart3, TrendingUp, TrendingDown, Package, Truck, Download, 
  Calendar, DollarSign, ShoppingCart, AlertTriangle, CheckCircle
} from "lucide-react";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, Legend, AreaChart, Area
} from "recharts";
import { mockOrders, mockProducts, mockInventory, mockDeliveries, mockShops, getProductById, getShopById } from "@/data/mockData";

const COLORS = ['hsl(var(--primary))', 'hsl(var(--warning))', 'hsl(var(--success))', 'hsl(var(--info))'];

export default function Reports() {
  return (
    <Routes>
      <Route index element={<ReportsOverview />} />
      <Route path="sales" element={<SalesReport />} />
      <Route path="inventory" element={<InventoryReport />} />
      <Route path="delivery" element={<DeliveryReport />} />
    </Routes>
  );
}

function ReportsOverview() {
  const totalRevenue = mockOrders.reduce((sum, o) => sum + o.totalAmount, 0);
  const dairyRevenue = mockOrders.reduce((sum, o) => {
    return sum + o.items.reduce((itemSum, item) => {
      const product = getProductById(item.productId);
      return product?.category === 'dairy' ? itemSum + (item.quantity * item.unitPrice) : itemSum;
    }, 0);
  }, 0);
  
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Reports & Analytics</h1>
          <p className="text-muted-foreground">Business insights and performance metrics</p>
        </div>
        <Button variant="outline"><Download className="h-4 w-4 mr-2" /> Export All</Button>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Revenue</CardDescription>
            <CardTitle className="text-2xl flex items-center gap-2">
              Rs. {totalRevenue.toLocaleString()}
              <TrendingUp className="h-4 w-4 text-success" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-success">+12.5% from last week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Orders Completed</CardDescription>
            <CardTitle className="text-2xl">{mockOrders.filter(o => o.status === 'delivered').length}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">of {mockOrders.length} total orders</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Delivery Success Rate</CardDescription>
            <CardTitle className="text-2xl text-success">
              {Math.round((mockDeliveries.filter(d => d.status === 'delivered').length / mockDeliveries.length) * 100)}%
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Progress value={33} className="h-2" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Active Shops</CardDescription>
            <CardTitle className="text-2xl">{mockShops.filter(s => s.isActive).length}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">{mockShops.length} total registered</p>
          </CardContent>
        </Card>
      </div>

      {/* Report Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Link to="/reports/sales">
          <Card className="cursor-pointer hover:shadow-md transition-shadow h-full">
            <CardHeader className="flex flex-row items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <TrendingUp className="h-6 w-6 text-primary" />
              </div>
              <div>
                <CardTitle>Sales Report</CardTitle>
                <CardDescription>Revenue & orders analysis</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Dairy Sales</span>
                  <span className="font-medium">Rs. {dairyRevenue.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Biscuit Sales</span>
                  <span className="font-medium">Rs. {(totalRevenue - dairyRevenue).toLocaleString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>
        <Link to="/reports/inventory">
          <Card className="cursor-pointer hover:shadow-md transition-shadow h-full">
            <CardHeader className="flex flex-row items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-warning/10">
                <Package className="h-6 w-6 text-warning" />
              </div>
              <div>
                <CardTitle>Inventory Report</CardTitle>
                <CardDescription>Stock levels & waste tracking</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Low Stock Items</span>
                  <Badge variant="destructive">3</Badge>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Expiring Soon</span>
                  <Badge variant="outline" className="text-warning">2</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>
        <Link to="/reports/delivery">
          <Card className="cursor-pointer hover:shadow-md transition-shadow h-full">
            <CardHeader className="flex flex-row items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-info/10">
                <Truck className="h-6 w-6 text-info" />
              </div>
              <div>
                <CardTitle>Delivery Report</CardTitle>
                <CardDescription>Delivery performance metrics</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>On-Time Rate</span>
                  <span className="font-medium text-success">94%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Avg. Delivery Time</span>
                  <span className="font-medium">45 min</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Quick Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Weekly Sales Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={[
                  { day: 'Mon', dairy: 12000, biscuit: 8000 },
                  { day: 'Tue', dairy: 15000, biscuit: 9500 },
                  { day: 'Wed', dairy: 11000, biscuit: 7200 },
                  { day: 'Thu', dairy: 18000, biscuit: 11000 },
                  { day: 'Fri', dairy: 22000, biscuit: 14500 },
                  { day: 'Sat', dairy: 25000, biscuit: 16000 },
                  { day: 'Sun', dairy: 19000, biscuit: 12000 },
                ]}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Area type="monotone" dataKey="dairy" stackId="1" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.6} />
                  <Area type="monotone" dataKey="biscuit" stackId="1" stroke="hsl(var(--warning))" fill="hsl(var(--warning))" fillOpacity={0.6} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Top Performing Shops</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockShops.slice(0, 5).map((shop, idx) => {
                const shopOrders = mockOrders.filter(o => o.shopId === shop.id);
                const revenue = shopOrders.reduce((sum, o) => sum + o.totalAmount, 0);
                const maxRevenue = 30000;
                return (
                  <div key={shop.id} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">{idx + 1}. {shop.name}</span>
                      <span>Rs. {revenue.toLocaleString()}</span>
                    </div>
                    <Progress value={(revenue / maxRevenue) * 100} className="h-2" />
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function SalesReport() {
  const salesByProduct = mockProducts.map(product => {
    const sales = mockOrders.reduce((sum, order) => {
      const item = order.items.find(i => i.productId === product.id);
      return sum + (item ? item.quantity * item.unitPrice : 0);
    }, 0);
    return { name: product.name.substring(0, 15), sales, category: product.category };
  }).filter(p => p.sales > 0);

  const categoryData = [
    { name: 'Dairy', value: salesByProduct.filter(p => p.category === 'dairy').reduce((s, p) => s + p.sales, 0) },
    { name: 'Biscuit', value: salesByProduct.filter(p => p.category === 'biscuit').reduce((s, p) => s + p.sales, 0) },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Sales Report</h1>
          <p className="text-muted-foreground">Detailed revenue and order analytics</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline"><Calendar className="h-4 w-4 mr-2" /> This Week</Button>
          <Button variant="outline"><Download className="h-4 w-4 mr-2" /> Export</Button>
        </div>
      </div>

      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="products">By Product</TabsTrigger>
          <TabsTrigger value="shops">By Shop</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Sales by Category</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {categoryData.map((_, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value: number) => `Rs. ${value.toLocaleString()}`} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Daily Sales Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={[
                      { date: '20 Jan', sales: 45000 },
                      { date: '21 Jan', sales: 52000 },
                      { date: '22 Jan', sales: 48000 },
                      { date: '23 Jan', sales: 61000 },
                      { date: '24 Jan', sales: 55000 },
                      { date: '25 Jan', sales: 67000 },
                    ]}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip formatter={(value: number) => `Rs. ${value.toLocaleString()}`} />
                      <Line type="monotone" dataKey="sales" stroke="hsl(var(--primary))" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="products" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Product Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={salesByProduct} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" width={120} />
                    <Tooltip formatter={(value: number) => `Rs. ${value.toLocaleString()}`} />
                    <Bar dataKey="sales" fill="hsl(var(--primary))" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="shops" className="space-y-6">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Shop</TableHead>
                    <TableHead>Orders</TableHead>
                    <TableHead>Revenue</TableHead>
                    <TableHead>Avg. Order</TableHead>
                    <TableHead>Payment Rate</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockShops.map(shop => {
                    const shopOrders = mockOrders.filter(o => o.shopId === shop.id);
                    const revenue = shopOrders.reduce((sum, o) => sum + o.totalAmount, 0);
                    const avgOrder = shopOrders.length > 0 ? revenue / shopOrders.length : 0;
                    const paidOrders = shopOrders.filter(o => o.paymentStatus === 'paid').length;
                    return (
                      <TableRow key={shop.id}>
                        <TableCell className="font-medium">{shop.name}</TableCell>
                        <TableCell>{shopOrders.length}</TableCell>
                        <TableCell>Rs. {revenue.toLocaleString()}</TableCell>
                        <TableCell>Rs. {avgOrder.toLocaleString()}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Progress value={(paidOrders / Math.max(shopOrders.length, 1)) * 100} className="w-16 h-2" />
                            <span className="text-sm">{Math.round((paidOrders / Math.max(shopOrders.length, 1)) * 100)}%</span>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function InventoryReport() {
  const lowStockItems = mockInventory.filter(item => {
    const product = getProductById(item.productId);
    return product && item.quantity <= product.reorderLevel;
  });

  const expiringItems = mockInventory.filter(item => {
    if (!item.expiryDate) return false;
    const daysUntilExpiry = Math.ceil((item.expiryDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    return daysUntilExpiry <= 7;
  });

  const totalValue = mockInventory.reduce((sum, item) => sum + (item.quantity * item.costPrice), 0);
  const dairyValue = mockInventory.reduce((sum, item) => {
    const product = getProductById(item.productId);
    return product?.category === 'dairy' ? sum + (item.quantity * item.costPrice) : sum;
  }, 0);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Inventory Report</h1>
          <p className="text-muted-foreground">Stock levels, waste tracking, and valuation</p>
        </div>
        <Button variant="outline"><Download className="h-4 w-4 mr-2" /> Export</Button>
      </div>

      {/* Inventory Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Stock Value</CardDescription>
            <CardTitle className="text-2xl">Rs. {totalValue.toLocaleString()}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Dairy Stock Value</CardDescription>
            <CardTitle className="text-2xl">Rs. {dairyValue.toLocaleString()}</CardTitle>
          </CardHeader>
        </Card>
        <Card className="border-warning">
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-1">
              <AlertTriangle className="h-3 w-3 text-warning" /> Low Stock Alerts
            </CardDescription>
            <CardTitle className="text-2xl text-warning">{lowStockItems.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card className="border-destructive">
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-1">
              <AlertTriangle className="h-3 w-3 text-destructive" /> Expiring Soon
            </CardDescription>
            <CardTitle className="text-2xl text-destructive">{expiringItems.length}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Stock by Category */}
        <Card>
          <CardHeader>
            <CardTitle>Stock Value by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={[
                      { name: 'Dairy', value: dairyValue },
                      { name: 'Biscuit', value: totalValue - dairyValue },
                    ]}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    label
                  >
                    <Cell fill="hsl(var(--primary))" />
                    <Cell fill="hsl(var(--warning))" />
                  </Pie>
                  <Tooltip formatter={(value: number) => `Rs. ${value.toLocaleString()}`} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Low Stock Alerts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-warning" />
              Low Stock Items
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {lowStockItems.map(item => {
                const product = getProductById(item.productId);
                const percentage = product ? (item.quantity / product.reorderLevel) * 100 : 0;
                return (
                  <div key={item.id} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">{product?.name}</span>
                      <span>{item.quantity} / {product?.reorderLevel}</span>
                    </div>
                    <Progress value={percentage} className="h-2" />
                  </div>
                );
              })}
              {lowStockItems.length === 0 && (
                <div className="text-center text-muted-foreground py-4 flex flex-col items-center gap-2">
                  <CheckCircle className="h-8 w-8 text-success" />
                  <p>All items are well stocked!</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Expiring Items Table */}
      <Card>
        <CardHeader>
          <CardTitle>Items Expiring Within 7 Days</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Batch</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Expiry Date</TableHead>
                <TableHead>Days Left</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {expiringItems.map(item => {
                const product = getProductById(item.productId);
                const daysLeft = item.expiryDate 
                  ? Math.ceil((item.expiryDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
                  : 0;
                return (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{product?.name}</TableCell>
                    <TableCell>{item.batchNumber}</TableCell>
                    <TableCell>{item.quantity}</TableCell>
                    <TableCell>{item.location}</TableCell>
                    <TableCell>{item.expiryDate?.toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Badge variant={daysLeft <= 3 ? "destructive" : "outline"}>
                        {daysLeft} days
                      </Badge>
                    </TableCell>
                  </TableRow>
                );
              })}
              {expiringItems.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                    No items expiring within the next 7 days
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

function DeliveryReport() {
  const totalDeliveries = mockDeliveries.length;
  const successfulDeliveries = mockDeliveries.filter(d => d.status === 'delivered').length;
  const failedDeliveries = mockDeliveries.filter(d => d.status === 'failed').length;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Delivery Report</h1>
          <p className="text-muted-foreground">Delivery performance and driver analytics</p>
        </div>
        <Button variant="outline"><Download className="h-4 w-4 mr-2" /> Export</Button>
      </div>

      {/* Delivery Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Deliveries</CardDescription>
            <CardTitle className="text-2xl">{totalDeliveries}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Success Rate</CardDescription>
            <CardTitle className="text-2xl text-success">
              {Math.round((successfulDeliveries / totalDeliveries) * 100)}%
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>On-Time Rate</CardDescription>
            <CardTitle className="text-2xl">94%</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Avg. Delivery Time</CardDescription>
            <CardTitle className="text-2xl">45 min</CardTitle>
          </CardHeader>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Delivery Status Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Delivery Status Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={[
                      { name: 'Delivered', value: successfulDeliveries },
                      { name: 'Out for Delivery', value: mockDeliveries.filter(d => d.status === 'out_for_delivery').length },
                      { name: 'Packed', value: mockDeliveries.filter(d => d.status === 'packed').length },
                      { name: 'Failed', value: failedDeliveries },
                    ]}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}`}
                  >
                    {COLORS.map((color, index) => (
                      <Cell key={`cell-${index}`} fill={color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Deliveries by Time */}
        <Card>
          <CardHeader>
            <CardTitle>Deliveries by Hour</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={[
                  { hour: '8AM', deliveries: 2 },
                  { hour: '9AM', deliveries: 5 },
                  { hour: '10AM', deliveries: 8 },
                  { hour: '11AM', deliveries: 12 },
                  { hour: '12PM', deliveries: 6 },
                  { hour: '1PM', deliveries: 4 },
                  { hour: '2PM', deliveries: 9 },
                  { hour: '3PM', deliveries: 11 },
                  { hour: '4PM', deliveries: 7 },
                  { hour: '5PM', deliveries: 3 },
                ]}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="hour" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="deliveries" fill="hsl(var(--primary))" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Route Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Route Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Route</TableHead>
                <TableHead>Area</TableHead>
                <TableHead>Shops</TableHead>
                <TableHead>Deliveries</TableHead>
                <TableHead>Success Rate</TableHead>
                <TableHead>Avg. Time</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[
                { name: 'Central Route', area: 'Negombo Central', shops: 4, deliveries: 28, successRate: 96, avgTime: 42 },
                { name: 'Beach Route', area: 'Beach Side', shops: 3, deliveries: 21, successRate: 100, avgTime: 35 },
                { name: 'Market Route', area: 'Market & Temple', shops: 5, deliveries: 35, successRate: 91, avgTime: 55 },
              ].map((route, idx) => (
                <TableRow key={idx}>
                  <TableCell className="font-medium">{route.name}</TableCell>
                  <TableCell>{route.area}</TableCell>
                  <TableCell>{route.shops}</TableCell>
                  <TableCell>{route.deliveries}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Progress value={route.successRate} className="w-16 h-2" />
                      <span className={route.successRate >= 95 ? "text-success" : "text-warning"}>
                        {route.successRate}%
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>{route.avgTime} min</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
