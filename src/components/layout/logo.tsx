
import { UtensilsCrossed } from 'lucide-react';
import Link from 'next/link';

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2 text-xl font-semibold font-headline text-primary hover:text-primary/90 transition-colors">
      <UtensilsCrossed className="h-7 w-7" />
      <span>GastroFlow</span>
    </Link>
  );
}
