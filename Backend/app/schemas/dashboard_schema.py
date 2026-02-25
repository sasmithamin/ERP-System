from typing import List, Optional
from datetime import datetime
from pydantic import BaseModel
from enum import Enum


class ActivityType(str, Enum):
    ORDER = "order"
    DELIVERY = "delivery"
    STOCK = "stock"
    USER = "user"


class DashboardStats(BaseModel):
    todayOrders: int
    pendingDeliveries: int
    lowStockAlerts: int
    expiringItems: int
    todayRevenue: float
    weeklyGrowth: float


class ActivityItem(BaseModel):
    id: str
    type: ActivityType
    message: str
    timestamp: datetime
    userId: Optional[str] = None
    userName: Optional[str] = None


class RecentOrderItem(BaseModel):
    productId: str
    quantity: int
    unitPrice: float
    discount: Optional[float] = 0


class RecentOrder(BaseModel):
    id: str
    orderNumber: str
    shopId: str
    shopName: Optional[str]
    status: str
    paymentMethod: str
    items: List[RecentOrderItem]
    totalAmount: float
    createdAt: datetime


class LowStockAlert(BaseModel):
    id: str
    productId: str
    productName: str
    sku: str
    currentQuantity: int
    reorderLevel: int
    location: str
    category: str
    percentage: float


class ExpiringItem(BaseModel):
    id: str
    productId: str
    productName: str
    batchNumber: str
    quantity: int
    expiryDate: datetime
    daysLeft: int
    location: str


class InventoryAlertItem(BaseModel):
    id: str
    itemId: str
    productId: str
    productName: str
    batchNumber: str
    currentQuantity: int
    reorderLevel: int
    expiryDate: Optional[datetime]
    location: str
    alertType: str  # "low_stock" or "expiring"
    daysLeft: Optional[int]


class DashboardResponse(BaseModel):
    stats: DashboardStats
    recentOrders: List[RecentOrder]
    lowStockAlerts: List[LowStockAlert]
    expiringItems: List[ExpiringItem]
    recentActivities: List[ActivityItem]