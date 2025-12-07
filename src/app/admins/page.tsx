
"use client";

import { PageHeader } from '@/components/page-header';

export default function AdminsPage() {
  return (
    <div className="flex flex-col h-full">
      <PageHeader
        title="Admin Management"
        description="Manage roles and permissions for administrators."
      />
      <div className="flex-1 flex justify-center items-center p-4 md:p-6">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-foreground mb-2">Coming Soon</h2>
          <p className="text-muted-foreground">
            The interface to manage administrators will be available here shortly.
          </p>
        </div>
      </div>
    </div>
  );
}
