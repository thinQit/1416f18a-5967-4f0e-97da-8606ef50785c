import Link from "next/link";
import { Card, CardContent } from "@/components/ui/Card";
import type { Product } from "@/types";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Card>
      <CardContent className="space-y-3">
        <div className="aspect-[4/3] rounded-md bg-muted flex items-center justify-center text-secondary overflow-hidden">
          {product.image_url ? (
            <img src={product.image_url} alt={product.title} className="h-full w-full object-cover" />
          ) : (
            <span className="text-sm">No image</span>
          )}
        </div>
        <div>
          <h3 className="text-lg font-semibold text-foreground">{product.title}</h3>
          <p className="text-sm text-secondary line-clamp-2">{product.description}</p>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-foreground">${product.price.toFixed(2)}</span>
          <Link href={`/products/${product.id}`} className="text-sm text-primary">
            View details
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
