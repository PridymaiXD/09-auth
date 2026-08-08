'use client';

import { useQuery } from '@tanstack/react-query';
import { fetchNoteById } from '@/lib/api';
import css from './NoteDetails.module.css';

interface Props {
  id: string;
}

export default function NoteDetailsClient({ id }: Props) {
  const { data: note, isLoading, isError } = useQuery({
    queryKey: ['note', id],
    queryFn: () => fetchNoteById(id),
    refetchOnMount: false,
  });

  if (isLoading) return <p>Loading note details...</p>;
  if (isError || !note) return <p>Error loading note details!</p>;

  return (
    <div className={css.container}>
      <h2>{note.title}</h2>
      <p>{note.content}</p>
      <span>Tag: {note.tag}</span>
      <p className={css.date}>Created at: {note.createdAt}</p>
    </div>
  );
}