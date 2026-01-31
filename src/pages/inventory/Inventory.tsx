import { Routes, Route } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { 
  Plus, Package, Search, AlertTriangle, Clock, ArrowUpRight, 
  ArrowDownRight, RefreshCw, Trash2, Eye, Edit
} from "lucide-react";
import { mockInventory, mockProducts, mockStockMovements, getProductById } from "@/data/mockData";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

const movementTypeColors: Record<string, string> = {
  in: "bg-success/10 text-success",
  out: "bg-info/10 text-info",
  adjustment: "bg-warning/10 text-warning",
  waste: "bg-destructive/10 text-destructive",
};

const movementTypeIcons: Record<string, React.ReactNode> = {
  in: <ArrowDownRight className="h-4 w-4" />,
  out: <ArrowUpRight className="h-4 w-4" />,
  adjustment: <RefreshCw className="h-4 w-4" />,
  waste: <Trash2 className="h-4 w-4" />,
};

export default function Inventory() {
  return (
    <Routes>
      <Route index element={<StockOverview />} />
      <Route path="products" element={<ProductList />} />
      <Route path="movements" element={<StockMovements />} />
      <Route path="waste" element={<WasteTracking />} />
    </Routes>
  );
}

function StockOverview() {
  const totalItems = mockInventory.reduce((sum, item) => sum + item.quantity, 0);
  const totalValue = mockInventory.reduce((sum, item) => sum + (item.quantity * item.costPrice), 0);
  
  const lowStockItems = mockInventory.filter(item => {
    const product = getProductById(item.productId);
    return product && item.quantity <= product.reorderLevel;
  });

  const expiringItems = mockInventory.filter(item => {
    if (!item.expiryDate) return false;
    const daysUntilExpiry = Math.ceil((item.expiryDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    return daysUntilExpiry <= 7 && daysUntilExpiry >= 0;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Stock Overview</h1>
          <p className="text-muted-foreground">Current inventory levels and batch tracking</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline"><RefreshCw className="h-4 w-4 mr-2" /> Stock Count</Button>
          <Button><Plus className="h-4 w-4 mr-2" /> Add Stock</Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Items</CardDescription>
            <CardTitle className="text-2xl">{totalItems.toLocaleString()}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Stock Value</CardDescription>
            <CardTitle className="text-2xl">Rs. {totalValue.toLocaleString()}</CardTitle>
          </CardHeader>
        </Card>
        <Card className={lowStockItems.length > 0 ? "border-warning" : ""}>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-1">
              <AlertTriangle className="h-3 w-3 text-warning" /> Low Stock
            </CardDescription>
            <CardTitle className="text-2xl text-warning">{lowStockItems.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card className={expiringItems.length > 0 ? "border-destructive" : ""}>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-1">
              <Clock className="h-3 w-3 text-destructive" /> Expiring Soon
            </CardDescription>
            <CardTitle className="text-2xl text-destructive">{expiringItems.length}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Alerts */}
      {(lowStockItems.length > 0 || expiringItems.length > 0) && (
        <div className="grid gap-4 md:grid-cols-2">
          {lowStockItems.length > 0 && (
            <Card className="border-warning">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-warning" />
                  Low Stock Alerts
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {lowStockItems.slice(0, 3).map(item => {
                  const product = getProductById(item.productId);
                  const percentage = product ? Math.round((item.quantity / product.reorderLevel) * 100) : 0;
                  return (
                    <div key={item.id} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>{product?.name}</span>
                        <span className="text-muted-foreground">{item.quantity} left</span>
                      </div>
                      <Progress value={percentage} className="h-2" />
                    </div>
                  );
                })}
                {lowStockItems.length > 3 && (
                  <Button variant="link" size="sm" className="p-0 h-auto">
                    View all {lowStockItems.length} items
                  </Button>
                )}
              </CardContent>
            </Card>
          )}
          {expiringItems.length > 0 && (
            <Card className="border-destructive">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Clock className="h-4 w-4 text-destructive" />
                  Expiring Soon
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {expiringItems.slice(0, 3).map(item => {
                  const product = getProductById(item.productId);
                  const daysLeft = item.expiryDate 
                    ? Math.ceil((item.expiryDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
                    : 0;
                  return (
                    <div key={item.id} className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">{product?.name}</p>
                        <p className="text-xs text-muted-foreground">Batch: {item.batchNumber}</p>
                      </div>
                      <Badge variant={daysLeft <= 3 ? "destructive" : "outline"}>
                        {daysLeft} days
                      </Badge>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Search and Filter */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search inventory..." className="pl-9" />
        </div>
        <Tabs defaultValue="all" className="w-auto">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="dairy">Dairy</TabsTrigger>
            <TabsTrigger value="biscuit">Biscuits</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Inventory Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Batch</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Expiry Date</TableHead>
                <TableHead>Value</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockInventory.map(item => {
                const product = getProductById(item.productId);
                const isLowStock = product && item.quantity <= product.reorderLevel;
                const daysUntilExpiry = item.expiryDate 
                  ? Math.ceil((item.expiryDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
                  : null;
                const isExpiringSoon = daysUntilExpiry !== null && daysUntilExpiry <= 7;
                
                return (
                  <TableRow key={item.id} className="cursor-pointer hover:bg-muted/50">
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Package className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="font-medium">{product?.name}</p>
                          <Badge variant="outline" className="text-xs capitalize">{product?.category}</Badge>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-sm">{item.batchNumber}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className={isLowStock ? "text-warning font-medium" : ""}>
                          {item.quantity}
                        </span>
                        {isLowStock && <AlertTriangle className="h-4 w-4 text-warning" />}
                      </div>
                    </TableCell>
                    <TableCell>{item.location}</TableCell>
                    <TableCell>
                      {item.expiryDate ? (
                        <div className={isExpiringSoon ? "text-destructive" : ""}>
                          {format(item.expiryDate, "PP")}
                          {isExpiringSoon && (
                            <p className="text-xs">({daysUntilExpiry}d left)</p>
                          )}
                        </div>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell className="font-medium">
                      Rs. {(item.quantity * item.costPrice).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      {isLowStock ? (
                        <Badge variant="destructive">Low Stock</Badge>
                      ) : isExpiringSoon ? (
                        <Badge variant="outline" className="text-destructive">Expiring</Badge>
                      ) : (
                        <Badge variant="secondary">In Stock</Badge>
                      )}
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
    </div>
  );
}

function ProductList() {
  const dairyProducts = mockProducts.filter(p => p.category === 'dairy');
  const biscuitProducts = mockProducts.filter(p => p.category === 'biscuit');

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Products</h1>
          <p className="text-muted-foreground">Product catalog and pricing</p>
        </div>
        <Button><Plus className="h-4 w-4 mr-2" /> Add Product</Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Products</CardDescription>
            <CardTitle className="text-2xl">{mockProducts.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Dairy Products</CardDescription>
            <CardTitle className="text-2xl text-primary">{dairyProducts.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Biscuit Products</CardDescription>
            <CardTitle className="text-2xl text-warning">{biscuitProducts.length}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search products..." className="pl-9" />
      </div>

      {/* Products Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Unit</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Reorder Level</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockProducts.map(product => (
                <TableRow key={product.id} className="cursor-pointer hover:bg-muted/50">
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell className="font-mono text-sm">{product.sku}</TableCell>
                  <TableCell>
                    <Badge variant={product.category === 'dairy' ? 'default' : 'secondary'} className="capitalize">
                      {product.category}
                    </Badge>
                  </TableCell>
                  <TableCell>{product.unit}</TableCell>
                  <TableCell className="font-medium">Rs. {product.unitPrice}</TableCell>
                  <TableCell>{product.reorderLevel}</TableCell>
                  <TableCell>
                    <Badge variant={product.isActive ? "default" : "secondary"}>
                      {product.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="icon"><Eye className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon"><Edit className="h-4 w-4" /></Button>
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

function StockMovements() {
  const inMovements = mockStockMovements.filter(m => m.type === 'in');
  const outMovements = mockStockMovements.filter(m => m.type === 'out');
  const wasteMovements = mockStockMovements.filter(m => m.type === 'waste');

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Stock Movements</h1>
          <p className="text-muted-foreground">Track all inventory changes</p>
        </div>
        <Button><Plus className="h-4 w-4 mr-2" /> Record Movement</Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Movements</CardDescription>
            <CardTitle className="text-2xl">{mockStockMovements.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-1">
              <ArrowDownRight className="h-3 w-3 text-success" /> Stock In
            </CardDescription>
            <CardTitle className="text-2xl text-success">{inMovements.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-1">
              <ArrowUpRight className="h-3 w-3 text-info" /> Stock Out
            </CardDescription>
            <CardTitle className="text-2xl text-info">{outMovements.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-1">
              <Trash2 className="h-3 w-3 text-destructive" /> Waste
            </CardDescription>
            <CardTitle className="text-2xl text-destructive">{wasteMovements.length}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Filters */}
      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="in">Stock In</TabsTrigger>
          <TabsTrigger value="out">Stock Out</TabsTrigger>
          <TabsTrigger value="adjustment">Adjustments</TabsTrigger>
          <TabsTrigger value="waste">Waste</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Movements Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Product</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Batch</TableHead>
                <TableHead>Reason</TableHead>
                <TableHead>Reference</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockStockMovements.map(movement => {
                const product = getProductById(movement.productId);
                return (
                  <TableRow key={movement.id}>
                    <TableCell>{format(movement.createdAt, "PP")}</TableCell>
                    <TableCell>
                      <Badge className={cn("capitalize", movementTypeColors[movement.type])}>
                        <span className="mr-1">{movementTypeIcons[movement.type]}</span>
                        {movement.type}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium">{product?.name}</TableCell>
                    <TableCell>
                      <span className={cn(
                        "font-medium",
                        movement.type === 'in' ? "text-success" : 
                        movement.type === 'waste' ? "text-destructive" : ""
                      )}>
                        {movement.type === 'in' ? '+' : '-'}{Math.abs(movement.quantity)}
                      </span>
                    </TableCell>
                    <TableCell className="font-mono text-sm">
                      {movement.batchNumber || '-'}
                    </TableCell>
                    <TableCell className="max-w-[200px] truncate">{movement.reason}</TableCell>
                    <TableCell>
                      {movement.referenceId ? (
                        <Badge variant="outline" className="text-xs capitalize">
                          {movement.referenceType?.replace('_', ' ')}
                        </Badge>
                      ) : (
                        <span className="text-muted-foreground">Manual</span>
                      )}
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

function WasteTracking() {
  const wasteMovements = mockStockMovements.filter(m => m.type === 'waste');
  const totalWasteQuantity = wasteMovements.reduce((sum, m) => sum + Math.abs(m.quantity), 0);
  
  // Calculate waste value
  const wasteValue = wasteMovements.reduce((sum, m) => {
    const product = getProductById(m.productId);
    return sum + (product ? Math.abs(m.quantity) * product.unitPrice : 0);
  }, 0);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Waste Tracking</h1>
          <p className="text-muted-foreground">Monitor expired and damaged inventory</p>
        </div>
        <Button variant="destructive"><Trash2 className="h-4 w-4 mr-2" /> Record Waste</Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-destructive">
          <CardHeader className="pb-2">
            <CardDescription>Total Waste Items</CardDescription>
            <CardTitle className="text-2xl text-destructive">{totalWasteQuantity}</CardTitle>
          </CardHeader>
        </Card>
        <Card className="border-destructive">
          <CardHeader className="pb-2">
            <CardDescription>Waste Value</CardDescription>
            <CardTitle className="text-2xl text-destructive">Rs. {wasteValue.toLocaleString()}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>This Month</CardDescription>
            <CardTitle className="text-2xl">{wasteMovements.length} incidents</CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Waste Records */}
      <Card>
        <CardHeader>
          <CardTitle>Waste Records</CardTitle>
          <CardDescription>All recorded waste, expired, and damaged items</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Product</TableHead>
                <TableHead>Batch</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Value Lost</TableHead>
                <TableHead>Reason</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {wasteMovements.length > 0 ? (
                wasteMovements.map(movement => {
                  const product = getProductById(movement.productId);
                  const valueLost = product ? Math.abs(movement.quantity) * product.unitPrice : 0;
                  return (
                    <TableRow key={movement.id}>
                      <TableCell>{format(movement.createdAt, "PP")}</TableCell>
                      <TableCell className="font-medium">{product?.name}</TableCell>
                      <TableCell className="font-mono text-sm">{movement.batchNumber || '-'}</TableCell>
                      <TableCell className="text-destructive font-medium">
                        {Math.abs(movement.quantity)}
                      </TableCell>
                      <TableCell className="text-destructive">
                        Rs. {valueLost.toLocaleString()}
                      </TableCell>
                      <TableCell>{movement.reason}</TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                    No waste records found
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
