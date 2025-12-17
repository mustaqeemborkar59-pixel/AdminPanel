
import Link from 'next/link';

export function Logo() {
  return (
    <Link
      href="/"
      className="flex items-center text-xl font-semibold font-headline hover:text-primary/90 transition-colors"
    >
      <span className="whitespace-nowrap flex items-baseline gap-x-1">
        <span className="text-foreground">Yasir Sofware</span>
        <span className="text-primary text-lg">Solutions</span>
      </span>
    </Link>
  );
}
