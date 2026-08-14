import type { Metadata } from 'next';
import NotesClient from './Notes.client';

interface Props {
  params: Promise<{ slug?: string[] }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const tag = resolvedParams.slug?.[0] || 'all';
  const capitalizedTag = tag.charAt(0).toUpperCase() + tag.slice(1);

  return {
    title: `Notes: ${capitalizedTag} | NoteHub`,
    description: `Filter and manage notes tagged with ${capitalizedTag}.`,
    openGraph: {
      title: `Notes: ${capitalizedTag} | NoteHub`,
      description: `Filter and manage notes tagged with ${capitalizedTag}.`,
      url: `https://notehub.com/notes/filter/${tag}`,
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
}

export default async function NotesPage({ params }: Props) {
  const resolvedParams = await params;
  const tag = resolvedParams.slug?.[0] || 'all';

  return <NotesClient tag={tag} />;
}