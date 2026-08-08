'use client';

import { useQuery } from '@tanstack/react-query';
import { fetchNoteById } from '@/lib/api';
import { useRouter } from 'next/navigation';
import Modal from '@/components/Modal/Modal';
import css from './NotePreview.module.css';

interface Props {
  id: string;
}

export default function NotePreviewClient({ id }: Props) {
  const router = useRouter();
  const { data: note, isLoading, isError } = useQuery({
    queryKey: ['note', id],
    queryFn: () => fetchNoteById(id),
    refetchOnMount: false,
  });

  const handleClose = () => {
    router.back(); 
  };

  if (isLoading) return null;
  if (isError || !note) return null;

  return (
    <Modal onClose={handleClose}>
      <div className={css.container}>
        <h2>{note.title}</h2>
        <p>{note.content}</p>
        <span>Tag: {note.tag}</span>
        <p className={css.date}>Created at: {note.createdAt}</p>
        <button onClick={handleClose}>Close</button>
      </div>
    </Modal>
  );
}