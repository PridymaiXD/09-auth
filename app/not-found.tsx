import css from './not-found.module.css';
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: '404 - Page not found | NoteHub',
  description: 'Sorry, the page you are looking for does not exist.',
  openGraph: {
    title: '404 - Page not found | NoteHub',
    description: 'Sorry, the page you are looking for does not exist.',
    url: 'https://notehub.com/not-found',
    images: [
      {
        url: 'https://ac.goit.global/fullstack/react/notehub-og-meta.jpg',
        width: 1200,
        height: 630,
        alt: 'NoteHub Cover',
      },
    ],
  },
};

export default function NotFound() {
  return (
    <div>
      <h1>404 - Page Not Found</h1>
      <Link href="/notes/filter/all">Go to Notes</Link>
    </div>
  );
}