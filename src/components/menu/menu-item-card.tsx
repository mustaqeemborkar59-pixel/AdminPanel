
"use client";
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { MenuItem } from '@/types';
import { Leaf, PlusCircle, Edit3, Trash2, EyeOff, Eye } from 'lucide-react'; // Assuming a generic food icon for non-veg or just text
import { cn } from '@/lib/utils';

interface MenuItemCardProps {
  item: MenuItem;
  onAddToOrder: (item: MenuItem) => void;
  onEditAdminAction?: (item: MenuItem) => void; // Optional admin actions
  onDeleteAdminAction?: (itemId: string) => void;
  onToggleAvailabilityAdminAction?: (itemId: string) => void;
  isAdminView?: boolean; // To show/hide admin controls
}

export function MenuItemCard({
  item,
  onAddToOrder,
  onEditAdminAction,
  onDeleteAdminAction,
  onToggleAvailabilityAdminAction,
  isAdminView = false // Default to false if not provided
}: MenuItemCardProps) {
  const displayPrice = item.discount ? item.price * (1 - item.discount / 100) : item.price;

  return (
    <Card className={cn(
      "overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col h-full",
      !item.availability && "opacity-60 bg-slate-50"
    )}>
      <div className="relative w-full aspect-[3/2]"> {/* Fixed aspect ratio for image container */}
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
         <Badge 
            variant="outline" 
            className={cn(
                "absolute top-2 right-2 text-xs backdrop-blur-sm bg-white/70",
                item.isVegetarian ? "border-green-500 text-green-700" : "border-red-500 text-red-700"
            )}
        >
            {item.isVegetarian ? <Leaf className="h-3 w-3 mr-1 text-green-600" /> : null}
            {item.isVegetarian ? 'Veg' : 'Non-Veg'}
        </Badge>
      </div>
      <CardContent className="p-3 flex flex-col flex-grow">
        <h3 className="text-base font-semibold mb-1 truncate group-hover:whitespace-normal" title={item.name}>
          {item.name}
        </h3>
        <p className="text-xs text-muted-foreground mb-2 line-clamp-2 flex-grow min-h-[2.5rem]">
          {item.description || "No description available."}
        </p>
        <div className="flex items-center justify-between mt-auto">
          <div className="flex items-baseline gap-1">
            <span className="text-sm font-bold text-primary">${displayPrice.toFixed(2)}</span>
            {item.discount && (
              <span className="text-xs text-muted-foreground line-through">${item.price.toFixed(2)}</span>
            )}
          </div>
           {isAdminView && onEditAdminAction && onDeleteAdminAction && onToggleAvailabilityAdminAction && (
            <div className="flex gap-1">
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
         {!item.availability && (
            <Badge variant="outline" className="w-full justify-center mt-2 py-1 text-sm border-yellow-500 text-yellow-700 bg-yellow-50">
                Currently Unavailable
            </Badge>
        )}
        {item.availability && (
             <Button 
                variant="outline" 
                className="w-full mt-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground" 
                onClick={() => onAddToOrder(item)}
            >
                <PlusCircle className="mr-2 h-4 w-4" /> Add to Order
            </Button>
        )}
      </CardContent>
    </Card>
  );
}
