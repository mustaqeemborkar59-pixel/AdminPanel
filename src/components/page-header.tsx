
import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface PageHeaderProps {
  title: string;
  description?: string;
  actions?: ReactNode;
  className?: string;
}

export function PageHeader({ title, description, actions, className }: PageHeaderProps) {
  return (
    // Removed sticky and z-index to simplify, background is handled by parent or global styles.
    // Added specific padding that matches the image more closely.
    <div className={cn("bg-background p-4 md:px-6 md:py-5 border-b", className)}>
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-2">
        <div>
          <h1 className="text-xl lg:text-2xl font-semibold text-foreground">{title}</h1>
          {description && <p className="text-sm text-muted-foreground mt-1">{description}</p>}
        </div>
        {actions && <div className="flex items-center gap-2 mt-2 md:mt-0">{actions}</div>}
      </div>
    </div>
  );
}
