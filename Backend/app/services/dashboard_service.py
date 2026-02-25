from datetime import datetime, timedelta
from typing import List, Dict, Any, Optional
from bson import ObjectId
from motor.motor_asyncio import AsyncIOMotorDatabase
import logging

logger = logging.getLogger(__name__)


class DashboardService:
    def __init__(self, db: AsyncIOMotorDatabase):
        self.db = db

    async def get_dashboard_stats(self, user_id: str) -> Dict[str, Any]:
        """Get dashboard statistics matching your frontend DashboardStats type"""
        try:
            today = datetime.utcnow().replace(hour=0, minute=0, second=0, microsecond=0)
            tomorrow = today + timedelta(days=1)
            last_week = today - timedelta(days=7)
            two_weeks_ago = today - timedelta(days=14)

            # Today's orders count
            today_orders = await self.db.orders.count_documents({
                "createdAt": {"$gte": today, "$lt": tomorrow}
            })

            # Pending deliveries
            pending_deliveries = await self.db.deliveries.count_documents({
                "status": {"$in": ["pending", "packed", "out_for_delivery"]}
            })

            # Low stock alerts
            pipeline = [
                {
                    "$lookup": {
                        "from": "products",
                        "localField": "productId",
                        "foreignField": "_id",
                        "as": "product"
                    }
                },
                {"$unwind": "$product"},
                {
                    "$match": {
                        "$expr": {"$lte": ["$quantity", "$product.reorderLevel"]}
                    }
                },
                {"$count": "count"}
            ]
            low_stock_result = await self.db.inventory.aggregate(pipeline).to_list(1)
            low_stock_alerts = low_stock_result[0]["count"] if low_stock_result else 0

            # Expiring items (within 7 days)
            expiring_pipeline = [
                {
                    "$match": {
                        "expiryDate": {
                            "$gte": today,
                            "$lte": today + timedelta(days=7)
                        }
                    }
                },
                {"$count": "count"}
            ]
            expiring_result = await self.db.inventory.aggregate(expiring_pipeline).to_list(1)
            expiring_items = expiring_result[0]["count"] if expiring_result else 0

            # Today's revenue
            revenue_pipeline = [
                {
                    "$match": {
                        "createdAt": {"$gte": today, "$lt": tomorrow},
                        "status": "delivered"
                    }
                },
                {
                    "$group": {
                        "_id": None,
                        "total": {"$sum": "$totalAmount"}
                    }
                }
            ]
            revenue_result = await self.db.orders.aggregate(revenue_pipeline).to_list(1)
            today_revenue = revenue_result[0]["total"] if revenue_result else 0

            # Weekly growth calculation
            current_week_pipeline = [
                {
                    "$match": {
                        "createdAt": {"$gte": last_week, "$lt": today},
                        "status": "delivered"
                    }
                },
                {"$group": {"_id": None, "total": {"$sum": "$totalAmount"}}}
            ]
            current_week_result = await self.db.orders.aggregate(current_week_pipeline).to_list(1)
            current_week = current_week_result[0]["total"] if current_week_result else 0

            previous_week_pipeline = [
                {
                    "$match": {
                        "createdAt": {"$gte": two_weeks_ago, "$lt": last_week},
                        "status": "delivered"
                    }
                },
                {"$group": {"_id": None, "total": {"$sum": "$totalAmount"}}}
            ]
            previous_week_result = await self.db.orders.aggregate(previous_week_pipeline).to_list(1)
            previous_week = previous_week_result[0]["total"] if previous_week_result else 0

            weekly_growth = 0
            if previous_week > 0:
                weekly_growth = ((current_week - previous_week) / previous_week) * 100

            return {
                "todayOrders": today_orders,
                "pendingDeliveries": pending_deliveries,
                "lowStockAlerts": low_stock_alerts,
                "expiringItems": expiring_items,
                "todayRevenue": float(today_revenue),
                "weeklyGrowth": round(weekly_growth, 1)
            }

        except Exception as e:
            logger.error(f"Error getting dashboard stats: {e}")
            raise

    async def get_recent_orders(self, limit: int = 5) -> List[Dict[str, Any]]:
        """Get recent orders matching your RecentOrder component needs"""
        try:
            pipeline = [
                {"$sort": {"createdAt": -1}},
                {"$limit": limit},
                {
                    "$lookup": {
                        "from": "shops",
                        "localField": "shopId",
                        "foreignField": "_id",
                        "as": "shop"
                    }
                },
                {"$unwind": {"path": "$shop", "preserveNullAndEmptyArrays": True}},
                {
                    "$project": {
                        "_id": {"$toString": "$_id"},
                        "orderNumber": 1,
                        "shopId": {"$toString": "$shopId"},
                        "shopName": "$shop.name",
                        "status": 1,
                        "paymentMethod": 1,
                        "items": {
                            "$map": {
                                "input": "$items",
                                "as": "item",
                                "in": {
                                    "productId": {"$toString": "$$item.productId"},
                                    "quantity": "$$item.quantity",
                                    "unitPrice": "$$item.unitPrice",
                                    "discount": "$$item.discount"
                                }
                            }
                        },
                        "totalAmount": 1,
                        "createdAt": 1
                    }
                }
            ]
            
            orders = await self.db.orders.aggregate(pipeline).to_list(limit)
            return orders

        except Exception as e:
            logger.error(f"Error getting recent orders: {e}")
            return []

    async def get_low_stock_alerts(self) -> List[Dict[str, Any]]:
        """Get low stock alerts for inventory alerts component"""
        try:
            pipeline = [
                {
                    "$lookup": {
                        "from": "products",
                        "localField": "productId",
                        "foreignField": "_id",
                        "as": "product"
                    }
                },
                {"$unwind": "$product"},
                {
                    "$match": {
                        "$expr": {"$lte": ["$quantity", "$product.reorderLevel"]}
                    }
                },
                {
                    "$project": {
                        "_id": {"$toString": "$_id"},
                        "productId": {"$toString": "$productId"},
                        "productName": "$product.name",
                        "sku": "$product.sku",
                        "currentQuantity": "$quantity",
                        "reorderLevel": "$product.reorderLevel",
                        "location": 1,
                        "category": "$product.category",
                        "percentage": {
                            "$multiply": [
                                {"$divide": ["$quantity", "$product.reorderLevel"]},
                                100
                            ]
                        }
                    }
                },
                {"$sort": {"percentage": 1}},
                {"$limit": 5}
            ]
            
            alerts = await self.db.inventory.aggregate(pipeline).to_list(5)
            return alerts

        except Exception as e:
            logger.error(f"Error getting low stock alerts: {e}")
            return []

    async def get_expiring_items(self) -> List[Dict[str, Any]]:
        """Get expiring items for inventory alerts component"""
        try:
            today = datetime.utcnow()
            seven_days_later = today + timedelta(days=7)

            pipeline = [
                {
                    "$match": {
                        "expiryDate": {"$gte": today, "$lte": seven_days_later}
                    }
                },
                {
                    "$lookup": {
                        "from": "products",
                        "localField": "productId",
                        "foreignField": "_id",
                        "as": "product"
                    }
                },
                {"$unwind": "$product"},
                {
                    "$project": {
                        "_id": {"$toString": "$_id"},
                        "productId": {"$toString": "$productId"},
                        "productName": "$product.name",
                        "batchNumber": 1,
                        "quantity": 1,
                        "expiryDate": 1,
                        "location": 1,
                        "daysLeft": {
                            "$ceil": {
                                "$divide": [
                                    {"$subtract": ["$expiryDate", today]},
                                    86400000  # milliseconds in a day
                                ]
                            }
                        }
                    }
                },
                {"$sort": {"daysLeft": 1}},
                {"$limit": 5}
            ]
            
            items = await self.db.inventory.aggregate(pipeline).to_list(5)
            return items

        except Exception as e:
            logger.error(f"Error getting expiring items: {e}")
            return []

    async def get_recent_activities(self, limit: int = 10) -> List[Dict[str, Any]]:
        """Get recent activities matching your ActivityItem type"""
        try:
            pipeline = [
                {"$sort": {"timestamp": -1}},
                {"$limit": limit},
                {
                    "$lookup": {
                        "from": "users",
                        "localField": "userId",
                        "foreignField": "_id",
                        "as": "user"
                    }
                },
                {"$unwind": {"path": "$user", "preserveNullAndEmptyArrays": True}},
                {
                    "$project": {
                        "_id": {"$toString": "$_id"},
                        "type": 1,
                        "message": 1,
                        "timestamp": 1,
                        "userId": {"$toString": "$userId"},
                        "userName": "$user.name"
                    }
                }
            ]
            
            activities = await self.db.activities.aggregate(pipeline).to_list(limit)
            return activities

        except Exception as e:
            logger.error(f"Error getting recent activities: {e}")
            return []

    async def create_activity(self, activity_data: Dict[str, Any]) -> str:
        """Create a new activity record"""
        try:
            activity_data["timestamp"] = datetime.utcnow()
            result = await self.db.activities.insert_one(activity_data)
            return str(result.inserted_id)
        except Exception as e:
            logger.error(f"Error creating activity: {e}")
            raise

    async def log_order_activity(self, order_id: str, order_number: str, shop_name: str, user_id: Optional[str] = None):
        """Log order activity"""
        message = f"New order #{order_number} from {shop_name}"
        await self.create_activity({
            "type": "order",
            "message": message,
            "userId": user_id
        })

    async def log_delivery_activity(self, shop_name: str, status: str, user_id: Optional[str] = None):
        """Log delivery activity"""
        if status == "delivered":
            message = f"Delivery completed for {shop_name}"
        else:
            message = f"Delivery {status} for {shop_name}"
        
        await self.create_activity({
            "type": "delivery",
            "message": message,
            "userId": user_id
        })

    async def log_stock_activity(self, message: str, user_id: Optional[str] = None):
        """Log stock activity"""
        await self.create_activity({
            "type": "stock",
            "message": message,
            "userId": user_id
        })

    async def log_user_activity(self, message: str, user_id: str):
        """Log user activity"""
        await self.create_activity({
            "type": "user",
            "message": message,
            "userId": user_id
        })