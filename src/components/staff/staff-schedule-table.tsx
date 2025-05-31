
import { type StaffMember } from '@/types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, Clock, UserCheck, UserX } from 'lucide-react';
import { Card } from '@/components/ui/card'; // Import Card
import { AddStaffMemberDialog } from './add-staff-member-dialog'; // For editing

interface StaffScheduleTableProps {
  staffMembers: StaffMember[];
  onEditStaff: (staff: StaffMember) => void;
  onDeleteStaff: (staffId: string) => void;
}

const statusIcons: Record<NonNullable<StaffMember['status']>, React.ElementType> = {
    'on-duty': UserCheck,
    'off-duty': UserX,
    'on-leave': Clock,
};
const statusColors: Record<NonNullable<StaffMember['status']>, string> = {
    'on-duty': 'text-green-600 bg-green-100 border-green-500',
    'off-duty': 'text-slate-600 bg-slate-100 border-slate-500',
    'on-leave': 'text-yellow-600 bg-yellow-100 border-yellow-500',
};


export function StaffScheduleTable({ staffMembers, onEditStaff, onDeleteStaff }: StaffScheduleTableProps) {
  if (staffMembers.length === 0) {
    return <div className="text-center py-12 font-body text-muted-foreground">No staff members found.</div>;
  }

  return (
    <Card className="shadow-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="font-headline">Name</TableHead>
            <TableHead className="font-headline">Role</TableHead>
            <TableHead className="font-headline">Shift</TableHead>
            <TableHead className="font-headline">Status</TableHead>
            <TableHead className="text-right font-headline">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {staffMembers.map((staff) => {
            const StatusIcon = staff.status ? statusIcons[staff.status] : Clock;
            const statusColorClass = staff.status ? statusColors[staff.status] : statusColors['off-duty'];
            return (
            <TableRow key={staff.id} className="font-body hover:bg-muted/50">
              <TableCell className="font-medium">{staff.name}</TableCell>
              <TableCell>{staff.role}</TableCell>
              <TableCell>{staff.shift || 'Not Assigned'}</TableCell>
              <TableCell>
                <Badge variant="outline" className={`capitalize text-xs ${statusColorClass}`}>
                  <StatusIcon className="h-3 w-3 mr-1.5" />
                  {staff.status ? staff.status.replace('-', ' ') : 'Unknown'}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                 {/* For editing, reusing AddStaffMemberDialog by passing existingStaff */}
                <AddStaffMemberDialog existingStaff={staff} onAddStaff={(editedStaff) => onEditStaff({...editedStaff, id: staff.id})} triggerButton={
                    <Button variant="ghost" size="icon" className="mr-2">
                        <Edit className="h-4 w-4" />
                    </Button>
                }/>
                <Button variant="ghost" size="icon" onClick={() => onDeleteStaff(staff.id)} className="text-destructive hover:text-destructive/80">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          )})}
        </TableBody>
      </Table>
    </Card>
  );
}
