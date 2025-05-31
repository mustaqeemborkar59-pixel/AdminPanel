
import Image from 'next/image';
import { type MenuItem } from '@/types';
import { Card } from '@/components/ui/card'; 
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, DollarSign, ToggleLeft, ToggleRight, CheckCircle, XCircle, PlusCircle } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

interface MenuItemCardProps {
  item: MenuItem;
  onEditAdminAction: (item: MenuItem) => void;
  onDeleteAdminAction: (itemId: string) => void;
  onToggleAvailabilityAdminAction?: (itemId: string, availability: boolean) => void;
  onAddToOrder: (item: MenuItem) => void;
}

export function MenuItemCard({ 
    item, 
    onEditAdminAction, 
    onDeleteAdminAction, 
    onToggleAvailabilityAdminAction,
    onAddToOrder 
}: MenuItemCardProps) {
  return (
    <Card className="flex flex-col overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 rounded-xl border border-border bg-card">
      <div className="relative w-full aspect-[4/3] rounded-t-xl overflow-hidden">
        {item.imageUrl ? (
          <Image
            src={item.imageUrl}
            alt={item.name}
            fill
            style={{ objectFit: 'cover' }}
            sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 30vw"
            data-ai-hint={item.imageHint || "food item"}
            priority={false}
          />
        ) : (
          <div className="w-full h-full bg-muted flex items-center justify-center">
            <Utensils className="w-12 h-12 text-muted-foreground" />
          </div>
        )}
        <Badge
          variant={item.availability ? "default" : "destructive"}
          className={cn(
            "absolute top-2 right-2 text-xs py-1 px-2 font-body",
            item.availability ? "bg-green-500/80 text-white border-green-600" : "bg-red-500/80 text-white border-red-600"
          )}
        >
          {item.availability ? 'Available' : 'Unavailable'}
        </Badge>
      </div>

      <div className="p-3 flex flex-col flex-grow">
        <h3 className="font-headline text-base font-semibold text-foreground mb-1 truncate">{item.name}</h3>
        
        <div className="flex items-center text-primary font-bold text-sm mb-2">
          <DollarSign className="h-4 w-4 mr-1" />
          {item.price.toFixed(2)}
        </div>

        <p className="font-body text-sm text-muted-foreground mb-3 line-clamp-2">
          {item.description || "No description available."}
        </p>
        
        <Badge variant="secondary" className="font-body w-fit mb-3 text-xs py-1 px-2 capitalize bg-secondary text-secondary-foreground">
          {item.category}
        </Badge>

        <div className="mt-auto pt-3 space-y-2">
          <Button 
            variant="default" 
            size="sm" 
            onClick={() => onAddToOrder(item)} 
            className="w-full font-body"
            disabled={!item.availability}
          >
            <PlusCircle className="mr-1.5 h-4 w-4" /> Add to Order
          </Button>
          <div className="pt-2 border-t border-border/50">
            <div className="flex items-center justify-between mb-2 mt-1">
                <Label htmlFor={`availability-switch-${item.id}`} className="text-xs font-body text-muted-foreground">
                Status:
                </Label>
                <Switch
                id={`availability-switch-${item.id}`}
                checked={item.availability}
                onCheckedChange={(checked) => onToggleAvailabilityAdminAction?.(item.id, checked)}
                aria-label={`Toggle availability for ${item.name}`}
                />
            </div>
            <div className="flex gap-2 w-full">
                <Button variant="outline" size="sm" onClick={() => onEditAdminAction(item)} className="flex-1 font-body text-xs border-primary/50 text-primary hover:bg-primary/10">
                <Edit className="mr-1.5 h-3.5 w-3.5" /> Edit
                </Button>
                <Button variant="outline" size="sm" onClick={() => onDeleteAdminAction(item.id)} className="flex-1 font-body text-xs border-destructive/50 text-destructive hover:bg-destructive/10">
                <Trash2 className="mr-1.5 h-3.5 w-3.5" /> Delete
                </Button>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}

import { Utensils } from 'lucide-react';
