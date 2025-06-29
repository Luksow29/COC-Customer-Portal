import React, { useState } from 'react';
import { MessageCircle, Phone, Mail, HelpCircle, FileText, Clock, CheckCircle } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

// Mock data for support tickets
const supportTickets = [
  {
    id: 'TKT-001',
    subject: 'Question about order delivery',
    status: 'open',
    priority: 'medium',
    createdAt: '2024-01-15',
    lastReply: '2024-01-16',
    orderId: 'ORD-001'
  },
  {
    id: 'TKT-002',
    subject: 'Issue with print quality',
    status: 'resolved',
    priority: 'high',
    createdAt: '2024-01-10',
    lastReply: '2024-01-12',
    orderId: 'ORD-003'
  }
];

const faqs = [
  {
    question: 'How long does it take to process my order?',
    answer: 'Most orders are processed within 1-2 business days. Rush orders can be completed within 24 hours for an additional fee.'
  },
  {
    question: 'What file formats do you accept?',
    answer: 'We accept PDF, AI, EPS, PSD, and high-resolution JPG/PNG files. PDF is preferred for best results.'
  },
  {
    question: 'Can I cancel or modify my order?',
    answer: 'Orders can be cancelled or modified within 2 hours of placement. After that, please contact our support team.'
  },
  {
    question: 'Do you offer rush delivery?',
    answer: 'Yes, we offer same-day and next-day delivery options. Additional charges apply based on your location.'
  },
  {
    question: 'What payment methods do you accept?',
    answer: 'We accept all major credit cards, PayPal, and bank transfers for corporate accounts.'
  }
];

export default function Support() {
  const [contactForm, setContactForm] = useState({
    subject: '',
    orderId: '',
    priority: 'medium',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const handleContactChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setContactForm(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmitContact = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsSubmitting(false);
    setContactForm({
      subject: '',
      orderId: '',
      priority: 'medium',
      message: ''
    });
    
    alert('Support ticket created successfully! We\'ll get back to you soon.');
  };

  const statusColors = {
    open: 'warning',
    in_progress: 'info',
    resolved: 'success',
    closed: 'default'
  } as const;

  const priorityColors = {
    low: 'info',
    medium: 'warning',
    high: 'error'
  } as const;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Support Center</h1>
        <p className="mt-1 text-sm text-gray-500">
          Get help with your orders and account
        </p>
      </div>

      {/* Contact Options */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="text-center hover:shadow-md transition-shadow cursor-pointer">
          <div className="p-2 bg-blue-50 rounded-lg w-fit mx-auto mb-4">
            <MessageCircle className="h-8 w-8 text-blue-600" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">Live Chat</h3>
          <p className="text-sm text-gray-600 mb-4">Chat with our support team in real-time</p>
          <Button variant="outline" size="sm" className="w-full">
            Start Chat
          </Button>
        </Card>

        <Card className="text-center hover:shadow-md transition-shadow cursor-pointer">
          <div className="p-2 bg-emerald-50 rounded-lg w-fit mx-auto mb-4">
            <Phone className="h-8 w-8 text-emerald-600" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">Phone Support</h3>
          <p className="text-sm text-gray-600 mb-2">(555) 123-4567</p>
          <p className="text-xs text-gray-500 mb-4">Mon-Fri, 9AM-6PM EST</p>
          <Button variant="outline" size="sm" className="w-full">
            Call Now
          </Button>
        </Card>

        <Card className="text-center hover:shadow-md transition-shadow cursor-pointer">
          <div className="p-2 bg-purple-50 rounded-lg w-fit mx-auto mb-4">
            <Mail className="h-8 w-8 text-purple-600" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">Email Support</h3>
          <p className="text-sm text-gray-600 mb-4">support@printflow.com</p>
          <Button variant="outline" size="sm" className="w-full">
            Send Email
          </Button>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Contact Form */}
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Create Support Ticket</h3>
          <form onSubmit={handleSubmitContact} className="space-y-4">
            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                Subject
              </label>
              <Input
                id="subject"
                name="subject"
                type="text"
                required
                value={contactForm.subject}
                onChange={handleContactChange}
                placeholder="Brief description of your issue"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="orderId" className="block text-sm font-medium text-gray-700 mb-2">
                  Related Order (optional)
                </label>
                <Input
                  id="orderId"
                  name="orderId"
                  type="text"
                  value={contactForm.orderId}
                  onChange={handleContactChange}
                  placeholder="e.g., ORD-001"
                />
              </div>
              <div>
                <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-2">
                  Priority
                </label>
                <select
                  id="priority"
                  name="priority"
                  value={contactForm.priority}
                  onChange={handleContactChange}
                  className="block w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                rows={5}
                required
                value={contactForm.message}
                onChange={handleContactChange}
                placeholder="Please describe your issue in detail..."
                className="block w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <Button
              type="submit"
              loading={isSubmitting}
              className="w-full"
            >
              Submit Ticket
            </Button>
          </form>
        </Card>

        {/* Support Tickets */}
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Your Support Tickets</h3>
          <div className="space-y-4">
            {supportTickets.map((ticket) => (
              <div key={ticket.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900">{ticket.id}</h4>
                  <div className="flex space-x-2">
                    <span className={`
                      px-2 py-1 text-xs font-medium rounded-full
                      ${ticket.status === 'open' ? 'bg-amber-100 text-amber-800' : 
                        ticket.status === 'resolved' ? 'bg-emerald-100 text-emerald-800' : 
                        'bg-gray-100 text-gray-800'}
                    `}>
                      {ticket.status}
                    </span>
                    <span className={`
                      px-2 py-1 text-xs font-medium rounded-full
                      ${ticket.priority === 'high' ? 'bg-red-100 text-red-800' :
                        ticket.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-blue-100 text-blue-800'}
                    `}>
                      {ticket.priority}
                    </span>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-3">{ticket.subject}</p>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>Created: {ticket.createdAt}</span>
                  <span>Last reply: {ticket.lastReply}</span>
                </div>
                {ticket.orderId && (
                  <div className="mt-2">
                    <span className="text-xs text-blue-600">Related order: {ticket.orderId}</span>
                  </div>
                )}
              </div>
            ))}
            {supportTickets.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No support tickets found</p>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* FAQ Section */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
          <HelpCircle className="h-5 w-5 mr-2" />
          Frequently Asked Questions
        </h3>
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="border border-gray-200 rounded-lg">
              <button
                onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                className="w-full px-4 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <span className="font-medium text-gray-900">{faq.question}</span>
                <span className="ml-2 flex-shrink-0">
                  {expandedFaq === index ? '−' : '+'}
                </span>
              </button>
              {expandedFaq === index && (
                <div className="px-4 pb-4 border-t border-gray-200">
                  <p className="text-gray-600 mt-3">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </Card>

      {/* Help Resources */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <FileText className="h-5 w-5 mr-2" />
            Help Resources
          </h3>
          <div className="space-y-3">
            <a href="#" className="block p-3 rounded-lg hover:bg-gray-50 transition-colors">
              <h4 className="font-medium text-gray-900">File Preparation Guide</h4>
              <p className="text-sm text-gray-600">Learn how to prepare your files for printing</p>
            </a>
            <a href="#" className="block p-3 rounded-lg hover:bg-gray-50 transition-colors">
              <h4 className="font-medium text-gray-900">Ordering Guide</h4>
              <p className="text-sm text-gray-600">Step-by-step guide to placing orders</p>
            </a>
            <a href="#" className="block p-3 rounded-lg hover:bg-gray-50 transition-colors">
              <h4 className="font-medium text-gray-900">Pricing Information</h4>
              <p className="text-sm text-gray-600">Understand our pricing structure</p>
            </a>
          </div>
        </Card>

        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Clock className="h-5 w-5 mr-2" />
            Support Hours
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Monday - Friday:</span>
              <span className="font-medium">9:00 AM - 6:00 PM EST</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Saturday:</span>
              <span className="font-medium">10:00 AM - 4:00 PM EST</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Sunday:</span>
              <span className="font-medium">Closed</span>
            </div>
            <div className="pt-3 border-t border-gray-200">
              <div className="flex items-center text-emerald-600">
                <CheckCircle className="h-4 w-4 mr-2" />
                <span className="text-sm font-medium">We're currently online</span>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}