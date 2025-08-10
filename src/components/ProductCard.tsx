import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Product } from '@/types/product';
import { ShoppingCart, Star } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

export const ProductCard = ({ product, onAddToCart }: ProductCardProps) => {
  const discountPercentage = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <Card className="group overflow-hidden bg-gradient-surface border-none shadow-card hover:shadow-elevated transition-smooth">
      <div className="relative overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-80 object-cover group-hover:scale-105 transition-smooth"
        />
        {discountPercentage > 0 && (
          <Badge className="absolute top-4 left-4 bg-destructive text-destructive-foreground">
            -{discountPercentage}%
          </Badge>
        )}
        {!product.inStock && (
          <div className="absolute inset-0 bg-muted/80 flex items-center justify-center">
            <Badge variant="secondary">Out of Stock</Badge>
          </div>
        )}
      </div>
      
      <div className="p-6">
        <div className="flex items-center gap-2 mb-2">
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className="w-4 h-4 fill-warning text-warning"
              />
            ))}
          </div>
          <span className="text-sm text-muted-foreground">(128 reviews)</span>
        </div>
        
        <h3 className="text-xl font-semibold mb-2 text-card-foreground">
          {product.name}
        </h3>
        
        <p className="text-muted-foreground mb-4 line-clamp-2">
          {product.description}
        </p>
        
        <div className="flex items-center gap-2 mb-4">
          <span className="text-2xl font-bold text-primary">
            ${product.price}
          </span>
          {product.originalPrice && (
            <span className="text-lg text-muted-foreground line-through">
              ${product.originalPrice}
            </span>
          )}
        </div>
        
        <Button
          variant="cart"
          size="lg"
          className="w-full"
          onClick={() => onAddToCart(product)}
          disabled={!product.inStock}
        >
          <ShoppingCart className="w-5 h-5" />
          Add to Cart
        </Button>
      </div>
    </Card>
  );
};