import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Download, MessageCircle, Calendar, Package, FileText, CheckCircle } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';

// Mock data - replace with real data from your API
const orderDetails = {
  'ORD-001': {
    id: 'ORD-001',
    type: 'Business Cards',
    quantity: 500,
    status: 'completed',
    orderDate: '2024-01-15',
    deliveryDate: '2024-01-18',
    completedDate: '2024-01-18',
    total: '$125.00',
    description: 'Premium matte finish business cards with logo',
    specifications: {
      size: '3.5" x 2"',
      material: 'Premium cardstock',
      finish: 'Matte',
      colors: 'Full color (CMYK)',
      sides: 'Double-sided'
    },
    files: [
      { name: 'business-card-front.pdf', size: '2.1 MB', type: 'Design File' },
      { name: 'business-card-back.pdf', size: '1.8 MB', type: 'Design File' }
    ],
    timeline: [
      { status: 'Order Placed', date: '2024-01-15 10:30 AM', completed: true },
      { status: 'Design Approved', date: '2024-01-15 2:15 PM', completed: true },
      { status: 'Printing Started', date: '2024-01-16 9:00 AM', completed: true },
      { status: 'Quality Check', date: '2024-01-17 3:30 PM', completed: true },
      { status: 'Completed', date: '2024-01-18 11:45 AM', completed: true }
    ]
  }
};

export default function OrderDetail() {
  const { orderId } = useParams<{ orderId: string }>();
  const order = orderId ? orderDetails[orderId as keyof typeof orderDetails] : null;

  if (!order) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Order Not Found</h2>
        <p className="text-gray-600 mb-6">The order you're looking for doesn't exist.</p>
        <Link to="/orders">
          <Button variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Orders
          </Button>
        </Link>
      </div>
    );
  }

  const statusColors = {
    pending: 'warning',
    design_review: 'info',
    printing: 'info',
    completed: 'success',
    cancelled: 'error'
  } as const;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link to="/orders">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{order.id}</h1>
            <p className="text-sm text-gray-500">Order Details</p>
          </div>
          <Badge variant={statusColors[order.status]}>
            {order.status.replace('_', ' ')}
          </Badge>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline">
            <MessageCircle className="h-4 w-4 mr-2" />
            Contact Support
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Download Files
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Information */}
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
              <Package className="h-5 w-5 mr-2" />
              Order Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Product Details</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Product:</span>
                    <span className="font-medium">{order.type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Quantity:</span>
                    <span className="font-medium">{order.quantity} units</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total:</span>
                    <span className="font-medium">{order.total}</span>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Important Dates</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Order Date:</span>
                    <span className="font-medium">{order.orderDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Due Date:</span>
                    <span className="font-medium">{order.deliveryDate}</span>
                  </div>
                  {order.completedDate && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Completed:</span>
                      <span className="font-medium text-emerald-600">{order.completedDate}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h4 className="font-medium text-gray-900 mb-3">Description</h4>
              <p className="text-gray-600">{order.description}</p>
            </div>
          </Card>

          {/* Specifications */}
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
              <FileText className="h-5 w-5 mr-2" />
              Specifications
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(order.specifications).map(([key, value]) => (
                <div key={key} className="flex justify-between py-2 border-b border-gray-100 last:border-b-0">
                  <span className="text-gray-600 capitalize">{key.replace(/([A-Z])/g, ' $1')}:</span>
                  <span className="font-medium">{value}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Files */}
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Design Files</h3>
            <div className="space-y-3">
              {order.files.map((file, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <FileText className="h-5 w-5 text-gray-400 mr-3" />
                    <div>
                      <p className="font-medium text-gray-900">{file.name}</p>
                      <p className="text-sm text-gray-500">{file.type} • {file.size}</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Order Progress */}
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
              <Calendar className="h-5 w-5 mr-2" />
              Order Progress
            </h3>
            <div className="space-y-4">
              {order.timeline.map((item, index) => (
                <div key={index} className="flex items-start">
                  <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center ${
                    item.completed ? 'bg-emerald-500' : 'bg-gray-300'
                  }`}>
                    {item.completed && <CheckCircle className="h-4 w-4 text-white" />}
                  </div>
                  <div className="ml-4 flex-1">
                    <p className={`text-sm font-medium ${
                      item.completed ? 'text-gray-900' : 'text-gray-500'
                    }`}>
                      {item.status}
                    </p>
                    <p className="text-xs text-gray-500">{item.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Quick Actions */}
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <Button variant="outline" className="w-full justify-start">
                <MessageCircle className="h-4 w-4 mr-2" />
                Contact Support
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Download className="h-4 w-4 mr-2" />
                Download Invoice
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Package className="h-4 w-4 mr-2" />
                Reorder
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}