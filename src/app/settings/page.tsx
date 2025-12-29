
"use client";

import { PageHeader } from '@/components/page-header';
import { AppearanceSettings } from '@/components/settings/appearance-settings';
import { TaxSettings } from '@/components/settings/tax-settings';
import { CurrencySettings } from '@/components/settings/currency-settings';
import { CompanyDetailsSettings } from '@/components/settings/company-details-settings';
import { SubscriptionPlanSettings } from '@/components/settings/subscription-plan-settings';
import { useAppContext } from '@/components/layout/app-content-wrapper';

export default function SettingsPage() {
  const { userProfile } = useAppContext();
  const isSuperAdmin = userProfile?.role === 'super-admin';

  return (
    <div className="flex flex-col h-full">
      <PageHeader
        title="Application Settings"
        description="Manage appearance, store configurations, and other application preferences."
      />
      <div className="flex-1 p-4 md:p-6 overflow-auto">
        
        {isSuperAdmin && (
          <>
            <SubscriptionPlanSettings />
            <div className="my-8 border-t" />
          </>
        )}

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
