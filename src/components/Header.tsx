import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Package } from 'lucide-react';

interface HeaderProps {
  cartItemCount: number;
  onCartClick: () => void;
}

export const Header = ({ cartItemCount, onCartClick }: HeaderProps) => {
  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <Package className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                CartFlow SDK
              </h1>
              <p className="text-xs text-muted-foreground">Demo Store</p>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-6">
            <a href="#" className="text-foreground hover:text-primary transition-smooth">
              Products
            </a>
            <a href="#" className="text-foreground hover:text-primary transition-smooth">
              About
            </a>
            <a href="#" className="text-foreground hover:text-primary transition-smooth">
              Contact
            </a>
          </nav>

          <Button 
            variant="outline" 
            size="icon" 
            className="relative"
            onClick={onCartClick}
          >
            <ShoppingCart className="w-5 h-5" />
            {cartItemCount > 0 && (
              <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs bg-primary">
                {cartItemCount}
              </Badge>
            )}
          </Button>
        </div>
      </div>
    </header>
  );
};