from typing import Any, Annotated
from fastapi import APIRouter, Depends, HTTPException, status
from motor.motor_asyncio import AsyncIOMotorDatabase

from app.core.database import get_database
from app.api.dependencies import get_current_active_user
from app.services.dashboard_service import DashboardService
from app.schemas.dashboard_schema import DashboardResponse, DashboardStats
from app.schemas.user_schema import User

router = APIRouter(prefix="/dashboard", tags=["dashboard"])


@router.get("/stats", response_model=DashboardStats)
async def get_dashboard_stats(
    db: Annotated[AsyncIOMotorDatabase, Depends(get_database)],
    current_user: Annotated[User, Depends(get_current_active_user)]
) -> Any:
    """Get dashboard statistics"""
    try:
        service = DashboardService(db)
        stats = await service.get_dashboard_stats(current_user.id)
        return stats
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error fetching dashboard stats: {str(e)}"
        )


@router.get("/full", response_model=DashboardResponse)
async def get_full_dashboard(
    db: Annotated[AsyncIOMotorDatabase, Depends(get_database)],
    current_user: Annotated[User, Depends(get_current_active_user)]
) -> Any:
    """Get complete dashboard data (all components in one call)"""
    try:
        service = DashboardService(db)
        
        # Fetch all data in parallel
        stats = await service.get_dashboard_stats(current_user.id)
        recent_orders = await service.get_recent_orders()
        low_stock_alerts = await service.get_low_stock_alerts()
        expiring_items = await service.get_expiring_items()
        recent_activities = await service.get_recent_activities()
        
        return {
            "stats": stats,
            "recentOrders": recent_orders,
            "lowStockAlerts": low_stock_alerts,
            "expiringItems": expiring_items,
            "recentActivities": recent_activities
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error fetching dashboard data: {str(e)}"
        )


@router.get("/recent-orders", response_model=list)
async def get_recent_orders(
    db: Annotated[AsyncIOMotorDatabase, Depends(get_database)],
    current_user: Annotated[User, Depends(get_current_active_user)],
    limit: int = 5
) -> Any:
    """Get recent orders for dashboard"""
    try:
        service = DashboardService(db)
        orders = await service.get_recent_orders(limit)
        return orders
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error fetching recent orders: {str(e)}"
        )


@router.get("/inventory-alerts", response_model=dict)
async def get_inventory_alerts(
    db: Annotated[AsyncIOMotorDatabase, Depends(get_database)],
    current_user: Annotated[User, Depends(get_current_active_user)]
) -> Any:
    """Get inventory alerts (low stock and expiring items)"""
    try:
        service = DashboardService(db)
        low_stock = await service.get_low_stock_alerts()
        expiring = await service.get_expiring_items()
        
        return {
            "lowStock": low_stock,
            "expiringItems": expiring,
            "lowStockCount": len(low_stock),
            "expiringCount": len(expiring)
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error fetching inventory alerts: {str(e)}"
        )


@router.get("/activities", response_model=list)
async def get_recent_activities(
    db: Annotated[AsyncIOMotorDatabase, Depends(get_database)],
    current_user: Annotated[User, Depends(get_current_active_user)],
    limit: int = 10
) -> Any:
    """Get recent activities"""
    try:
        service = DashboardService(db)
        activities = await service.get_recent_activities(limit)
        return activities
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error fetching activities: {str(e)}"
        )