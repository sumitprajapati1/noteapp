'use client';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

const noteSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title must be less than 100 characters'),
  content: z.string().min(1, 'Content is required'),
});

interface CreateNoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (title: string, content: string) => Promise<void>;
}

export const CreateNoteModal: React.FC<CreateNoteModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm({
    resolver: zodResolver(noteSchema),
    defaultValues: {
      title: '',
      content: '',
    },
  });

  const handleSubmit = async (data: { title: string; content: string }) => {
    setIsLoading(true);
    try {
      await onSubmit(data.title, data.content);
      form.reset();
      onClose();
    } catch (error) {
      // Error handling is done in parent component
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold">Create New Note</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        <form onSubmit={form.handleSubmit(handleSubmit)} className="p-6 space-y-4">
          <Input
            id="title"
            label="Title"
            placeholder="Enter note title"
            {...form.register('title')}
            error={form.formState.errors.title?.message}
          />

          <div className="space-y-2">
            <label htmlFor="content" className="block text-sm font-medium text-gray-700">
              Content
            </label>
            <textarea
              id="content"
              rows={6}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm resize-none"
              placeholder="Write your note here..."
              {...form.register('content')}
            />
            {form.formState.errors.content && (
              <p className="text-sm text-red-600">{form.formState.errors.content.message}</p>
            )}
          </div>

          <div className="flex space-x-3 pt-4">
            <Button
              type="submit"
              className="flex-1"
              isLoading={isLoading}
            >
              Create Note
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};