
import Link from 'next/link';

export function Logo() {
  return (
    <Link
      href="/"
      className="flex items-center text-xl font-semibold font-headline hover:text-primary/90 transition-colors"
    >
      <span className="whitespace-nowrap">
        <span className="text-foreground">Yasir Sofware </span>
        <span className="text-primary">Solutions</span>
      </span>
    </Link>
  );
}
