import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { CheckoutData, CartItem, PaymentPayload } from '@/types/product';
import { CreditCard, Lock, Mail, MapPin, ArrowLeft, Phone, Home, Map, Zap, Shield } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ApiCheckoutFormProps {
  items: CartItem[];
  total: number;
  onBack: () => void;
  onComplete: (data: CheckoutData) => void;
}

export const ApiCheckoutForm = ({ items, total, onBack, onComplete }: ApiCheckoutFormProps) => {
  const [step, setStep] = useState(1);
  const [integrationType, setIntegrationType] = useState<'hosted' | 'api'>('hosted');
  const [formData, setFormData] = useState<CheckoutData>({
    email: '',
    firstName: '',
    lastName: '',
    address: '',
    city: 'Addis Ababa',
    state: 'Addis Ababa',
    postalCode: '1000',
    country: 'ET',
    phone: '251',
    paymentMethod: 'telebirr',
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
        return formData.email && formData.firstName && formData.lastName && formData.phone;
      case 2:
        return formData.address && formData.city && formData.postalCode && formData.country;
      case 3:
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
    
    try {
      const apiBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';
      const orderNo = `ORD-${Date.now()}`;
      const amount = (Math.round(total * 1.1 * 100) / 100).toFixed(2);
      
      let cleanPhone = formData.phone.replace(/\D/g, '');
      if (cleanPhone.startsWith('251')) {
        cleanPhone = cleanPhone.substring(3);
      }

      if (integrationType === 'hosted') {
        // Use the existing hosted checkout flow
        const protocol = window.location.protocol;
        const host = window.location.host;

        const payload: PaymentPayload = {
          order_no: orderNo,
          amount: amount,
          success_url: `${protocol}//${host}/yagout_ca.html`,
          failure_url: `${protocol}//${host}/yagout_ca_failure.html`,
          customer_name: `${formData.firstName} ${formData.lastName}`.trim(),
          email_id: formData.email,
          mobile_no: cleanPhone
        };
        
        if (formData.address) payload.bill_address = formData.address;
        if (formData.city) payload.bill_city = formData.city;
        if (formData.state) payload.bill_state = formData.state;
        if (formData.country) payload.bill_country = formData.country;
        if (formData.postalCode) payload.bill_zip = formData.postalCode;

        const res = await fetch(`${apiBase}/payments/initiate`, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(payload),
        });

        const responseData = await res.json();
        if (!res.ok) {
          throw new Error(`Failed to initiate payment: ${res.status} - ${responseData.message || 'Unknown error'}`);
        }

        // Build and submit form to YagoutPay
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = responseData.post_url;

        const inputs: Record<string, string> = {
          me_id: responseData.me_id,
          merchant_request: responseData.merchant_request,
          hash: responseData.hash,
          aggregator_id: responseData.aggregator_id || 'yagout',
        };

        Object.entries(inputs).forEach(([name, value]) => {
          const input = document.createElement('input');
          input.type = 'hidden';
          input.name = name;
          input.value = value;
          form.appendChild(input);
        });

        document.body.appendChild(form);
        form.submit();
      } else {
        // Use the new Direct API integration
        const apiPayload = {
          order_no: orderNo,
          amount: amount,
          customer_name: `${formData.firstName} ${formData.lastName}`.trim(),
          email_id: formData.email,
          mobile_no: cleanPhone,
          bill_address: formData.address || '',
          bill_city: formData.city || '',
          bill_state: formData.state || '',
          bill_country: formData.country || '',
          bill_zip: formData.postalCode || '',
          pg_id: '67ee846571e740418d688c3f',
          paymode: 'WA',
          scheme_id: '7',
          wallet_type: 'telebirr'
        };

        const res = await fetch(`${apiBase}/payments/api/initiate`, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(apiPayload),
        });

        const responseData = await res.json();
        if (!res.ok) {
          throw new Error(`Failed to initiate API payment: ${res.status} - ${responseData.message || 'Unknown error'}`);
        }

        // Handle API response
        if (responseData.status === 'Success') {
          toast({
            title: "Payment Successful!",
            description: `Transaction ID: ${responseData.transactionId}`,
            variant: "default",
          });
          
          // Complete the order
          onComplete({
            ...formData,
            orderId: orderNo,
            transactionId: responseData.transactionId,
            status: 'success'
          });
        } else {
          throw new Error(responseData.statusMessage || 'Payment failed');
        }
      }
    } catch (err) {
      console.error('Payment error:', err);
      toast({ 
        title: 'Payment initiation failed', 
        description: err instanceof Error ? err.message : 'Please check your details and try again',
        variant: 'destructive' 
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Button variant="ghost" onClick={onBack} className="mb-6">
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
                    <img src={item.product.image} alt={item.product.name} className="w-12 h-12 object-cover rounded" />
                    <div>
                      <p className="font-medium text-sm">{item.product.name}</p>
                      <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <p className="font-semibold">{(item.product.price * item.quantity).toFixed(2)} ETB</p>
                </div>
              ))}
              
              <Separator />
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>{total.toFixed(2)} ETB</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax</span>
                  <span>{(total * 0.1).toFixed(2)} ETB</span>
                </div>
                <Separator />
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>{(total * 1.1).toFixed(2)} ETB</span>
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
                    <Badge key={num} variant={step >= num ? "default" : "secondary"} className={step >= num ? "bg-primary" : ""}>
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
                    <div className="space-y-2">
                      <Label htmlFor="email" className="flex items-center gap-2">
                        <Mail className="w-4 h-4" /> Email *
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="john@example.com"
                        value={formData.email}
                        onChange={(e) => updateFormData('email', e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="flex items-center gap-2">
                        <Phone className="w-4 h-4" /> Phone Number *
                      </Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="251911223344"
                        value={formData.phone}
                        onChange={(e) => updateFormData('phone', e.target.value)}
                        required
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
                    <div className="space-y-2">
                      <Label htmlFor="address" className="flex items-center gap-2">
                        <Home className="w-4 h-4" /> Billing Address *
                      </Label>
                      <Input
                        id="address"
                        placeholder="Bole Road"
                        value={formData.address}
                        onChange={(e) => updateFormData('address', e.target.value)}
                        required
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="city" className="flex items-center gap-2">
                          <Map className="w-4 h-4" /> City *
                        </Label>
                        <Input
                          id="city"
                          placeholder="Addis Ababa"
                          value={formData.city}
                          onChange={(e) => updateFormData('city', e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="state" className="flex items-center gap-2">
                          <MapPin className="w-4 h-4" /> State/Region *
                        </Label>
                        <Input
                          id="state"
                          placeholder="Addis Ababa"
                          value={formData.state}
                          onChange={(e) => updateFormData('state', e.target.value)}
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                        <Label htmlFor="postalCode">Postal Code *</Label>
                        <Input
                          id="postalCode"
                          value={formData.postalCode}
                          onChange={(e) => updateFormData('postalCode', e.target.value)}
                        placeholder="1000"
                          className="mt-1"
                        />
                    </div>
                    
                    <div>
                      <Label htmlFor="country">Country *</Label>
                      <Select value={formData.country} onValueChange={(value) => updateFormData('country', value)}>
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Select country" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ET">Ethiopia</SelectItem>
                          <SelectItem value="US">United States</SelectItem>
                          <SelectItem value="GB">United Kingdom</SelectItem>
                          <SelectItem value="CA">Canada</SelectItem>
                          <SelectItem value="AU">Australia</SelectItem>
                          <SelectItem value="DE">Germany</SelectItem>
                          <SelectItem value="FR">France</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Payment Method Selection */}
              {step === 3 && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-4">
                    <CreditCard className="w-5 h-5 text-primary" />
                    <h3 className="text-lg font-semibold">Payment Integration Method</h3>
                  </div>
                  
                  <div className="space-y-4">
                    {/* Integration Type Selection */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Card 
                        className={`cursor-pointer transition-all ${
                          integrationType === 'hosted' 
                            ? 'ring-2 ring-primary bg-primary/5' 
                            : 'hover:bg-muted/50'
                        }`}
                        onClick={() => setIntegrationType('hosted')}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                              <Shield className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <h4 className="font-semibold">Hosted Checkout</h4>
                              <p className="text-sm text-muted-foreground">Redirect to YagoutPay</p>
                            </div>
                          </div>
                          <ul className="text-sm text-muted-foreground space-y-1">
                            <li>• Secure hosted payment page</li>
                            <li>• Minimal PCI compliance</li>
                            <li>• User-friendly interface</li>
                          </ul>
                        </CardContent>
                      </Card>

                      <Card 
                        className={`cursor-pointer transition-all ${
                          integrationType === 'api' 
                            ? 'ring-2 ring-primary bg-primary/5' 
                            : 'hover:bg-muted/50'
                        }`}
                        onClick={() => setIntegrationType('api')}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                              <Zap className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <h4 className="font-semibold">Direct API</h4>
                              <p className="text-sm text-muted-foreground">Seamless integration</p>
                            </div>
                          </div>
                          <ul className="text-sm text-muted-foreground space-y-1">
                            <li>• Direct API integration</li>
                            <li>• Real-time processing</li>
                            <li>• Immediate response</li>
                          </ul>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Payment Methods Display */}
                    <div className="text-center p-4 bg-muted/30 rounded-lg">
                      <p className="text-sm text-muted-foreground mb-2">
                        Available Ethiopian Payment Methods
                      </p>
                      <div className="flex justify-center gap-6">
                        <div className="flex flex-col items-center gap-2 text-sm">
                          <img src="/telebirr-logo.png" alt="telebirr" className="w-12 h-12 object-contain" />
                          <span>telebirr</span>
                        </div>
                        <div className="flex flex-col items-center gap-2 text-sm">
                          <img src="/cbe-logo.png" alt="CBE Birr" className="w-12 h-12 object-contain" />
                          <span>CBE Birr</span>
                        </div>
                        <div className="flex flex-col items-center gap-2 text-sm">
                          <img src="/mpesa-logo.png" alt="M-PESA" className="w-12 h-12 object-contain" />
                          <span>M-PESA</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-6 border rounded-lg bg-muted/50 text-center">
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold">YP</div>
                        <span className="font-semibold">YagoutPay</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {integrationType === 'hosted' 
                          ? 'You\'ll be redirected to YagoutPay to complete your payment'
                          : 'Payment will be processed directly through our secure API'
                        }
                      </p>
                      <p className="text-xs text-muted-foreground mt-2">
                        {integrationType === 'hosted' 
                          ? 'Select your preferred mobile wallet on the payment page'
                          : 'Choose your preferred mobile wallet during checkout'
                        }
                      </p>
                    </div>
                  </div>
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
                  <Button variant="gradient" onClick={handleNext} className="ml-auto">
                    Continue
                  </Button>
                ) : (
                  <Button
                    variant="success"
                    onClick={handleSubmit}
                    disabled={isProcessing}
                    className="ml-auto"
                  >
                    {isProcessing ? "Processing..." : `Pay ${(total * 1.1).toFixed(2)} ETB`}
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
