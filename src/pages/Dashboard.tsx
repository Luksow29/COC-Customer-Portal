import React from 'react';
import { Link } from 'react-router-dom';
import { Package, FileText, Clock, DollarSign, TrendingUp, Plus } from 'lucide-react';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';

// Mock data - replace with real data from your API
const stats = [
  { name: 'Total Orders', value: '24', change: '+12%', icon: Package, color: 'text-blue-600' },
  { name: 'Pending Orders', value: '3', change: '-2%', icon: Clock, color: 'text-amber-600' },
  { name: 'Total Spent', value: '$2,847', change: '+18%', icon: DollarSign, color: 'text-emerald-600' },
  { name: 'This Month', value: '$542', change: '+24%', icon: TrendingUp, color: 'text-purple-600' },
];

const recentOrders = [
  {
    id: 'ORD-001',
    type: 'Business Cards',
    quantity: 500,
    status: 'completed',
    date: '2024-01-15',
    total: '$125.00'
  },
  {
    id: 'ORD-002',
    type: 'Flyers',
    quantity: 1000,
    status: 'printing',
    date: '2024-01-14',
    total: '$89.50'
  },
  {
    id: 'ORD-003',
    type: 'Banners',
    quantity: 2,
    status: 'pending',
    date: '2024-01-13',
    total: '$245.00'
  }
];

const recentInvoices = [
  {
    id: 'INV-001',
    amount: '$125.00',
    status: 'paid',
    date: '2024-01-15'
  },
  {
    id: 'INV-002',
    amount: '$89.50',
    status: 'pending',
    date: '2024-01-14'
  }
];

export default function Dashboard() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-1 text-sm text-gray-500">
            Welcome back! Here's what's happening with your orders.
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
        {stats.map((stat) => (
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
            {recentOrders.map((order) => (
              <div key={order.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium text-gray-900">{order.id}</h4>
                    <Badge 
                      variant={
                        order.status === 'completed' ? 'success' :
                        order.status === 'printing' ? 'info' : 'warning'
                      }
                    >
                      {order.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600">{order.type} • {order.quantity} units</p>
                  <p className="text-xs text-gray-500">{order.date}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{order.total}</p>
                </div>
              </div>
            ))}
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
            {recentInvoices.map((invoice) => (
              <div key={invoice.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium text-gray-900">{invoice.id}</h4>
                    <Badge 
                      variant={invoice.status === 'paid' ? 'success' : 'warning'}
                    >
                      {invoice.status}
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-500">{invoice.date}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{invoice.amount}</p>
                </div>
              </div>
            ))}
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
          <Button variant="outline" className="h-24 flex-col">
            <FileText className="h-6 w-6 mb-2" />
            <span>View Invoices</span>
          </Button>
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