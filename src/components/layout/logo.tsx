
import { UtensilsCrossed } from 'lucide-react'; // Default icon
import Link from 'next/link';

// Placeholder for the actual "SW Software Solutions" logo if it's an SVG or image
// For now, using a generic icon and text.
const SWSoftwareSolutionsLogo = () => (
  // Replace this with an <Image /> component if you have an SVG/PNG logo
  <div className="flex items-center gap-2 text-primary">
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-primary">
      <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM16.24 7.76C15.07 6.59 13.53 6 12 6V18C14.05 18 15.92 17.18 17.31 15.79C20.44 12.67 20.44 7.56 17.31 4.43C15.92 3.05 14.05 2.22 12 2.22L12 6C13.53 6 15.07 6.59 16.24 7.76ZM7.76 16.24C6.59 15.07 6 13.53 6 12L18 12C18 14.05 17.18 15.92 15.79 17.31C12.67 20.44 7.56 20.44 4.43 17.31C3.05 15.92 2.22 14.05 2.22 12L6 12C6 13.53 6.59 15.07 7.76 16.24Z" fill="currentColor"/>
    </svg>
    <span className="text-xl font-bold text-foreground">SW Software Solutions</span>
  </div>
);


export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2 text-xl font-semibold font-headline text-primary hover:text-primary/90 transition-colors">
      <SWSoftwareSolutionsLogo />
    </Link>
  );
}
