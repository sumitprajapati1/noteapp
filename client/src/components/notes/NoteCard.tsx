import React from 'react';
import { Trash2 } from 'lucide-react';
import { Note } from '@/types';
import { Button } from '@/components/ui/Button';

interface NoteCardProps {
  note: Note;
  onDelete: (id: string) => void;
}

export const NoteCard: React.FC<NoteCardProps> = ({ note, onDelete }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-semibold text-gray-900 truncate">
          {note.title}
        </h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onDelete(note._id)}
          className="text-red-500 hover:text-red-700 hover:bg-red-50"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
      
      <p className="text-gray-700 mb-4 line-clamp-3">
        {note.content}
      </p>
      
      <p className="text-sm text-gray-500">
        {formatDate(note.createdAt)}
      </p>
    </div>
  );
};