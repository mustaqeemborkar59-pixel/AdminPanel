
import type { ReactNode } from 'react';

interface PageHeaderProps {
  title: string;
  description?: string;
  actions?: ReactNode;
}

export function PageHeader({ title, description, actions }: PageHeaderProps) {
  return (
    <div className="bg-transparent p-4 md:p-6 sticky top-16 md:top-0 z-[9]"> {/* Changed background to transparent, adjusted padding slightly */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-2"> {/* Allow stacking on mobile */}
        <div>
          <h1 className="text-2xl lg:text-3xl font-headline text-foreground">{title}</h1>
          {description && <p className="text-sm text-muted-foreground font-body mt-1">{description}</p>}
        </div>
        {actions && <div className="flex items-center gap-2 mt-2 md:mt-0">{actions}</div>}
      </div>
    </div>
  );
}
