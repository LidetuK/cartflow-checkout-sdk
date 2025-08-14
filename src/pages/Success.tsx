import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Download, ArrowLeft, Shield, Sparkles, Clock, User, Mail, Phone } from 'lucide-react';

interface TransactionData {
  order_no: string;
  amount: string;
  customer_name: string;
  email_id: string;
  mobile_no: string;
  transaction_id: string;
  date_time: string;
  status: string;
}

const Success = () => {
  const [transactionData, setTransactionData] = useState<TransactionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);

  // Get order number from URL params
  const urlParams = new URLSearchParams(window.location.search);
  const orderNo = urlParams.get('order_no') || urlParams.get('order_id') || `ORD-${Date.now()}`;

  useEffect(() => {
    fetchTransactionDetails();
    // Trigger confetti animation
    setTimeout(() => setShowConfetti(true), 500);
  }, []);

  const fetchTransactionDetails = async () => {
    try {
      const apiBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';
      const response = await fetch(`${apiBase}/payments/transaction/${orderNo}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setTransactionData({
          order_no: data.order_no || orderNo,
          amount: data.amount || '0.00',
          customer_name: data.customer_name || 'N/A',
          email_id: data.email_id || 'N/A',
          mobile_no: data.mobile_no || 'N/A',
          transaction_id: data.transaction_id || `TXN-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
          date_time: data.date_time || new Date().toLocaleString(),
          status: data.status || 'success'
        });
      } else {
        // Fallback to URL parameters
        setTransactionData({
          order_no: orderNo,
          amount: urlParams.get('amount') || '0.00',
          customer_name: urlParams.get('customer_name') || 'N/A',
          email_id: urlParams.get('email_id') || 'N/A',
          mobile_no: urlParams.get('mobile_no') || 'N/A',
          transaction_id: urlParams.get('txn_id') || urlParams.get('transaction_id') || `TXN-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
          date_time: urlParams.get('date_time') || new Date().toLocaleString(),
          status: 'success'
        });
      }
    } catch (err) {
      console.error('Error fetching transaction details:', err);
      setError('Unable to load transaction details');
      // Still show basic data from URL
      setTransactionData({
        order_no: orderNo,
        amount: urlParams.get('amount') || '0.00',
        customer_name: urlParams.get('customer_name') || 'N/A',
        email_id: urlParams.get('email_id') || 'N/A',
        mobile_no: urlParams.get('mobile_no') || 'N/A',
        transaction_id: urlParams.get('txn_id') || urlParams.get('transaction_id') || `TXN-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
        date_time: urlParams.get('date_time') || new Date().toLocaleString(),
        status: 'success'
      });
    } finally {
      setLoading(false);
    }
  };

  const downloadReceipt = () => {
    if (!transactionData) return;
    
    const receiptContent = `
Payment Receipt
================

Order Details:
- Order No: ${transactionData.order_no}
- Transaction ID: ${transactionData.transaction_id}
- Amount: ${transactionData.amount} ETB
- Date: ${transactionData.date_time}
- Status: Successful

Customer Information:
- Name: ${transactionData.customer_name}
- Email: ${transactionData.email_id}
- Phone: ${transactionData.mobile_no}

Payment Method: YagoutPay (Mobile Wallet)
Processed by: YagoutPay Financial Technology S.C.

Thank you for your purchase!
    `;
    
    const blob = new Blob([receiptContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `receipt-${transactionData.order_no}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
        <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm max-w-2xl w-full">
          <CardContent className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
            <p className="text-green-600 font-medium">Processing your payment...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background Elements */}
      {showConfetti && (
        <>
          <div className="absolute top-10 left-10 animate-bounce">
            <Sparkles className="w-6 h-6 text-yellow-400" />
          </div>
          <div className="absolute top-20 right-20 animate-bounce delay-100">
            <Sparkles className="w-6 h-6 text-green-400" />
          </div>
          <div className="absolute bottom-20 left-20 animate-bounce delay-200">
            <Sparkles className="w-6 h-6 text-blue-400" />
          </div>
          <div className="absolute bottom-10 right-10 animate-bounce delay-300">
            <Sparkles className="w-6 h-6 text-purple-400" />
          </div>
        </>
      )}

      <div className="max-w-2xl w-full">
        <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm animate-fade-in">
          <CardHeader className="text-center pb-6">
            <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4 animate-pulse">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <CardTitle className="text-3xl font-bold text-green-800 mb-2 animate-slide-up">
              Payment Successful!
            </CardTitle>
            <p className="text-green-600 animate-slide-up delay-100">
              Your payment has been processed successfully through YagoutPay
            </p>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {error && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-yellow-800 text-sm">{error}</p>
              </div>
            )}

            {transactionData && (
              <>
                {/* Customer Information */}
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-6 border border-green-200 animate-slide-up delay-200">
                  <div className="flex items-center gap-2 mb-4">
                    <User className="w-5 h-5 text-green-600" />
                    <h3 className="font-semibold text-green-800">Customer Information</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-green-600" />
                      <span className="text-sm text-gray-600">Email:</span>
                      <span className="font-medium">{transactionData.email_id}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-green-600" />
                      <span className="text-sm text-gray-600">Phone:</span>
                      <span className="font-medium">{transactionData.mobile_no}</span>
                    </div>
                  </div>
                </div>

                {/* Order Summary */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-200 animate-slide-up delay-300">
                  <div className="flex items-center gap-2 mb-4">
                    <Clock className="w-5 h-5 text-blue-600" />
                    <h3 className="font-semibold text-blue-800">Order Summary</h3>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Order ID:</span>
                      <span className="font-mono font-medium text-blue-800">{transactionData.order_no}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Transaction ID:</span>
                      <span className="font-mono font-medium text-blue-800">{transactionData.transaction_id}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Amount Paid:</span>
                      <span className="font-bold text-xl text-green-600">{transactionData.amount} ETB</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Payment Method:</span>
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        Mobile Wallet
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Date & Time:</span>
                      <span className="text-sm text-gray-700">{transactionData.date_time}</span>
                    </div>
                  </div>
                </div>

                {/* Security Notice */}
                <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg border border-blue-200 animate-slide-up delay-400">
                  <Shield className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-blue-800">
                    <p className="font-medium mb-1">Secure Payment Confirmed</p>
                    <p>Your transaction was processed securely through YagoutPay's encrypted payment gateway.</p>
                  </div>
                </div>
              </>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4 animate-slide-up delay-500">
              <Button asChild className="flex-1 bg-green-600 hover:bg-green-700">
                <Link to="/">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Continue Shopping
                </Link>
              </Button>
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={downloadReceipt}
              >
                <Download className="w-4 h-4 mr-2" />
                Download Receipt
              </Button>
            </div>

            {/* Powered by YagoutPay */}
            <div className="text-center pt-6 border-t border-gray-200 animate-slide-up delay-600">
              <p className="text-xs text-gray-500">
                Powered by <span className="font-medium text-blue-600">YagoutPay</span>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }
        
        .animate-slide-up {
          animation: slide-up 0.6s ease-out forwards;
          opacity: 0;
        }
        
        .delay-100 { animation-delay: 0.1s; }
        .delay-200 { animation-delay: 0.2s; }
        .delay-300 { animation-delay: 0.3s; }
        .delay-400 { animation-delay: 0.4s; }
        .delay-500 { animation-delay: 0.5s; }
        .delay-600 { animation-delay: 0.6s; }
      `}</style>
    </div>
  );
};

export default Success;


