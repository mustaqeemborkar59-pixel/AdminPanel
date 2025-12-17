
import Link from 'next/link';

export function Logo() {
  return (
    <Link
      href="/"
      className="flex items-center text-xl font-semibold font-headline text-primary hover:text-primary/90 transition-colors"
    >
      <span className="font-bold text-foreground whitespace-nowrap">Yasir Sofware Solutions</span>
    </Link>
  );
}
