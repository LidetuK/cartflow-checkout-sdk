import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckoutData, CartItem } from '@/types/product';
import { CheckCircle, Package, Download, ArrowLeft } from 'lucide-react';

interface OrderSuccessProps {
  orderData: CheckoutData;
  items: CartItem[];
  total: number;
  orderId: string;
  onBackToShop: () => void;
}

export const OrderSuccess = ({ orderData, items, total, orderId, onBackToShop }: OrderSuccessProps) => {
  return (
    <div className="max-w-3xl mx-auto p-6">
      <Card className="bg-gradient-surface border-none shadow-elevated">
        <CardHeader className="text-center pb-6">
          <div className="mx-auto w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="w-8 h-8 text-success" />
          </div>
          <CardTitle className="text-2xl text-success">Order Confirmed!</CardTitle>
          <p className="text-muted-foreground">
            Thank you for your purchase. Your order has been successfully processed.
          </p>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Order Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Package className="w-4 h-4" />
                Order Details
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Order ID:</span>
                  <span className="font-mono">{orderId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Date:</span>
                  <span>{new Date().toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Payment Method:</span>
                  <span className="capitalize">{orderData.paymentMethod}</span>
                </div>
                <div className="flex justify-between font-semibold">
                  <span>Total:</span>
                  <span>${(total * 1.1).toFixed(2)}</span>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold mb-3">Shipping Address</h3>
              <div className="text-sm text-muted-foreground space-y-1">
                <p>{orderData.firstName} {orderData.lastName}</p>
                <p>{orderData.address}</p>
                <p>{orderData.city}, {orderData.postalCode}</p>
                <p className="uppercase">{orderData.country}</p>
              </div>
            </div>
          </div>
          
          {/* Order Items */}
          <div>
            <h3 className="font-semibold mb-3">Items Ordered</h3>
            <div className="space-y-3">
              {items.map((item) => (
                <div key={item.product.id} className="flex items-center gap-4 p-3 bg-muted/30 rounded-lg">
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-12 h-12 object-cover rounded"
                  />
                  <div className="flex-1">
                    <p className="font-medium">{item.product.name}</p>
                    <p className="text-sm text-muted-foreground">Quantity: {item.quantity}</p>
                  </div>
                  <p className="font-semibold">${(item.product.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
            </div>
          </div>
          
          {/* Next Steps */}
          <div className="bg-accent/50 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">What's Next?</h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• You'll receive an email confirmation shortly</li>
              <li>• Your order will be processed within 1-2 business days</li>
              <li>• Shipping typically takes 3-5 business days</li>
              <li>• You'll receive tracking information once shipped</li>
            </ul>
          </div>
          
          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button variant="gradient" className="flex-1">
              <Download className="w-4 h-4 mr-2" />
              Download Receipt
            </Button>
            <Button variant="outline" onClick={onBackToShop} className="flex-1">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Continue Shopping
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};