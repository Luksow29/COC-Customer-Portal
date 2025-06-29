import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, Download, Eye, FileText } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Badge from '../components/ui/Badge';

// Mock data - replace with real data from your API
const invoices = [
  {
    id: 'INV-001',
    orderId: 'ORD-001',
    amount: '$125.00',
    status: 'paid',
    issueDate: '2024-01-15',
    dueDate: '2024-01-30',
    paidDate: '2024-01-18',
    description: 'Business Cards - Premium matte finish'
  },
  {
    id: 'INV-002',
    orderId: 'ORD-002',
    amount: '$89.50',
    status: 'pending',
    issueDate: '2024-01-14',
    dueDate: '2024-01-29',
    paidDate: null,
    description: 'Flyers - A4 color marketing campaign'
  },
  {
    id: 'INV-003',
    orderId: 'ORD-003',
    amount: '$245.00',
    status: 'overdue',
    issueDate: '2024-01-10',
    dueDate: '2024-01-25',
    paidDate: null,
    description: 'Banners - Large outdoor weather-resistant'
  },
  {
    id: 'INV-004',
    orderId: 'ORD-004',
    amount: '$67.25',
    status: 'draft',
    issueDate: '2024-01-12',
    dueDate: '2024-01-27',
    paidDate: null,
    description: 'Brochures - Tri-fold custom design'
  },
  {
    id: 'INV-005',
    orderId: 'ORD-005',
    amount: '$156.00',
    status: 'paid',
    issueDate: '2024-01-08',
    dueDate: '2024-01-23',
    paidDate: '2024-01-12',
    description: 'Posters - A1 high-quality event promotion'
  }
];

const statusColors = {
  paid: 'success',
  pending: 'warning',
  overdue: 'error',
  draft: 'info'
} as const;

export default function Invoices() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch = invoice.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         invoice.orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         invoice.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || invoice.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totals = {
    total: invoices.reduce((sum, inv) => sum + parseFloat(inv.amount.replace('$', '')), 0),
    paid: invoices.filter(inv => inv.status === 'paid').reduce((sum, inv) => sum + parseFloat(inv.amount.replace('$', '')), 0),
    pending: invoices.filter(inv => inv.status === 'pending' || inv.status === 'overdue').reduce((sum, inv) => sum + parseFloat(inv.amount.replace('$', '')), 0)
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Invoices</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your billing and payment history
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export All
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <div className="flex items-center">
            <div className="p-2 bg-blue-50 rounded-lg">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Invoiced</p>
              <p className="text-2xl font-semibold text-gray-900">${totals.total.toFixed(2)}</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center">
            <div className="p-2 bg-emerald-50 rounded-lg">
              <FileText className="h-6 w-6 text-emerald-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Paid</p>
              <p className="text-2xl font-semibold text-emerald-600">${totals.paid.toFixed(2)}</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center">
            <div className="p-2 bg-amber-50 rounded-lg">
              <FileText className="h-6 w-6 text-amber-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Outstanding</p>
              <p className="text-2xl font-semibold text-amber-600">${totals.pending.toFixed(2)}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
          <div className="flex-1">
            <Input
              type="text"
              placeholder="Search invoices..."
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
              <option value="paid">Paid</option>
              <option value="pending">Pending</option>
              <option value="overdue">Overdue</option>
              <option value="draft">Draft</option>
            </select>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              More Filters
            </Button>
          </div>
        </div>
      </Card>

      {/* Invoices List */}
      <div className="space-y-4">
        {filteredInvoices.map((invoice) => (
          <Card key={invoice.id} hover>
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-4 mb-3">
                  <h3 className="text-lg font-semibold text-gray-900">{invoice.id}</h3>
                  <Badge variant={statusColors[invoice.status]}>
                    {invoice.status}
                  </Badge>
                  <Link 
                    to={`/orders/${invoice.orderId}`}
                    className="text-sm text-blue-600 hover:text-blue-500"
                  >
                    {invoice.orderId}
                  </Link>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-600">Amount</p>
                    <p className="font-semibold text-gray-900 text-lg">{invoice.amount}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Issue Date</p>
                    <p className="font-medium text-gray-900">{invoice.issueDate}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Due Date</p>
                    <p className={`font-medium ${
                      invoice.status === 'overdue' ? 'text-red-600' : 'text-gray-900'
                    }`}>
                      {invoice.dueDate}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Paid Date</p>
                    <p className="font-medium text-gray-900">
                      {invoice.paidDate || '-'}
                    </p>
                  </div>
                </div>
                
                <p className="text-sm text-gray-600">{invoice.description}</p>
              </div>
              
              <div className="flex items-center space-x-2 ml-4">
                <Link to={`/invoices/${invoice.id}`}>
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4 mr-2" />
                    View
                  </Button>
                </Link>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
                {invoice.status === 'pending' && (
                  <Button size="sm">
                    Pay Now
                  </Button>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {filteredInvoices.length === 0 && (
        <Card className="text-center py-12">
          <div className="text-gray-500">
            <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-medium mb-2">No invoices found</h3>
            <p className="text-sm">
              {searchQuery || statusFilter !== 'all' 
                ? 'Try adjusting your search or filters'
                : 'You don\'t have any invoices yet'
              }
            </p>
          </div>
        </Card>
      )}
    </div>
  );
}