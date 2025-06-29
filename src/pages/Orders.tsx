import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, Download, Eye, Plus } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Badge from '../components/ui/Badge';

// Mock data - replace with real data from your API
const orders = [
  {
    id: 'ORD-001',
    type: 'Business Cards',
    quantity: 500,
    status: 'completed',
    orderDate: '2024-01-15',
    deliveryDate: '2024-01-18',
    total: '$125.00',
    description: 'Premium matte finish business cards with logo'
  },
  {
    id: 'ORD-002',
    type: 'Flyers',
    quantity: 1000,
    status: 'printing',
    orderDate: '2024-01-14',
    deliveryDate: '2024-01-17',
    total: '$89.50',
    description: 'A4 color flyers for marketing campaign'
  },
  {
    id: 'ORD-003',
    type: 'Banners',
    quantity: 2,
    status: 'pending',
    orderDate: '2024-01-13',
    deliveryDate: '2024-01-20',
    total: '$245.00',
    description: 'Large outdoor banners with weather-resistant material'
  },
  {
    id: 'ORD-004',
    type: 'Brochures',
    quantity: 250,
    status: 'design_review',
    orderDate: '2024-01-12',
    deliveryDate: '2024-01-19',
    total: '$67.25',
    description: 'Tri-fold brochures with custom design'
  },
  {
    id: 'ORD-005',
    type: 'Posters',
    quantity: 50,
    status: 'completed',
    orderDate: '2024-01-10',
    deliveryDate: '2024-01-12',
    total: '$156.00',
    description: 'A1 high-quality posters for event promotion'
  }
];

const statusColors = {
  pending: 'warning',
  design_review: 'info',
  printing: 'info',
  completed: 'success',
  cancelled: 'error'
} as const;

export default function Orders() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         order.type.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
          <p className="mt-1 text-sm text-gray-500">
            Track and manage all your print orders
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Order
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
          <div className="flex-1">
            <Input
              type="text"
              placeholder="Search orders..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              icon={<Search className="h-5 w-5" />}
            />
          </div>
          <div className="flex items-center space-x-4">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="design_review">Design Review</option>
              <option value="printing">Printing</option>
              <option value="completed">Completed</option>
            </select>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              More Filters
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
      </Card>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.map((order) => (
          <Card key={order.id} hover>
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-4 mb-3">
                  <h3 className="text-lg font-semibold text-gray-900">{order.id}</h3>
                  <Badge variant={statusColors[order.status]}>
                    {order.status.replace('_', ' ')}
                  </Badge>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-600">Product</p>
                    <p className="font-medium text-gray-900">{order.type}</p>
                    <p className="text-sm text-gray-500">{order.quantity} units</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Order Date</p>
                    <p className="font-medium text-gray-900">{order.orderDate}</p>
                    <p className="text-sm text-gray-500">Due: {order.deliveryDate}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total</p>
                    <p className="font-medium text-gray-900">{order.total}</p>
                  </div>
                </div>
                
                <p className="text-sm text-gray-600">{order.description}</p>
              </div>
              
              <div className="flex items-center space-x-2 ml-4">
                <Link to={`/orders/${order.id}`}>
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4 mr-2" />
                    View
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {filteredOrders.length === 0 && (
        <Card className="text-center py-12">
          <div className="text-gray-500">
            <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-medium mb-2">No orders found</h3>
            <p className="text-sm">
              {searchQuery || statusFilter !== 'all' 
                ? 'Try adjusting your search or filters'
                : 'You haven\'t placed any orders yet'
              }
            </p>
          </div>
        </Card>
      )}
    </div>
  );
}