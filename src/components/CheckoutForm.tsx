import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { CheckoutData, CartItem } from '@/types/product';
import { CreditCard, Lock, Mail, User, MapPin, ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface CheckoutFormProps {
  items: CartItem[];
  total: number;
  onBack: () => void;
  onComplete: (data: CheckoutData) => void;
}

export const CheckoutForm = ({ items, total, onBack, onComplete }: CheckoutFormProps) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<CheckoutData>({
    email: '',
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    postalCode: '',
    country: '',
    paymentMethod: 'card',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const updateFormData = (field: keyof CheckoutData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateStep = (stepNumber: number) => {
    switch (stepNumber) {
      case 1:
        return formData.email && formData.firstName && formData.lastName;
      case 2:
        return formData.address && formData.city && formData.postalCode && formData.country;
      case 3:
        if (formData.paymentMethod === 'card') {
          return formData.cardNumber && formData.expiryDate && formData.cvv;
        }
        return true;
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setStep(step + 1);
    } else {
      toast({
        title: "Please fill in all required fields",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async () => {
    if (!validateStep(3)) {
      toast({
        title: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    onComplete(formData);
    setIsProcessing(false);
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    }
    return v;
  };

  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Button 
        variant="ghost" 
        onClick={onBack}
        className="mb-6"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Cart
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Order Summary */}
        <div className="lg:col-span-1">
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {items.map((item) => (
                <div key={item.product.id} className="flex justify-between items-start">
                  <div className="flex gap-3">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-12 h-12 object-cover rounded"
                    />
                    <div>
                      <p className="font-medium text-sm">{item.product.name}</p>
                      <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <p className="font-semibold">${(item.product.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
              
              <Separator />
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax</span>
                  <span>${(total * 0.1).toFixed(2)}</span>
                </div>
                <Separator />
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>${(total * 1.1).toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Checkout Form */}
        <div className="lg:col-span-2">
          <Card className="bg-gradient-surface border-none shadow-elevated">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Lock className="w-5 h-5 text-success" />
                  Secure Checkout
                </CardTitle>
                <div className="flex gap-2">
                  {[1, 2, 3].map((num) => (
                    <Badge
                      key={num}
                      variant={step >= num ? "default" : "secondary"}
                      className={step >= num ? "bg-primary" : ""}
                    >
                      {num}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {/* Step 1: Contact Information */}
              {step === 1 && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-4">
                    <Mail className="w-5 h-5 text-primary" />
                    <h3 className="text-lg font-semibold">Contact Information</h3>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => updateFormData('email', e.target.value)}
                        placeholder="your.email@example.com"
                        className="mt-1"
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="firstName">First Name *</Label>
                        <Input
                          id="firstName"
                          value={formData.firstName}
                          onChange={(e) => updateFormData('firstName', e.target.value)}
                          placeholder="John"
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="lastName">Last Name *</Label>
                        <Input
                          id="lastName"
                          value={formData.lastName}
                          onChange={(e) => updateFormData('lastName', e.target.value)}
                          placeholder="Doe"
                          className="mt-1"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Shipping Address */}
              {step === 2 && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-4">
                    <MapPin className="w-5 h-5 text-primary" />
                    <h3 className="text-lg font-semibold">Shipping Address</h3>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <Label htmlFor="address">Street Address *</Label>
                      <Input
                        id="address"
                        value={formData.address}
                        onChange={(e) => updateFormData('address', e.target.value)}
                        placeholder="123 Main Street"
                        className="mt-1"
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="city">City *</Label>
                        <Input
                          id="city"
                          value={formData.city}
                          onChange={(e) => updateFormData('city', e.target.value)}
                          placeholder="New York"
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="postalCode">Postal Code *</Label>
                        <Input
                          id="postalCode"
                          value={formData.postalCode}
                          onChange={(e) => updateFormData('postalCode', e.target.value)}
                          placeholder="10001"
                          className="mt-1"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="country">Country *</Label>
                      <Select value={formData.country} onValueChange={(value) => updateFormData('country', value)}>
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Select country" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="us">United States</SelectItem>
                          <SelectItem value="ca">Canada</SelectItem>
                          <SelectItem value="uk">United Kingdom</SelectItem>
                          <SelectItem value="au">Australia</SelectItem>
                          <SelectItem value="de">Germany</SelectItem>
                          <SelectItem value="fr">France</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Payment Information */}
              {step === 3 && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-4">
                    <CreditCard className="w-5 h-5 text-primary" />
                    <h3 className="text-lg font-semibold">Payment Information</h3>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <Button
                      variant={formData.paymentMethod === 'card' ? 'default' : 'outline'}
                      onClick={() => updateFormData('paymentMethod', 'card')}
                      className="h-12"
                    >
                      <CreditCard className="w-4 h-4 mr-2" />
                      Credit Card
                    </Button>
                    <Button
                      variant={formData.paymentMethod === 'paypal' ? 'default' : 'outline'}
                      onClick={() => updateFormData('paymentMethod', 'paypal')}
                      className="h-12"
                    >
                      PayPal
                    </Button>
                  </div>
                  
                  {formData.paymentMethod === 'card' && (
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="cardNumber">Card Number *</Label>
                        <Input
                          id="cardNumber"
                          value={formData.cardNumber}
                          onChange={(e) => updateFormData('cardNumber', formatCardNumber(e.target.value))}
                          placeholder="1234 5678 9012 3456"
                          maxLength={19}
                          className="mt-1"
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="expiryDate">Expiry Date *</Label>
                          <Input
                            id="expiryDate"
                            value={formData.expiryDate}
                            onChange={(e) => updateFormData('expiryDate', formatExpiryDate(e.target.value))}
                            placeholder="MM/YY"
                            maxLength={5}
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor="cvv">CVV *</Label>
                          <Input
                            id="cvv"
                            value={formData.cvv}
                            onChange={(e) => updateFormData('cvv', e.target.value.replace(/\D/g, '').substring(0, 3))}
                            placeholder="123"
                            maxLength={3}
                            className="mt-1"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {formData.paymentMethod === 'paypal' && (
                    <div className="p-6 border rounded-lg bg-muted/50 text-center">
                      <p className="text-muted-foreground">
                        You will be redirected to PayPal to complete your payment.
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between pt-6">
                {step > 1 && (
                  <Button variant="outline" onClick={() => setStep(step - 1)}>
                    Previous
                  </Button>
                )}
                
                {step < 3 ? (
                  <Button 
                    variant="gradient" 
                    onClick={handleNext}
                    className="ml-auto"
                  >
                    Continue
                  </Button>
                ) : (
                  <Button
                    variant="success"
                    onClick={handleSubmit}
                    disabled={isProcessing}
                    className="ml-auto"
                  >
                    {isProcessing ? "Processing..." : `Pay $${(total * 1.1).toFixed(2)}`}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};