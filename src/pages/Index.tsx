import { useState } from 'react';
import { Header } from '@/components/Header';
import { ProductCard } from '@/components/ProductCard';
import { CartSidebar } from '@/components/CartSidebar';
import { CheckoutForm } from '@/components/CheckoutForm';
import { OrderSuccess } from '@/components/OrderSuccess';
import { useCart } from '@/hooks/useCart';
import { Product, CheckoutData } from '@/types/product';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import productImage from '@/assets/headphones-product.jpg';
import { Sparkles, Zap, Shield, Truck } from 'lucide-react';

type ViewMode = 'shop' | 'checkout' | 'success';

const sampleProducts: Product[] = [
  {
    id: '1',
    name: 'Premium Wireless Headphones',
    price: 199.99,
    originalPrice: 249.99,
    image: productImage,
    description: 'Experience crystal-clear audio with our premium wireless headphones featuring active noise cancellation and 30-hour battery life.',
    features: ['Active Noise Cancellation', '30-hour Battery', 'Premium Audio Drivers', 'Wireless Charging'],
    inStock: true,
  },
];

const Index = () => {
  const cart = useCart();
  const [viewMode, setViewMode] = useState<ViewMode>('shop');
  const [orderData, setOrderData] = useState<CheckoutData | null>(null);
  const [orderId] = useState(() => `ORD-${Date.now()}`);

  const handleCheckout = () => {
    setViewMode('checkout');
    cart.setIsOpen(false);
  };

  const handleOrderComplete = (data: CheckoutData) => {
    setOrderData(data);
    setViewMode('success');
    cart.clearCart();
  };

  const handleBackToShop = () => {
    setViewMode('shop');
    setOrderData(null);
  };

  if (viewMode === 'checkout') {
    return (
      <div className="min-h-screen bg-gradient-surface">
        <Header cartItemCount={cart.itemCount} onCartClick={() => cart.setIsOpen(true)} />
        <CheckoutForm
          items={cart.items}
          total={cart.total}
          onBack={() => setViewMode('shop')}
          onComplete={handleOrderComplete}
        />
      </div>
    );
  }

  if (viewMode === 'success' && orderData) {
    return (
      <div className="min-h-screen bg-gradient-surface">
        <Header cartItemCount={cart.itemCount} onCartClick={() => cart.setIsOpen(true)} />
        <div className="pt-8">
          <OrderSuccess
            orderData={orderData}
            items={cart.items}
            total={cart.total}
            orderId={orderId}
            onBackToShop={handleBackToShop}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-surface">
      <Header cartItemCount={cart.itemCount} onCartClick={() => cart.setIsOpen(true)} />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center max-w-4xl mx-auto">
            <Badge className="mb-6 bg-primary/10 text-primary border-primary/20">
              <Sparkles className="w-4 h-4 mr-2" />
              CartFlow SDK Demo
            </Badge>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-primary bg-clip-text text-transparent leading-tight">
              E-commerce Made Simple
            </h1>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              Experience our powerful checkout SDK with this interactive demo. 
              Complete purchase flow with dynamic forms and secure payment processing.
            </p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
              <div className="flex flex-col items-center p-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-3">
                  <Zap className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold">Lightning Fast</h3>
                <p className="text-sm text-muted-foreground text-center">Optimized checkout flow</p>
              </div>
              <div className="flex flex-col items-center p-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-3">
                  <Shield className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold">Secure</h3>
                <p className="text-sm text-muted-foreground text-center">Bank-level security</p>
              </div>
              <div className="flex flex-col items-center p-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-3">
                  <Truck className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold">Fast Shipping</h3>
                <p className="text-sm text-muted-foreground text-center">Free worldwide delivery</p>
              </div>
              <div className="flex flex-col items-center p-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-3">
                  <Sparkles className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold">Premium Quality</h3>
                <p className="text-sm text-muted-foreground text-center">Carefully curated products</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Featured Products</h2>
            <p className="text-muted-foreground">Try our demo checkout experience</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {sampleProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={cart.addToCart}
              />
            ))}
          </div>
        </div>
      </section>

      {/* SDK Features Section */}
      <section className="py-16 bg-accent/30">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-6">Powerful SDK Features</h2>
            <p className="text-muted-foreground mb-8">
              Our CartFlow SDK provides everything you need for a seamless e-commerce experience
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 bg-card rounded-lg shadow-card">
                <h3 className="font-semibold mb-2">Dynamic Checkout</h3>
                <p className="text-sm text-muted-foreground">
                  Multi-step forms with real-time validation and interactive elements
                </p>
              </div>
              <div className="p-6 bg-card rounded-lg shadow-card">
                <h3 className="font-semibold mb-2">Payment Integration</h3>
                <p className="text-sm text-muted-foreground">
                  Support for multiple payment methods including cards and PayPal
                </p>
              </div>
              <div className="p-6 bg-card rounded-lg shadow-card">
                <h3 className="font-semibold mb-2">Order Management</h3>
                <p className="text-sm text-muted-foreground">
                  Complete order tracking and receipt generation
                </p>
              </div>
            </div>

            <Button variant="gradient" size="lg" className="mt-8">
              View Documentation
            </Button>
          </div>
        </div>
      </section>

      <CartSidebar
        items={cart.items}
        total={cart.total}
        itemCount={cart.itemCount}
        isOpen={cart.isOpen}
        onOpenChange={cart.setIsOpen}
        onUpdateQuantity={cart.updateQuantity}
        onRemoveItem={cart.removeFromCart}
        onCheckout={handleCheckout}
      />
    </div>
  );
};

export default Index;
