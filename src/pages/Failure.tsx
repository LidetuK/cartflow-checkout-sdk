import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { XCircle, RefreshCw, ArrowLeft, AlertTriangle } from 'lucide-react';

const Failure = () => {
  // Get failure details from URL params
  const urlParams = new URLSearchParams(window.location.search);
  const orderId = urlParams.get('order_id') || `ORD-${Date.now()}`;
  const amount = urlParams.get('amount') || '1.10';
  const errorCode = urlParams.get('error_code') || 'PAYMENT_FAILED';
  const errorMessage = urlParams.get('error_message') || 'Payment could not be completed';

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-100 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
          <CardHeader className="text-center pb-6">
            <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <XCircle className="w-8 h-8 text-red-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-red-800 mb-2">
              Payment Failed
            </CardTitle>
            <p className="text-red-600">
              We couldn't process your payment through YagoutPay
            </p>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Error Details */}
            <div className="bg-red-50 rounded-lg p-4 border border-red-200">
              <h3 className="font-semibold text-red-800 mb-3">Error Details</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-red-600">Order ID:</span>
                  <span className="font-mono font-medium">{orderId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-red-600">Amount:</span>
                  <span className="font-bold">{amount} ETB</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-red-600">Error Code:</span>
                  <Badge variant="destructive" className="text-xs">
                    {errorCode}
                  </Badge>
                </div>
                <div className="pt-2">
                  <span className="text-red-600">Message:</span>
                  <p className="text-red-700 font-medium mt-1">{errorMessage}</p>
                </div>
              </div>
            </div>

            {/* Common Solutions */}
            <div className="flex items-start gap-3 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-yellow-800">
                <p className="font-medium mb-2">What you can try:</p>
                <ul className="space-y-1 text-xs">
                  <li>• Check your mobile wallet balance</li>
                  <li>• Ensure your phone number is correct</li>
                  <li>• Try a different payment method</li>
                  <li>• Contact your bank if using CBE Birr</li>
                </ul>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button asChild className="flex-1 bg-red-600 hover:bg-red-700">
                <Link to="/">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Shop
                </Link>
              </Button>
              <Button variant="outline" className="flex-1">
                <RefreshCw className="w-4 h-4 mr-2" />
                Try Again
              </Button>
            </div>

            {/* Support Information */}
            <div className="text-center pt-6 border-t border-gray-200">
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
    </div>
  );
};

export default Failure;


