
"use client";
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { MenuItem } from '@/types';
import { PlusCircle, Edit3, Trash2, EyeOff, Eye, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MenuItemCardProps {
  item: MenuItem;
  quantityInOrder?: number;
  onAddToOrder: (item: MenuItem) => void;
  onDecreaseFromOrder: (itemId: string) => void;
  onEditAdminAction?: (item: MenuItem) => void;
  onDeleteAdminAction?: (itemId: string) => void;
  onToggleAvailabilityAdminAction?: (itemId: string) => void;
  isAdminView?: boolean;
}

export function MenuItemCard({
  item,
  quantityInOrder = 0,
  onAddToOrder,
  onDecreaseFromOrder,
  onEditAdminAction,
  onDeleteAdminAction,
  onToggleAvailabilityAdminAction,
  isAdminView = false
}: MenuItemCardProps) {
  const displayPrice = item.discount ? item.price * (1 - item.discount / 100) : item.price;

  return (
    <Card className={cn(
      "overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col h-full group",
      !item.availability && "opacity-60 bg-slate-50 dark:bg-slate-800/50"
    )}>
      <div className="relative w-full aspect-[3/2]">
        <Image
          src={item.imageUrl || `https://placehold.co/300x200.png?text=${encodeURIComponent(item.name)}`}
          alt={item.name}
          fill
          sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 30vw"
          className="object-cover"
          data-ai-hint={item.imageHint || item.name.toLowerCase().split(" ").slice(0,2).join(" ")}
        />
        {item.discount && (
          <Badge variant="destructive" className="absolute top-2 left-2 text-xs">
            {item.discount}% OFF
          </Badge>
        )}
      </div>
      <CardContent className="p-3 flex flex-col flex-grow">
        <h3 className="text-base font-semibold mb-0.5 truncate group-hover:whitespace-normal" title={item.name}>
          {item.name}
        </h3>
        <p className="text-xs text-muted-foreground mb-2 line-clamp-2 flex-grow min-h-[1.5rem]">
          {item.description || "A great choice for your collection."}
        </p>
        
        <div className="mt-auto space-y-2 pt-2">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-baseline gap-1 flex-grow justify-between"> 
              <div className="flex items-baseline gap-3"> 
                <span className="text-sm font-bold text-primary">₹{displayPrice.toFixed(2)}</span>
                {item.discount && (
                  <span className="text-xs text-muted-foreground line-through">₹{item.price.toFixed(2)}</span>
                )}
              </div>
            </div>

            {isAdminView && onEditAdminAction && onDeleteAdminAction && onToggleAvailabilityAdminAction && (
              <div className="flex gap-1 ml-2"> 
                   <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() => onToggleAvailabilityAdminAction(item.id)}
                      title={item.availability ? "Mark Unavailable" : "Mark Available"}
                  >
                      {item.availability ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4 text-destructive" />}
                  </Button>
                  <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => onEditAdminAction(item)}>
                      <Edit3 className="h-4 w-4"/>
                  </Button>
                  <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive/80" onClick={() => onDeleteAdminAction(item.id)}>
                      <Trash2 className="h-4 w-4"/>
                  </Button>
              </div>
            )}
          </div>
          
          {!isAdminView && item.availability && (
            <div className="w-full pt-1"> 
              {quantityInOrder === 0 ? (
                <Button
                  variant="outline"
                  className={cn(
                    "w-full font-semibold h-9 text-sm",
                    "bg-transparent border-primary text-primary", 
                    "hover:bg-primary hover:text-primary-foreground" 
                  )}
                  onClick={() => onAddToOrder(item)}
                >
                  <PlusCircle className="mr-2 h-4 w-4" /> Add to Cart
                </Button>
              ) : (
                <div className="flex items-center justify-center gap-2"> 
                  <Button
                    variant="default"
                    size="icon"
                    className="h-9 w-9"
                    onClick={() => onDecreaseFromOrder(item.id)}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="text-lg font-semibold text-center w-8">{quantityInOrder}</span>
                  <Button
                    variant="default"
                    size="icon"
                    className="h-9 w-9"
                    onClick={() => onAddToOrder(item)}
                  >
                    <PlusCircle className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          )}
          
          {!item.availability && (
              <Badge variant="outline" className="w-full justify-center py-1 text-sm border-yellow-500 text-yellow-700 bg-yellow-50 dark:bg-yellow-900/50 dark:text-yellow-400 dark:border-yellow-700">
                  Currently Out of Stock
              </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
