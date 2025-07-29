'use client';
import React, { useState, useEffect } from 'react';
import { Plus, LogOut, User, FileText } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/Button';
import { NoteCard } from '@/components/notes/NoteCard';
import { CreateNoteModal } from '@/components/notes/CreateNoteModal';
import { notesAPI } from '@/lib/api';
import { Note } from '@/types';

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [notes, setNotes] = useState<Note[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      const response = await notesAPI.getNotes();
      setNotes(response.data);
    } catch (error: any) {
      toast.error('Failed to fetch notes');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateNote = async (title: string, content: string) => {
    try {
      const response = await notesAPI.createNote(title, content);
      setNotes([response.data, ...notes]);
      toast.success('Note created successfully!');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to create note');
      throw error;
    }
  };

  const handleDeleteNote = async (id: string) => {
    if (!confirm('Are you sure you want to delete this note?')) {
      return;
    }

    try {
      await notesAPI.deleteNote(id);
      setNotes(notes.filter(note => note._id !== id));
      toast.success('Note deleted successfully!');
    } catch (error: any) {
      toast.error('Failed to delete note');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <FileText className="w-8 h-8 text-blue-600 mr-3" />
              <h1 className="text-xl font-semibold text-gray-900">Notes App</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-gray-700">
                <User className="w-4 h-4" />
                <span>Welcome, {user?.name}!</span>
              </div>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={logout}
                className="text-gray-500 hover:text-gray-700"
              >
                <LogOut className="w-4 h-4 mr-1" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Welcome back, {user?.name}!
              </h2>
              <p className="text-gray-600">
                You have {notes.length} {notes.length === 1 ? 'note' : 'notes'} saved.
              </p>
            </div>
            
            <Button
              onClick={() => setIsCreateModalOpen(true)}
              className="flex items-center"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Note
            </Button>
          </div>
        </div>

        {/* Notes Grid */}
        {notes.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No notes yet</h3>
            <p className="text-gray-500 mb-6">Get started by creating your first note.</p>
            <Button
              onClick={() => setIsCreateModalOpen(true)}
              className="inline-flex items-center"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Your First Note
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {notes.map((note) => (
              <NoteCard
                key={note._id}
                note={note}
                onDelete={handleDeleteNote}
              />
            ))}
          </div>
        )}
      </main>

      {/* Create Note Modal */}
      <CreateNoteModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateNote}
      />
    </div>
  );
};

export default Dashboard;