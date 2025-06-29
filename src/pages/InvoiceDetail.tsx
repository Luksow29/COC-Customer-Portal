import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Download, MessageCircle, Calendar, CreditCard, FileText, CheckCircle } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';

// Mock data - replace with real data from your API
const invoiceDetails = {
  'INV-001': {
    id: 'INV-001',
    orderId: 'ORD-001',
    amount: '$125.00',
    status: 'paid',
    issueDate: '2024-01-15',
    dueDate: '2024-01-30',
    paidDate: '2024-01-18',
    description: 'Business Cards - Premium matte finish',
    customerInfo: {
      name: 'John Doe',
      email: 'john.doe@example.com',
      company: 'Acme Corp',
      address: '123 Business St, Suite 100\nBusiness City, BC 12345'
    },
    companyInfo: {
      name: 'PrintFlow',
      address: '456 Print Avenue\nPrint City, PC 67890',
      phone: '(555) 123-4567',
      email: 'billing@printflow.com'
    },
    items: [
      {
        description: 'Business Cards - Premium Matte',
        quantity: 500,
        unitPrice: 0.25,
        total: 125.00
      }
    ],
    subtotal: 125.00,
    tax: 0.00,
    total: 125.00,
    paymentMethod: 'Credit Card',
    paymentReference: 'ch_1234567890'
  },
  'INV-002': {
    id: 'INV-002',
    orderId: 'ORD-002',
    amount: '$89.50',
    status: 'pending',
    issueDate: '2024-01-14',
    dueDate: '2024-01-29',
    paidDate: null,
    description: 'Flyers - A4 color marketing campaign',
    customerInfo: {
      name: 'John Doe',
      email: 'john.doe@example.com',
      company: 'Acme Corp',
      address: '123 Business St, Suite 100\nBusiness City, BC 12345'
    },
    companyInfo: {
      name: 'PrintFlow',
      address: '456 Print Avenue\nPrint City, PC 67890',
      phone: '(555) 123-4567',
      email: 'billing@printflow.com'
    },
    items: [
      {
        description: 'Flyers - A4 Color',
        quantity: 1000,
        unitPrice: 0.0895,
        total: 89.50
      }
    ],
    subtotal: 89.50,
    tax: 0.00,
    total: 89.50,
    paymentMethod: null,
    paymentReference: null
  }
};

export default function InvoiceDetail() {
  const { invoiceId } = useParams<{ invoiceId: string }>();
  const invoice = invoiceId ? invoiceDetails[invoiceId as keyof typeof invoiceDetails] : null;

  if (!invoice) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Invoice Not Found</h2>
        <p className="text-gray-600 mb-6">The invoice you're looking for doesn't exist.</p>
        <Link to="/invoices">
          <Button variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Invoices
          </Button>
        </Link>
      </div>
    );
  }

  const statusColors = {
    paid: 'success',
    pending: 'warning',
    overdue: 'error',
    draft: 'info'
  } as const;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link to="/invoices">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{invoice.id}</h1>
            <p className="text-sm text-gray-500">Invoice Details</p>
          </div>
          <Badge variant={statusColors[invoice.status]}>
            {invoice.status}
          </Badge>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline">
            <MessageCircle className="h-4 w-4 mr-2" />
            Contact Support
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Download PDF
          </Button>
          {invoice.status === 'pending' && (
            <Button>
              <CreditCard className="h-4 w-4 mr-2" />
              Pay Now
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Invoice */}
        <div className="lg:col-span-2">
          <Card className="p-8">
            {/* Invoice Header */}
            <div className="flex justify-between items-start mb-8">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">{invoice.companyInfo.name}</h2>
                <div className="text-gray-600 whitespace-pre-line">
                  {invoice.companyInfo.address}
                </div>
                <div className="text-gray-600 mt-2">
                  <p>{invoice.companyInfo.phone}</p>
                  <p>{invoice.companyInfo.email}</p>
                </div>
              </div>
              <div className="text-right">
                <h1 className="text-4xl font-bold text-blue-600 mb-2">INVOICE</h1>
                <p className="text-lg font-semibold text-gray-900">{invoice.id}</p>
              </div>
            </div>

            {/* Invoice Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Bill To:</h3>
                <div className="text-gray-700">
                  <p className="font-medium">{invoice.customerInfo.name}</p>
                  {invoice.customerInfo.company && (
                    <p className="font-medium">{invoice.customerInfo.company}</p>
                  )}
                  <div className="whitespace-pre-line mt-1">
                    {invoice.customerInfo.address}
                  </div>
                  <p className="mt-1">{invoice.customerInfo.email}</p>
                </div>
              </div>
              <div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Invoice Date:</span>
                    <span className="font-medium">{invoice.issueDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Due Date:</span>
                    <span className="font-medium">{invoice.dueDate}</span>
                  </div>
                  {invoice.paidDate && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Paid Date:</span>
                      <span className="font-medium text-emerald-600">{invoice.paidDate}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-600">Related Order:</span>
                    <Link 
                      to={`/orders/${invoice.orderId}`}
                      className="font-medium text-blue-600 hover:text-blue-500"
                    >
                      {invoice.orderId}
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Invoice Items */}
            <div className="mb-8">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th className="py-3 text-left font-semibold text-gray-900">Description</th>
                    <th className="py-3 text-right font-semibold text-gray-900">Qty</th>
                    <th className="py-3 text-right font-semibold text-gray-900">Unit Price</th>
                    <th className="py-3 text-right font-semibold text-gray-900">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {invoice.items.map((item, index) => (
                    <tr key={index} className="border-b border-gray-100">
                      <td className="py-4 text-gray-700">{item.description}</td>
                      <td className="py-4 text-right text-gray-700">{item.quantity}</td>
                      <td className="py-4 text-right text-gray-700">${item.unitPrice.toFixed(2)}</td>
                      <td className="py-4 text-right font-medium text-gray-900">${item.total.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Invoice Totals */}
            <div className="flex justify-end">
              <div className="w-64">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal:</span>
                    <span className="font-medium">${invoice.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tax:</span>
                    <span className="font-medium">${invoice.tax.toFixed(2)}</span>
                  </div>
                  <div className="border-t border-gray-200 pt-2">
                    <div className="flex justify-between">
                      <span className="text-lg font-semibold text-gray-900">Total:</span>
                      <span className="text-lg font-bold text-gray-900">${invoice.total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Info */}
            {invoice.status === 'paid' && (
              <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="flex items-center text-emerald-600">
                  <CheckCircle className="h-5 w-5 mr-2" />
                  <span className="font-medium">Payment Received</span>
                </div>
                <div className="mt-2 text-sm text-gray-600">
                  <p>Payment Method: {invoice.paymentMethod}</p>
                  <p>Reference: {invoice.paymentReference}</p>
                </div>
              </div>
            )}
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Payment Status */}
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <CreditCard className="h-5 w-5 mr-2" />
              Payment Status
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Status:</span>
                <Badge variant={statusColors[invoice.status]}>
                  {invoice.status}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Amount:</span>
                <span className="font-semibold text-lg">{invoice.amount}</span>
              </div>
              {invoice.status === 'pending' && (
                <div className="pt-3">
                  <Button className="w-full">
                    <CreditCard className="h-4 w-4 mr-2" />
                    Pay Now
                  </Button>
                </div>
              )}
            </div>
          </Card>

          {/* Quick Actions */}
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <Button variant="outline" className="w-full justify-start">
                <Download className="h-4 w-4 mr-2" />
                Download PDF
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <MessageCircle className="h-4 w-4 mr-2" />
                Contact Support
              </Button>
              <Link to={`/orders/${invoice.orderId}`}>
                <Button variant="outline" className="w-full justify-start">
                  <FileText className="h-4 w-4 mr-2" />
                  View Order
                </Button>
              </Link>
            </div>
          </Card>

          {/* Invoice History */}
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Calendar className="h-5 w-5 mr-2" />
              Invoice History
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Created:</span>
                <span>{invoice.issueDate}</span>
              </div>
              {invoice.paidDate && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Paid:</span>
                  <span className="text-emerald-600">{invoice.paidDate}</span>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}