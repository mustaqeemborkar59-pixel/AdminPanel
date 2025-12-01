
import { type InventoryItem } from '@/types';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Edit, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface InventoryTableProps {
  items: InventoryItem[];
  onEditItem: (item: InventoryItem) => void;
  onDeleteItem: (itemId: string) => void;
}

export function InventoryTable({ items, onEditItem, onDeleteItem }: InventoryTableProps) {
  if (items.length === 0) {
    return <div className="text-center py-12 font-body text-muted-foreground">No inventory items found.</div>;
  }

  return (
    <Card className="shadow-lg">
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="font-headline">Item Name</TableHead>
          <TableHead className="font-headline">Quantity</TableHead>
          <TableHead className="font-headline">Unit</TableHead>
          <TableHead className="font-headline">Stock Level</TableHead>
          <TableHead className="font-headline">Vendor</TableHead>
          <TableHead className="text-right font-headline">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {items.map((item) => {
          const stockPercentage = Math.min((item.quantity / (item.alertLevel * 2)) * 100, 100); // Cap at 100, assumes alert level is half of desired max
          const isLowStock = item.quantity <= item.alertLevel;
          return (
            <TableRow key={item.id} className="font-body hover:bg-muted/50">
              <TableCell className="font-medium">{item.name}</TableCell>
              <TableCell>{item.quantity}</TableCell>
              <TableCell>{item.unit}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                <Progress value={stockPercentage} className={cn("w-24 h-2", isLowStock ? "[&>div]:bg-destructive" : "[&>div]:bg-primary")} />
                {isLowStock && <Badge variant="destructive" className="text-xs">Low</Badge>}
                </div>
              </TableCell>
              <TableCell>{item.vendor || 'N/A'}</TableCell>
              <TableCell className="text-right">
                <Button variant="ghost" size="icon" onClick={() => onEditItem(item)} className="mr-2">
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => onDeleteItem(item.id)} className="text-destructive hover:text-destructive/80">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
    </Card>
  );
}
