
"use client";
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { MenuItem } from '@/types';
import { Edit3, Trash2, EyeOff, Eye, DollarSign, Tag, Archive } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MenuItemCardProps {
  item: MenuItem;
  onEditAdminAction: (item: MenuItem) => void;
  onDeleteAdminAction: (itemId: string) => void;
  onToggleAvailabilityAdminAction: (itemId:string) => void;
}

export function MenuItemCard({
  item,
  onEditAdminAction,
  onDeleteAdminAction,
  onToggleAvailabilityAdminAction,
}: MenuItemCardProps) {
  const displayPrice = item.discount ? item.price * (1 - item.discount / 100) : item.price;

  return (
    <Card className={cn(
      "overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 w-full",
      !item.availability && "bg-muted/50"
    )}>
      <div className="flex flex-col md:flex-row items-stretch">
        {/* Left Side: Details */}
        <div className="flex-grow p-4 md:p-5 flex flex-col">
          <div className="flex items-start justify-between gap-4">
              <h3 className="text-lg font-bold text-foreground mb-1">
                {item.name}
              </h3>
              {!item.availability && (
                <Badge variant="outline" className="text-xs border-yellow-500 text-yellow-700 bg-yellow-50 dark:bg-yellow-900/50 dark:text-yellow-400 dark:border-yellow-700 whitespace-nowrap">
                    Out of Stock
                </Badge>
              )}
          </div>
          <p className="text-sm text-muted-foreground mb-3 line-clamp-2 min-h-[2.5rem] flex-grow">
            {item.description || "No description available."}
          </p>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground mb-4">
            <div className="flex items-center gap-1.5" title="Price">
              <DollarSign className="h-4 w-4 text-primary" />
              <span className="font-semibold text-foreground">₹{displayPrice.toFixed(2)}</span>
              {item.discount && (
                  <span className="text-xs text-muted-foreground line-through">₹{item.price.toFixed(2)}</span>
                )}
            </div>
             <div className="flex items-center gap-1.5" title="Category">
              <Archive className="h-4 w-4 text-primary" />
              <span className="font-medium text-foreground">{item.category}</span>
            </div>
             {item.discount && (
                <div className="flex items-center gap-1.5" title="Discount">
                    <Tag className="h-4 w-4 text-destructive" />
                    <span className="font-semibold text-destructive">{item.discount}% OFF</span>
                </div>
            )}
          </div>
          
          <div className="flex items-center gap-2 mt-auto">
              <Button size="sm" variant="outline" onClick={() => onEditAdminAction(item)}>
                  <Edit3 className="mr-2 h-4 w-4"/>
                  Edit
              </Button>
               <Button size="sm" variant="outline" onClick={() => onToggleAvailabilityAdminAction(item.id)}>
                   {item.availability ? <EyeOff className="mr-2 h-4 w-4" /> : <Eye className="mr-2 h-4 w-4" />}
                  {item.availability ? 'Set Unavailable' : 'Set Available'}
              </Button>
              <Button size="sm" variant="destructive" onClick={() => onDeleteAdminAction(item.id)}>
                  <Trash2 className="mr-2 h-4 w-4"/>
                  Delete
              </Button>
          </div>

        </div>

        {/* Right Side: Image */}
        <div className="flex items-center justify-center p-4 md:p-5 bg-muted/20 w-full md:w-[250px] shrink-0">
            <div className="relative w-full aspect-square rounded-lg overflow-hidden shadow-inner">
                <Image
                    src={item.imageUrl || `https://placehold.co/300x300.png?text=${encodeURIComponent(item.name)}`}
                    alt={item.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 250px"
                    className="object-cover"
                    data-ai-hint={item.imageHint || item.name.toLowerCase().split(" ").slice(0,2).join(" ")}
                />
            </div>
        </div>
      </div>
    </Card>
  );
}
