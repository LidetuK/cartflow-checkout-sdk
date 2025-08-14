import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { XCircle, RefreshCw, ArrowLeft, AlertTriangle, AlertCircle, Clock, User } from 'lucide-react';

interface FailureData {
  order_id: string;
  amount: string;
  error_code: string;
  error_message: string;
  customer_name?: string;
  email_id?: string;
  mobile_no?: string;
}

const Failure = () => {
  const [failureData, setFailureData] = useState<FailureData | null>(null);
  const [loading, setLoading] = useState(true);

  // Get failure details from URL params
  const urlParams = new URLSearchParams(window.location.search);
  
  useEffect(() => {
    // Extract data from URL parameters
    const data: FailureData = {
      order_id: urlParams.get('order_id') || `ORD-${Date.now()}`,
      amount: urlParams.get('amount') || '0.00',
      error_code: urlParams.get('error_code') || 'PAYMENT_FAILED',
      error_message: urlParams.get('error_message') || 'Payment could not be completed',
      customer_name: urlParams.get('customer_name') || undefined,
      email_id: urlParams.get('email_id') || undefined,
      mobile_no: urlParams.get('mobile_no') || undefined,
    };
    
    setFailureData(data);
    setLoading(false);
  }, []);

  const getErrorIcon = (errorCode: string) => {
    switch (errorCode.toLowerCase()) {
      case 'insufficient_funds':
        return <AlertCircle className="w-6 h-6 text-orange-500" />;
      case 'invalid_card':
        return <XCircle className="w-6 h-6 text-red-500" />;
      case 'network_error':
        return <AlertTriangle className="w-6 h-6 text-yellow-500" />;
      default:
        return <XCircle className="w-6 h-6 text-red-500" />;
    }
  };

  const getErrorColor = (errorCode: string) => {
    switch (errorCode.toLowerCase()) {
      case 'insufficient_funds':
        return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'invalid_card':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'network_error':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      default:
        return 'text-red-600 bg-red-50 border-red-200';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-100 flex items-center justify-center p-4">
        <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm max-w-2xl w-full">
          <CardContent className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
            <p className="text-red-600 font-medium">Processing payment status...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-100 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute top-10 left-10 animate-pulse">
        <AlertTriangle className="w-6 h-6 text-red-400" />
      </div>
      <div className="absolute top-20 right-20 animate-pulse delay-100">
        <XCircle className="w-6 h-6 text-orange-400" />
      </div>
      <div className="absolute bottom-20 left-20 animate-pulse delay-200">
        <AlertCircle className="w-6 h-6 text-red-400" />
      </div>

      <div className="max-w-2xl w-full">
        <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm animate-fade-in">
          <CardHeader className="text-center pb-6">
            <div className="mx-auto w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-4 animate-pulse">
              <XCircle className="w-10 h-10 text-red-600" />
            </div>
            <CardTitle className="text-3xl font-bold text-red-800 mb-2 animate-slide-up">
              Payment Failed
            </CardTitle>
            <p className="text-red-600 animate-slide-up delay-100">
              We couldn't process your payment through YagoutPay
            </p>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {failureData && (
              <>
                {/* Error Details */}
                <div className={`rounded-lg p-6 border animate-slide-up delay-200 ${getErrorColor(failureData.error_code)}`}>
                  <div className="flex items-center gap-2 mb-4">
                    {getErrorIcon(failureData.error_code)}
                    <h3 className="font-semibold">Error Details</h3>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm opacity-80">Order ID:</span>
                      <span className="font-mono font-medium">{failureData.order_id}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm opacity-80">Amount:</span>
                      <span className="font-bold">{failureData.amount} ETB</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm opacity-80">Error Code:</span>
                      <Badge variant="destructive" className="text-xs">
                        {failureData.error_code}
                      </Badge>
                    </div>
                    <div className="pt-2">
                      <span className="text-sm opacity-80">Message:</span>
                      <p className="font-medium mt-1">{failureData.error_message}</p>
                    </div>
                  </div>
                </div>

                {/* Customer Information (if available) */}
                {(failureData.customer_name || failureData.email_id || failureData.mobile_no) && (
                  <div className="bg-gradient-to-r from-gray-50 to-slate-50 rounded-lg p-6 border border-gray-200 animate-slide-up delay-300">
                    <div className="flex items-center gap-2 mb-4">
                      <User className="w-5 h-5 text-gray-600" />
                      <h3 className="font-semibold text-gray-800">Customer Information</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {failureData.customer_name && (
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-600">Name:</span>
                          <span className="font-medium">{failureData.customer_name}</span>
                        </div>
                      )}
                      {failureData.email_id && (
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-600">Email:</span>
                          <span className="font-medium">{failureData.email_id}</span>
                        </div>
                      )}
                      {failureData.mobile_no && (
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-600">Phone:</span>
                          <span className="font-medium">{failureData.mobile_no}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Common Solutions */}
                <div className="flex items-start gap-3 p-4 bg-yellow-50 rounded-lg border border-yellow-200 animate-slide-up delay-400">
                  <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-yellow-800">
                    <p className="font-medium mb-2">What you can try:</p>
                    <ul className="space-y-1 text-xs">
                      <li>• Check your mobile wallet balance</li>
                      <li>• Ensure your phone number is correct</li>
                      <li>• Try a different payment method</li>
                      <li>• Contact your bank if using CBE Birr</li>
                      <li>• Verify your internet connection</li>
                    </ul>
                  </div>
                </div>

                {/* Payment Status */}
                <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg border border-blue-200 animate-slide-up delay-500">
                  <Clock className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-blue-800">
                    <p className="font-medium mb-1">Payment Status</p>
                    <p>Your payment attempt was unsuccessful. No charges were made to your account.</p>
                  </div>
                </div>
              </>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4 animate-slide-up delay-600">
              <Button asChild className="flex-1 bg-red-600 hover:bg-red-700">
                <Link to="/">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Shop
                </Link>
              </Button>
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => window.history.back()}
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Try Again
              </Button>
            </div>

            {/* Support Information */}
            <div className="text-center pt-6 border-t border-gray-200 animate-slide-up delay-700">
              <p className="text-xs text-gray-500 mb-2">
                Need help? Contact our support team
              </p>
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
        .delay-700 { animation-delay: 0.7s; }
      `}</style>
    </div>
  );
};

export default Failure;


