
"use client";

import { PageHeader } from '@/components/page-header';

export default function TablesPage() {
  return (
    <div className="flex flex-col h-full">
      <PageHeader
        title="Table Services"
        description="Manage table layouts, statuses, and assignments."
      />
      <div className="flex-1 p-4 md:p-6 space-y-6 overflow-auto">
        <p className="text-muted-foreground">Table management interface will be available here soon.</p>
      </div>
    </div>
  );
}
