'use client';

import { ChangeEvent, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { createNote } from '@/lib/api';
import { useNoteStore } from '@/lib/store/noteStore';
import css from './NoteForm.module.css';

export default function NoteForm() {
  const router = RouterHook();
  const queryClient = useQueryClient();
  const { draft, setDraft, clearDraft } = useNoteStore();

  const mutation = useMutation({
    mutationFn: createNote,
    onSuccess: () => {
      clearDraft();
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      router.push('/notes/filter/all');
    },
  });

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setDraft({ [name]: value });
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!draft.title.trim()) return;
    mutation.mutate(draft);
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <form className={css.form} onSubmit={handleSubmit}>
      <div className={css.field}>
        <label htmlFor="title">Title</label>
        <input
          id="title"
          type="text"
          name="title"
          value={draft.title}
          onChange={handleChange}
          required
        />
      </div>

      <div className={css.field}>
        <label htmlFor="content">Content</label>
        <textarea
          id="content"
          name="content"
          value={draft.content}
          onChange={handleChange}
          rows={5}
        />
      </div>

      <div className={css.field}>
        <label htmlFor="tag">Tag</label>
        <select
          id="tag"
          name="tag"
          value={draft.tag}
          onChange={handleChange}
        >
          <option value="Todo">Todo</option>
          <option value="Work">Work</option>
          <option value="Personal">Personal</option>
          <option value="Meeting">Meeting</option>
          <option value="Shopping">Shopping</option>
        </select>
      </div>

      <div className={css.buttons}>
        <button type="button" onClick={handleCancel} className={css.cancelBtn}>
          Cancel
        </button>
        <button type="submit" disabled={mutation.isPending} className={css.submitBtn}>
          {mutation.isPending ? 'Creating...' : 'Create Note'}
        </button>
      </div>
    </form>
  );
}

function RouterHook() {
  return useRouter();
}