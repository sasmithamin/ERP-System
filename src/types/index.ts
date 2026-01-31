// User & Authentication Types
export type UserRole = 'admin' | 'warehouse' | 'delivery';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  avatar?: string;
  isActive: boolean;
  createdAt: Date;
  lastLogin?: Date;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// Product & Inventory Types
export type ProductCategory = 'dairy' | 'biscuit';

export interface Product {
  id: string;
  name: string;
  sku: string;
  category: ProductCategory;
  description?: string;
  unit: string;
  unitPrice: number;
  reorderLevel: number;
  imageUrl?: string;
  isActive: boolean;
}

export interface InventoryItem {
  id: string;
  productId: string;
  product?: Product;
  batchNumber: string;
  quantity: number;
  expiryDate?: Date;
  manufacturedDate?: Date;
  location: string;
  costPrice: number;
  lastUpdated: Date;
}

export interface StockMovement {
  id: string;
  productId: string;
  product?: Product;
  type: 'in' | 'out' | 'adjustment' | 'waste';
  quantity: number;
  batchNumber?: string;
  reason: string;
  performedBy: string;
  createdAt: Date;
  referenceId?: string;
  referenceType?: 'purchase_order' | 'delivery' | 'manual';
}

// Supplier Types
export interface Supplier {
  id: string;
  name: string;
  agency: ProductCategory;
  contactPerson: string;
  phone: string;
  email: string;
  address: string;
  isActive: boolean;
  createdAt: Date;
}

export type PurchaseOrderStatus = 'draft' | 'pending' | 'confirmed' | 'in_transit' | 'received' | 'cancelled';

export interface PurchaseOrderItem {
  productId: string;
  product?: Product;
  quantity: number;
  unitPrice: number;
  receivedQuantity?: number;
}

export interface PurchaseOrder {
  id: string;
  supplierId: string;
  supplier?: Supplier;
  orderNumber: string;
  status: PurchaseOrderStatus;
  items: PurchaseOrderItem[];
  expectedDeliveryDate: Date;
  receivedDate?: Date;
  totalAmount: number;
  notes?: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

// Shop & Order Types
export interface Shop {
  id: string;
  name: string;
  ownerName: string;
  phone: string;
  email?: string;
  address: string;
  area: string;
  creditLimit: number;
  currentBalance: number;
  isActive: boolean;
  createdAt: Date;
}

export type OrderStatus = 'pending' | 'approved' | 'processing' | 'packed' | 'out_for_delivery' | 'delivered' | 'cancelled';
export type PaymentStatus = 'pending' | 'partial' | 'paid';
export type PaymentMethod = 'cash' | 'credit' | 'bank_transfer';

export interface OrderItem {
  productId: string;
  product?: Product;
  quantity: number;
  unitPrice: number;
  discount?: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  shopId: string;
  shop?: Shop;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  totalAmount: number;
  dueDate?: Date;
  notes?: string;
  isRecurring: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  orderId: string;
  order?: Order;
  shopId: string;
  shop?: Shop;
  totalAmount: number;
  paidAmount: number;
  dueDate: Date;
  status: PaymentStatus;
  createdAt: Date;
}

// Delivery Types
export type DeliveryStatus = 'pending' | 'packed' | 'out_for_delivery' | 'delivered' | 'failed' | 'returned';

export interface DeliveryRoute {
  id: string;
  name: string;
  area: string;
  shops: string[];
  assignedDriver?: string;
  estimatedTime: number;
}

export interface Delivery {
  id: string;
  orderId: string;
  order?: Order;
  routeId?: string;
  route?: DeliveryRoute;
  driverId?: string;
  driver?: User;
  status: DeliveryStatus;
  scheduledDate: Date;
  deliveredAt?: Date;
  proofOfDelivery?: {
    signature?: string;
    photoUrl?: string;
    notes?: string;
    receivedBy?: string;
  };
  returnedItems?: {
    productId: string;
    quantity: number;
    reason: string;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

// Report Types
export interface SalesReport {
  period: string;
  totalSales: number;
  totalOrders: number;
  dairySales: number;
  biscuitSales: number;
  topProducts: { productId: string; productName: string; quantity: number; revenue: number }[];
  topShops: { shopId: string; shopName: string; orderCount: number; totalSpent: number }[];
}

export interface InventoryReport {
  totalProducts: number;
  lowStockItems: number;
  expiringItems: number;
  totalValue: number;
  dairyValue: number;
  biscuitValue: number;
  wasteValue: number;
}

export interface DeliveryReport {
  totalDeliveries: number;
  successfulDeliveries: number;
  failedDeliveries: number;
  averageDeliveryTime: number;
  onTimePercentage: number;
}

// Dashboard Types
export interface DashboardStats {
  todayOrders: number;
  pendingDeliveries: number;
  lowStockAlerts: number;
  expiringItems: number;
  todayRevenue: number;
  weeklyGrowth: number;
}

export interface ActivityItem {
  id: string;
  type: 'order' | 'delivery' | 'stock' | 'user';
  message: string;
  timestamp: Date;
  userId?: string;
}
