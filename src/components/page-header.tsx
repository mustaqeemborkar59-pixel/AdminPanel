
import type { ReactNode } from 'react';

interface PageHeaderProps {
  title: string;
  description?: string;
  actions?: ReactNode;
}

export function PageHeader({ title, description, actions }: PageHeaderProps) {
  return (
    <div className="bg-card/50 border-b p-6 sticky top-16 md:top-0 z-[9]">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-headline text-foreground">{title}</h1>
          {description && <p className="text-sm text-muted-foreground font-body mt-1">{description}</p>}
        </div>
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>
    </div>
  );
}
