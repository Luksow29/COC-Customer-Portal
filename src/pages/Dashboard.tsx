import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, FileText, Clock, DollarSign, TrendingUp, Plus } from 'lucide-react';
import { supabase, Order, Payment, getOrderStatus } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';

interface DashboardStats {
  totalOrders: number;
  pendingOrders: number;
  totalSpent: number;
  thisMonth: number;
}

interface RecentOrder extends Order {
  status: string;
}

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalOrders: 0,
    pendingOrders: 0,
    totalSpent: 0,
    thisMonth: 0
  });
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [recentInvoices, setRecentInvoices] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    if (!user) return;

    try {
      setLoading(true);

      // Fetch orders
      const { data: orders, error: ordersError } = await supabase
        .from('orders')
        .select('*')
        .eq('customer_id', user.id)
        .eq('is_deleted', false)
        .order('created_at', { ascending: false });

      if (ordersError) throw ordersError;

      // Fetch payments
      const { data: payments, error: paymentsError } = await supabase
        .from('payments')
        .select('*')
        .eq('customer_id', user.id)
        .order('created_at', { ascending: false });

      if (paymentsError) throw paymentsError;

      // Get recent orders with status
      const recentOrdersWithStatus = await Promise.all(
        (orders || []).slice(0, 3).map(async (order) => {
          const status = await getOrderStatus(order.id);
          return { ...order, status };
        })
      );

      // Calculate stats
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();
      
      const thisMonthOrders = orders?.filter(order => {
        const orderDate = new Date(order.date);
        return orderDate.getMonth() === currentMonth && orderDate.getFullYear() === currentYear;
      }) || [];

      const thisMonthSpent = thisMonthOrders.reduce((sum, order) => sum + (order.total_amount || 0), 0);

      const pendingCount = await Promise.all(
        (orders || []).map(async (order) => {
          const status = await getOrderStatus(order.id);
          return status === 'Pending' || status === 'Design' || status === 'Printing';
        })
      );

      const pendingOrdersCount = pendingCount.filter(Boolean).length;

      setStats({
        totalOrders: user.total_orders || 0,
        pendingOrders: pendingOrdersCount,
        totalSpent: user.total_spent || 0,
        thisMonth: thisMonthSpent
      });

      setRecentOrders(recentOrdersWithStatus);
      setRecentInvoices((payments || []).slice(0, 3));

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered':
      case 'paid':
        return 'success';
      case 'printing':
      case 'design':
      case 'partial':
        return 'info';
      case 'pending':
      case 'due':
        return 'warning';
      default:
        return 'default';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const statsData = [
    { 
      name: 'Total Orders', 
      value: stats.totalOrders.toString(), 
      change: '+12%', 
      icon: Package, 
      color: 'text-blue-600' 
    },
    { 
      name: 'Pending Orders', 
      value: stats.pendingOrders.toString(), 
      change: '-2%', 
      icon: Clock, 
      color: 'text-amber-600' 
    },
    { 
      name: 'Total Spent', 
      value: formatCurrency(stats.totalSpent), 
      change: '+18%', 
      icon: DollarSign, 
      color: 'text-emerald-600' 
    },
    { 
      name: 'This Month', 
      value: formatCurrency(stats.thisMonth), 
      change: '+24%', 
      icon: TrendingUp, 
      color: 'text-purple-600' 
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-1 text-sm text-gray-500">
            Welcome back, {user?.name}! Here's what's happening with your orders.
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Order
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {statsData.map((stat) => (
          <Card key={stat.name} className="hover:shadow-md transition-shadow">
            <div className="flex items-center">
              <div className={`p-2 rounded-lg bg-gray-50 ${stat.color}`}>
                <stat.icon className="h-6 w-6" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                <div className="flex items-baseline">
                  <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                  <span className={`ml-2 text-sm font-medium ${
                    stat.change.startsWith('+') ? 'text-emerald-600' : 'text-red-600'
                  }`}>
                    {stat.change}
                  </span>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Orders */}
        <Card>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Recent Orders</h3>
            <Link
              to="/orders"
              className="text-sm font-medium text-blue-600 hover:text-blue-500"
            >
              View all
            </Link>
          </div>
          <div className="space-y-4">
            {recentOrders.length > 0 ? (
              recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-medium text-gray-900">ORD-{order.id}</h4>
                      <Badge variant={getStatusBadgeVariant(order.status)}>
                        {order.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">{order.order_type} • {order.quantity} units</p>
                    <p className="text-xs text-gray-500">{order.date}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">{formatCurrency(order.total_amount)}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No orders found</p>
              </div>
            )}
          </div>
        </Card>

        {/* Recent Invoices */}
        <Card>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Recent Invoices</h3>
            <Link
              to="/invoices"
              className="text-sm font-medium text-blue-600 hover:text-blue-500"
            >
              View all
            </Link>
          </div>
          <div className="space-y-4">
            {recentInvoices.length > 0 ? (
              recentInvoices.map((invoice) => (
                <div key={invoice.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-medium text-gray-900">INV-{invoice.id.slice(-6)}</h4>
                      <Badge variant={getStatusBadgeVariant(invoice.status)}>
                        {invoice.status}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-500">{invoice.created_at?.split('T')[0]}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">{formatCurrency(invoice.total_amount)}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No invoices found</p>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Button variant="outline" className="h-24 flex-col">
            <Package className="h-6 w-6 mb-2" />
            <span>New Order</span>
          </Button>
          <Link to="/invoices" className="block">
            <Button variant="outline" className="w-full h-24 flex-col">
              <FileText className="h-6 w-6 mb-2" />
              <span>View Invoices</span>
            </Button>
          </Link>
          <Link to="/orders" className="block">
            <Button variant="outline" className="w-full h-24 flex-col">
              <Clock className="h-6 w-6 mb-2" />
              <span>Track Orders</span>
            </Button>
          </Link>
          <Link to="/support" className="block">
            <Button variant="outline" className="w-full h-24 flex-col">
              <Plus className="h-6 w-6 mb-2" />
              <span>Get Support</span>
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}