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
import earbudsImage from '@/assets/earbuds-product.jpg';
import smartphoneImage from '@/assets/smartphone-product.jpg';
import laptopImage from '@/assets/laptop-product.jpg';
import smartwatchImage from '@/assets/smartwatch-product.jpg';
import keyboardImage from '@/assets/keyboard-product.jpg';
import mouseImage from '@/assets/mouse-product.jpg';
import tabletImage from '@/assets/tablet-product.jpg';
import { Sparkles, Zap, Shield, Truck, Star, Users, Award, Clock } from 'lucide-react';

type ViewMode = 'shop' | 'checkout' | 'success';

const sampleProducts: Product[] = [
  {
    id: '1',
    name: 'Premium Wireless Headphones',
    price: 299.00,
    originalPrice: 499.00,
    image: productImage,
    description: 'Experience crystal-clear audio with our premium wireless headphones featuring active noise cancellation and 30-hour battery life.',
    features: ['Active Noise Cancellation', '30-hour Battery', 'Premium Audio Drivers', 'Wireless Charging'],
    inStock: true,
  },
  {
    id: '2',
    name: 'True Wireless Earbuds',
    price: 149.00,
    originalPrice: 199.00,
    image: earbudsImage,
    description: 'Compact and powerful earbuds with crystal clear sound and all-day comfort for your active lifestyle.',
    features: ['Touch Controls', 'Waterproof IPX7', '8-hour Playtime', 'Fast Charging Case'],
    inStock: true,
  },
  {
    id: '3',
    name: 'Latest Smartphone',
    price: 899.00,
    originalPrice: 1099.00,
    image: smartphoneImage,
    description: 'Cutting-edge smartphone with advanced camera system and lightning-fast performance.',
    features: ['Triple Camera System', '5G Connectivity', '128GB Storage', 'All-day Battery'],
    inStock: true,
  },
  {
    id: '4',
    name: 'Professional Laptop',
    price: 1299.00,
    originalPrice: 1599.00,
    image: laptopImage,
    description: 'High-performance laptop designed for professionals and creators with stunning display.',
    features: ['Intel i7 Processor', '16GB RAM', '512GB SSD', '15.6" 4K Display'],
    inStock: true,
  },
  {
    id: '5',
    name: 'Smart Fitness Watch',
    price: 249.00,
    originalPrice: 329.00,
    image: smartwatchImage,
    description: 'Track your fitness goals with this advanced smartwatch featuring health monitoring.',
    features: ['Heart Rate Monitor', 'GPS Tracking', '7-day Battery', 'Water Resistant'],
    inStock: true,
  },
  {
    id: '6',
    name: 'Mechanical Gaming Keyboard',
    price: 129.00,
    originalPrice: 179.00,
    image: keyboardImage,
    description: 'Professional gaming keyboard with RGB lighting and responsive mechanical switches.',
    features: ['RGB Backlighting', 'Mechanical Switches', 'Programmable Keys', 'Durable Build'],
    inStock: true,
  },
  {
    id: '7',
    name: 'Wireless Gaming Mouse',
    price: 79.00,
    originalPrice: 99.00,
    image: mouseImage,
    description: 'Precision gaming mouse with ergonomic design and customizable buttons.',
    features: ['16000 DPI Sensor', 'Wireless Connectivity', 'Ergonomic Design', '80-hour Battery'],
    inStock: true,
  },
  {
    id: '8',
    name: 'Tablet Pro',
    price: 599.00,
    originalPrice: 799.00,
    image: tabletImage,
    description: 'Versatile tablet perfect for work and entertainment with stunning display.',
    features: ['10.9" Liquid Retina', 'A14 Bionic Chip', 'All-day Battery', 'Apple Pencil Support'],
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
      <section className="relative overflow-hidden bg-gradient-primary">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative container mx-auto px-4 py-20">
          <div className="text-center max-w-4xl mx-auto text-white">
            <Badge className="mb-6 bg-white/20 text-white border-white/30 animate-fade-in">
              <Sparkles className="w-4 h-4 mr-2" />
              YagoutPay E-commerce Platform
            </Badge>
            <h1 className="text-6xl md:text-7xl font-bold mb-6 leading-tight animate-scale-in">
              Shop Smart,
              <br />
              <span className="text-transparent bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text">
                Pay Easy
              </span>
            </h1>
            <p className="text-xl text-white/90 mb-8 leading-relaxed animate-fade-in">
              Discover amazing products with secure payments powered by YagoutPay. 
              Experience seamless shopping with Ethiopian payment methods.
            </p>
            
            <div className="flex justify-center mb-12 animate-slide-in-right">
              <Button variant="secondary" size="lg" className="text-lg px-8 py-4">
                Shop Now
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-card">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">10K+</div>
              <div className="text-muted-foreground">Happy Customers</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">500+</div>
              <div className="text-muted-foreground">Products</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">99.9%</div>
              <div className="text-muted-foreground">Uptime</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">24/7</div>
              <div className="text-muted-foreground">Support</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl font-bold mb-4">Why Choose YagoutPay?</h2>
            <p className="text-muted-foreground">Experience the future of e-commerce with our cutting-edge platform</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="flex flex-col items-center p-6 bg-card rounded-lg shadow-card hover:shadow-elevated transition-smooth group">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Zap className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Lightning Fast</h3>
              <p className="text-sm text-muted-foreground text-center">Optimized checkout flow for quick purchases</p>
            </div>
            <div className="flex flex-col items-center p-6 bg-card rounded-lg shadow-card hover:shadow-elevated transition-smooth group">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Shield className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Secure Payments</h3>
              <p className="text-sm text-muted-foreground text-center">Bank-level security for all transactions</p>
            </div>
            <div className="flex flex-col items-center p-6 bg-card rounded-lg shadow-card hover:shadow-elevated transition-smooth group">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Truck className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Fast Delivery</h3>
              <p className="text-sm text-muted-foreground text-center">Free shipping across Ethiopia</p>
            </div>
            <div className="flex flex-col items-center p-6 bg-card rounded-lg shadow-card hover:shadow-elevated transition-smooth group">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Users className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">24/7 Support</h3>
              <p className="text-sm text-muted-foreground text-center">Always here to help you</p>
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-16 bg-gradient-surface">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
              <Star className="w-4 h-4 mr-2" />
              Featured Products
            </Badge>
            <h2 className="text-4xl font-bold mb-4">Best Selling Products</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Discover our handpicked selection of premium products with unbeatable prices and quality
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {sampleProducts.map((product, index) => (
              <div key={product.id} className="animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                <ProductCard
                  product={product}
                  onAddToCart={cart.addToCart}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Payment Methods Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-6">Ethiopian Payment Methods</h2>
            <p className="text-muted-foreground mb-8">
              Pay securely with your preferred Ethiopian payment method
            </p>
            
            <div className="flex justify-center gap-8 mb-8">
              <div className="flex flex-col items-center gap-3">
                <img src="/telebirr-logo.png" alt="telebirr" className="w-16 h-16 object-contain" />
                <span className="text-sm font-medium">telebirr</span>
              </div>
              <div className="flex flex-col items-center gap-3">
                <img src="/cbe-logo.png" alt="CBE Birr" className="w-16 h-16 object-contain" />
                <span className="text-sm font-medium">CBE Birr</span>
              </div>
              <div className="flex flex-col items-center gap-3">
                <img src="/mpesa-logo.png" alt="M-PESA" className="w-16 h-16 object-contain" />
                <span className="text-sm font-medium">M-PESA</span>
              </div>
            </div>

            <Button variant="gradient" size="lg" className="px-8">
              Start Shopping Now
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
