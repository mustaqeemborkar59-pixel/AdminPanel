
import Image from 'next/image';
import { type MenuItem } from '@/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, DollarSign } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

interface MenuItemCardProps {
  item: MenuItem;
  onEdit: (item: MenuItem) => void;
  onDelete: (itemId: string) => void;
  onToggleAvailability?: (itemId: string, availability: boolean) => void;
}

export function MenuItemCard({ item, onEdit, onDelete, onToggleAvailability }: MenuItemCardProps) {
  return (
    <Card className="flex flex-col overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader className="p-4">
        {item.imageUrl && (
          <div className="relative w-full h-40 rounded-t-md overflow-hidden mb-3">
            <Image
              src={item.imageUrl}
              alt={item.name}
              layout="fill"
              objectFit="cover"
              data-ai-hint={item.imageHint || "food item"}
            />
          </div>
        )}
        <CardTitle className="font-headline text-lg">{item.name}</CardTitle>
        <Badge variant="secondary" className="font-body w-fit">{item.category}</Badge>
      </CardHeader>
      <CardContent className="p-4 flex-grow">
        <CardDescription className="font-body text-sm mb-2 min-h-[40px]">{item.description}</CardDescription>
        <div className="flex items-center text-lg font-semibold text-primary">
          <DollarSign className="h-5 w-5 mr-1" />
          {item.price.toFixed(2)}
        </div>
      </CardContent>
      <CardFooter className="p-4 border-t bg-muted/30 flex flex-col space-y-3">
        <div className="flex items-center justify-between w-full">
           <div className="flex items-center space-x-2">
            <Switch
                id={`availability-${item.id}`}
                checked={item.availability}
                onCheckedChange={(checked) => onToggleAvailability?.(item.id, checked)}
                aria-label={`Toggle availability for ${item.name}`}
            />
            <Label htmlFor={`availability-${item.id}`} className="text-xs font-body text-muted-foreground">
                {item.availability ? 'Available' : 'Unavailable'}
            </Label>
           </div>
        </div>
        <div className="flex gap-2 w-full">
          <Button variant="outline" size="sm" onClick={() => onEdit(item)} className="flex-1 font-body">
            <Edit className="mr-2 h-4 w-4" /> Edit
          </Button>
          <Button variant="destructive" size="sm" onClick={() => onDelete(item.id)} className="flex-1 font-body">
            <Trash2 className="mr-2 h-4 w-4" /> Delete
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
