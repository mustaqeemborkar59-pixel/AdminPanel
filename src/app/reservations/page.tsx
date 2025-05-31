
"use client";

import { PageHeader } from '@/components/page-header';

export default function ReservationsPage() {
  return (
    <div className="flex flex-col h-full">
      <PageHeader
        title="Reservations"
        description="Manage customer bookings and table reservations."
      />
      <div className="flex-1 p-4 md:p-6 space-y-6 overflow-auto">
        <p className="text-muted-foreground">Reservation management interface will be available here soon.</p>
      </div>
    </div>
  );
}
