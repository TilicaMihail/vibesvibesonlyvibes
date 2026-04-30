'use client';
import { useState, useEffect } from 'react';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import type { Course, CourseVisibility } from '@/types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: { title: string; description: string; visibility: CourseVisibility }) => void;
  initialData?: Partial<Course>;
  mode: 'create' | 'edit';
  isLoading?: boolean;
}

export default function CourseFormModal({ isOpen, onClose, onSave, initialData, mode, isLoading }: Props) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [visibility, setVisibility] = useState<CourseVisibility>('PRIVATE');
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isOpen) {
      setTitle(initialData?.title ?? '');
      setDescription(initialData?.description ?? '');
      setVisibility(initialData?.visibility ?? 'PRIVATE');
      setErrors({});
    }
  }, [isOpen, initialData]);

  function validate() {
    const e: Record<string, string> = {};
    if (!title.trim()) e.title = 'Title is required';
    if (!description.trim()) e.description = 'Description is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleSubmit() {
    if (validate()) onSave({ title: title.trim(), description: description.trim(), visibility });
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={mode === 'create' ? 'Create Course' : 'Edit Course'} size="md">
      <div className="space-y-4">
        <Input label="Course Title" value={title} onChange={e => setTitle(e.target.value)} error={errors.title} placeholder="e.g. Introduction to JavaScript" />
        <div>
          <label className="block text-sm font-medium mb-1 text-on-surface-muted">Description</label>
          <textarea
            className="w-full border border-surface-border rounded-lg px-3 py-2 text-sm text-on-surface placeholder-brand-light focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand resize-none"
            rows={4}
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="What will students learn in this course?"
          />
          {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 text-on-surface-muted">Visibility</label>
          <select
            className="w-full border border-surface-border rounded-lg px-3 py-2 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand bg-surface-raised"
            value={visibility}
            onChange={e => setVisibility(e.target.value as CourseVisibility)}
          >
            <option value="PRIVATE">Private — only you can see it</option>
            <option value="PUBLIC">Public — all students in org</option>
          </select>
        </div>
        <div className="flex justify-end gap-3 pt-2">
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button variant="primary" onClick={handleSubmit} isLoading={isLoading}>
            {mode === 'create' ? 'Create Course' : 'Save Changes'}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
