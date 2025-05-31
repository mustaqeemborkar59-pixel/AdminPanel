
"use client";
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { MenuItem } from '@/types';
import { Leaf, PlusCircle, Edit3, Trash2, EyeOff, Eye, Minus, Drumstick } from 'lucide-react';
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
      !item.availability && "opacity-60 bg-slate-50 dark:bg-slate-800/50" // Adjusted dark mode for unavailable
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
          {item.description || "Delicious choice"}
        </p>
        
        <div className="mt-auto space-y-2 pt-2">
          <div className="flex items-center justify-between">
            <div className="flex items-baseline gap-3 flex-grow justify-between"> {/* Price and Badge container */}
              <div className="flex items-baseline gap-1"> {/* Price */}
                <span className="text-sm font-bold text-primary">${displayPrice.toFixed(2)}</span>
                {item.discount && (
                  <span className="text-xs text-muted-foreground line-through">${item.price.toFixed(2)}</span>
                )}
              </div>
              <Badge // Veg/Non-Veg Badge
                variant="outline"
                className={cn(
                  "text-xs font-medium py-0.5 px-1.5 h-5 flex items-center self-center", // Added self-center
                  item.isVegetarian 
                    ? "border-green-600 text-green-700 bg-green-100 dark:bg-green-900/50 dark:text-green-400 dark:border-green-700" 
                    : "border-red-600 text-red-700 bg-red-100 dark:bg-red-900/50 dark:text-red-400 dark:border-red-700"
                )}
              >
                {item.isVegetarian 
                  ? <Leaf className="h-3 w-3 mr-0.5 text-green-600 dark:text-green-500" />
                  : <Drumstick className="h-3 w-3 mr-0.5 text-red-600 dark:text-red-500" />
                }
                <span className="leading-none">{item.isVegetarian ? 'Veg' : 'Non-Veg'}</span>
              </Badge>
            </div>

            {isAdminView && onEditAdminAction && onDeleteAdminAction && onToggleAvailabilityAdminAction && (
              <div className="flex gap-1 ml-2"> {/* Admin Buttons */}
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
          
          {item.availability && !isAdminView && (
            <div className="w-full pt-1"> 
              {quantityInOrder === 0 ? (
                <Button
                  variant="outline"
                  className={cn(
                    "w-full font-semibold h-9 text-sm",
                    "bg-transparent border-primary text-primary", // Base state
                    "hover:bg-primary hover:text-primary-foreground" // Hover state
                  )}
                  onClick={() => onAddToOrder(item)}
                >
                  <PlusCircle className="mr-2 h-4 w-4" /> Add to Dish
                </Button>
              ) : (
                <div className="flex items-center justify-center gap-2"> 
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-9 w-9 border-primary text-primary hover:bg-primary/10"
                    onClick={() => onDecreaseFromOrder(item.id)}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="text-lg font-semibold text-center w-8">{quantityInOrder}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-9 w-9 border-primary text-primary hover:bg-primary/10"
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
                  Currently Unavailable
              </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
