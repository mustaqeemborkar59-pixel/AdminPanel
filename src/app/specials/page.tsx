
import { PageHeader } from '@/components/page-header';
import { SuggestionForm } from '@/components/specials/suggestion-form';

export default function SpecialsPage() {
  return (
    <div className="flex flex-col h-full">
      <PageHeader
        title="AI Special Suggestions"
        description="Generate daily special ideas based on available ingredients and inventory."
      />
      <div className="flex-1 p-4 md:p-6 space-y-6 overflow-auto">
        <SuggestionForm />
      </div>
    </div>
  );
}
