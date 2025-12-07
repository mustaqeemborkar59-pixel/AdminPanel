
"use client";

import { PageHeader } from '@/components/page-header';
import { AppearanceSettings } from '@/components/settings/appearance-settings';
import { TaxSettings } from '@/components/settings/tax-settings';
import { CurrencySettings } from '@/components/settings/currency-settings';
import { Separator } from '@/components/ui/separator';
import { CompanyDetailsSettings } from '@/components/settings/company-details-settings';

export default function SettingsPage() {
  return (
    <div className="flex flex-col h-full">
      <PageHeader
        title="Application Settings"
        description="Manage appearance, store configurations, and other application preferences."
      />
      <div className="flex-1 p-4 md:p-6 overflow-auto">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-6">
            <AppearanceSettings />
            <TaxSettings />
          </div>
          <div className="space-y-6">
            <CompanyDetailsSettings />
            <CurrencySettings />
          </div>
        </div>
      </div>
    </div>
  );
}
