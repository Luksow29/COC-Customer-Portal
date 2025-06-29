import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Download, MessageCircle, Calendar, CreditCard, FileText, CheckCircle } from 'lucide-react';
import { supabase, Payment } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';

export default function InvoiceDetail() {
  const { invoiceId } = useParams<{ invoiceId: string }>();
  const { user } = useAuth();
  const [invoice, setInvoice] = useState<Payment | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && invoiceId) {
      fetchInvoice();
    }
  }, [user, invoiceId]);

  const fetchInvoice = async () => {
    if (!user || !invoiceId) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('payments')
        .select('*')
        .eq('id', invoiceId)
        .eq('customer_id', user.id)
        .single();

      if (error) throw error;

      setInvoice(data);
    } catch (error) {
      console.error('Error fetching invoice:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case 'paid':
        return 'success';
      case 'partial':
        return 'info';
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

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
            <h1 className="text-2xl font-bold text-gray-900">INV-{invoice.id.slice(-6)}</h1>
            <p className="text-sm text-gray-500">Invoice Details</p>
          </div>
          <Badge variant={getStatusBadgeVariant(invoice.status)}>
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
          {invoice.status !== 'Paid' && (
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
                <h2 className="text-3xl font-bold text-gray-900 mb-2">PrintFlow</h2>
                <div className="text-gray-600">
                  <p>456 Print Avenue</p>
                  <p>Print City, PC 67890</p>
                  <p className="mt-2">(555) 123-4567</p>
                  <p>billing@printflow.com</p>
                </div>
              </div>
              <div className="text-right">
                <h1 className="text-4xl font-bold text-blue-600 mb-2">INVOICE</h1>
                <p className="text-lg font-semibold text-gray-900">INV-{invoice.id.slice(-6)}</p>
              </div>
            </div>

            {/* Invoice Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Bill To:</h3>
                <div className="text-gray-700">
                  <p className="font-medium">{user?.name}</p>
                  {user?.company_name && (
                    <p className="font-medium">{user.company_name}</p>
                  )}
                  {user?.address && (
                    <div className="mt-1">
                      <p>{user.address}</p>
                    </div>
                  )}
                  <p className="mt-1">{user?.email}</p>
                  {user?.phone && <p>{user.phone}</p>}
                </div>
              </div>
              <div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Invoice Date:</span>
                    <span className="font-medium">
                      {invoice.created_at ? new Date(invoice.created_at).toLocaleDateString() : 'N/A'}
                    </span>
                  </div>
                  {invoice.due_date && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Due Date:</span>
                      <span className="font-medium">{new Date(invoice.due_date).toLocaleDateString()}</span>
                    </div>
                  )}
                  {invoice.payment_date && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Paid Date:</span>
                      <span className="font-medium text-emerald-600">
                        {new Date(invoice.payment_date).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                  {invoice.order_id && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Related Order:</span>
                      <Link 
                        to={`/orders/${invoice.order_id}`}
                        className="font-medium text-blue-600 hover:text-blue-500"
                      >
                        ORD-{invoice.order_id}
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Invoice Items */}
            <div className="mb-8">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th className="py-3 text-left font-semibold text-gray-900">Description</th>
                    <th className="py-3 text-right font-semibold text-gray-900">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-100">
                    <td className="py-4 text-gray-700">
                      {invoice.order_id ? `Order #${invoice.order_id}` : 'Print Services'}
                      {invoice.notes && (
                        <div className="text-sm text-gray-500 mt-1">{invoice.notes}</div>
                      )}
                    </td>
                    <td className="py-4 text-right font-medium text-gray-900">
                      {formatCurrency(invoice.total_amount)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Invoice Totals */}
            <div className="flex justify-end">
              <div className="w-64">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal:</span>
                    <span className="font-medium">{formatCurrency(invoice.total_amount)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tax:</span>
                    <span className="font-medium">$0.00</span>
                  </div>
                  <div className="border-t border-gray-200 pt-2">
                    <div className="flex justify-between">
                      <span className="text-lg font-semibold text-gray-900">Total:</span>
                      <span className="text-lg font-bold text-gray-900">
                        {formatCurrency(invoice.total_amount)}
                      </span>
                    </div>
                  </div>
                  {invoice.amount_paid > 0 && (
                    <div className="border-t border-gray-200 pt-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Amount Paid:</span>
                        <span className="font-medium text-emerald-600">
                          {formatCurrency(invoice.amount_paid)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Balance Due:</span>
                        <span className="font-medium text-red-600">
                          {formatCurrency(invoice.total_amount - invoice.amount_paid)}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Payment Info */}
            {invoice.status === 'Paid' && (
              <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="flex items-center text-emerald-600">
                  <CheckCircle className="h-5 w-5 mr-2" />
                  <span className="font-medium">Payment Received</span>
                </div>
                <div className="mt-2 text-sm text-gray-600">
                  {invoice.payment_method && <p>Payment Method: {invoice.payment_method}</p>}
                  {invoice.payment_date && (
                    <p>Payment Date: {new Date(invoice.payment_date).toLocaleDateString()}</p>
                  )}
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
                <Badge variant={getStatusBadgeVariant(invoice.status)}>
                  {invoice.status}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Amount:</span>
                <span className="font-semibold text-lg">{formatCurrency(invoice.total_amount)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Paid:</span>
                <span className="font-semibold text-emerald-600">{formatCurrency(invoice.amount_paid)}</span>
              </div>
              {invoice.total_amount > invoice.amount_paid && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Balance:</span>
                  <span className="font-semibold text-red-600">
                    {formatCurrency(invoice.total_amount - invoice.amount_paid)}
                  </span>
                </div>
              )}
              {invoice.status !== 'Paid' && (
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
              {invoice.order_id && (
                <Link to={`/orders/${invoice.order_id}`}>
                  <Button variant="outline" className="w-full justify-start">
                    <FileText className="h-4 w-4 mr-2" />
                    View Order
                  </Button>
                </Link>
              )}
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
                <span>
                  {invoice.created_at ? new Date(invoice.created_at).toLocaleDateString() : 'N/A'}
                </span>
              </div>
              {invoice.payment_date && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Paid:</span>
                  <span className="text-emerald-600">
                    {new Date(invoice.payment_date).toLocaleDateString()}
                  </span>
                </div>
              )}
              {invoice.updated_at && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Last Updated:</span>
                  <span>
                    {new Date(invoice.updated_at).toLocaleDateString()}
                  </span>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}