import type { Metadata } from 'next';
import { fetchNoteById } from '@/lib/api/serverApi';
import { QueryClient, HydrationBoundary, dehydrate } from '@tanstack/react-query';
import NoteDetailsClient from './NoteDetails.client'; 

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  try {
    const note = await fetchNoteById(id);
    return {
      title: `${note.title} | NoteHub`,
      description: note.content.slice(0, 160),
      openGraph: {
        title: `${note.title} | NoteHub`,
        description: note.content.slice(0, 160),
        url: `https://notehub.com/notes/${id}`,
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
  } catch {
    return {
      title: 'Note Details | NoteHub',
      description: 'View details of your note.',
    };
  }
}

export default async function NotePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ['note', id],
    queryFn: () => fetchNoteById(id),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NoteDetailsClient id={id} />
    </HydrationBoundary>
  );
}