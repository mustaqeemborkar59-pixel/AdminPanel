
"use client";

import { PageHeader } from '@/components/page-header';

export default function DeliveryPage() {
  return (
    <div className="flex flex-col h-full">
      <PageHeader
        title="Delivery Management"
        description="Track and manage delivery orders and drivers."
      />
      <div className="flex-1 p-4 md:p-6 space-y-6 overflow-auto">
        <p className="text-muted-foreground">Delivery tracking and management interface will be available here soon.</p>
      </div>
    </div>
  );
}
