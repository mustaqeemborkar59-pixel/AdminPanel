
import Image from 'next/image';
import { type MenuItem } from '@/types';
import { Card } from '@/components/ui/card'; // Only Card is needed as base
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, DollarSign, ToggleLeft, ToggleRight, CheckCircle, XCircle } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

interface MenuItemCardProps {
  item: MenuItem;
  onEdit: (item: MenuItem) => void;
  onDelete: (itemId: string) => void;
  onToggleAvailability?: (itemId: string, availability: boolean) => void;
}

export function MenuItemCard({ item, onEdit, onDelete, onToggleAvailability }: MenuItemCardProps) {
  return (
    <Card className="flex flex-col overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 rounded-xl border border-border bg-card">
      <div className="relative w-full aspect-[4/3] rounded-t-xl overflow-hidden">
        {item.imageUrl ? (
          <Image
            src={item.imageUrl}
            alt={item.name}
            fill // Changed from layout="fill" to fill for Next 13+
            style={{ objectFit: 'cover' }} // Use style for objectFit
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            data-ai-hint={item.imageHint || "food item"}
            priority={false} // Consider setting priority for above-the-fold images
          />
        ) : (
          <div className="w-full h-full bg-muted flex items-center justify-center">
            <Utensils className="w-12 h-12 text-muted-foreground" />
          </div>
        )}
         {/* Availability Badge - Top Right */}
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

      <div className="p-4 flex flex-col flex-grow">
        <h3 className="font-headline text-lg font-semibold text-foreground mb-1 truncate">{item.name}</h3>
        
        <div className="flex items-center text-primary font-bold text-xl mb-2">
          <DollarSign className="h-5 w-5 mr-1" />
          {item.price.toFixed(2)}
        </div>

        <p className="font-body text-sm text-muted-foreground mb-3 min-h-[40px] line-clamp-2">
          {item.description || "No description available."}
        </p>
        
        <Badge variant="secondary" className="font-body w-fit mb-4 text-xs py-1 px-2 capitalize bg-secondary text-secondary-foreground">
          {item.category}
        </Badge>

        {/* Actions - kept subtle for admin view */}
        <div className="mt-auto pt-3 border-t border-border/50">
          <div className="flex items-center justify-between mb-2">
            <Label htmlFor={`availability-switch-${item.id}`} className="text-xs font-body text-muted-foreground">
              Status:
            </Label>
            <Switch
              id={`availability-switch-${item.id}`}
              checked={item.availability}
              onCheckedChange={(checked) => onToggleAvailability?.(item.id, checked)}
              aria-label={`Toggle availability for ${item.name}`}
            />
          </div>
          <div className="flex gap-2 w-full">
            <Button variant="outline" size="sm" onClick={() => onEdit(item)} className="flex-1 font-body text-xs border-primary/50 text-primary hover:bg-primary/10">
              <Edit className="mr-1.5 h-3.5 w-3.5" /> Edit
            </Button>
            <Button variant="outline" size="sm" onClick={() => onDelete(item.id)} className="flex-1 font-body text-xs border-destructive/50 text-destructive hover:bg-destructive/10">
              <Trash2 className="mr-1.5 h-3.5 w-3.5" /> Delete
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}

// Placeholder for Utensils if not imported elsewhere, usually from lucide-react
import { Utensils } from 'lucide-react';
