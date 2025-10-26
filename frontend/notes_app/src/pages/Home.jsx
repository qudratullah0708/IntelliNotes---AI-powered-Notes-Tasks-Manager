import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import toast, { Toaster } from 'react-hot-toast';
import Navbar from '../components/Navbar';
import NoteCard from '../components/NoteCard';
import NoteModal from '../components/NoteModal';
import Loader from '../components/Loader';
import { notesAPI } from '../api';

const Home = () => {
  const [notes, setNotes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState(null);

  const fetchNotes = async () => {
    try {
      setIsLoading(true);
      const data = await notesAPI.getAllNotes();
      setNotes(data);
    } catch (error) {
      console.error('Error fetching notes:', error);
      toast.error('Failed to fetch notes');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const handleAddNote = () => {
    setEditingNote(null);
    setIsModalOpen(true);
  };

  const handleEditNote = (note) => {
    setEditingNote(note);
    setIsModalOpen(true);
  };

  const handleSaveNote = async (noteData) => {
    try {
      if (editingNote) {
        // Update existing note
        await notesAPI.updateNote(editingNote.id, noteData.title, noteData.content, noteData.category);
        toast.success('Note updated successfully');
      } else {
        // Create new note
        await notesAPI.createNote(noteData.title, noteData.content, noteData.category);
        toast.success('Note created successfully');
      }
      setIsModalOpen(false);
      fetchNotes();
    } catch (error) {
      console.error('Error saving note:', error);
      toast.error('Failed to save note');
    }
  };

  const handleDeleteNote = async (id) => {
    if (window.confirm('Are you sure you want to delete this note?')) {
      try {
        await notesAPI.deleteNote(id);
        toast.success('Note deleted successfully');
        fetchNotes();
      } catch (error) {
        console.error('Error deleting note:', error);
        toast.error('Failed to delete note');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-teal/5 via-white to-accent-yellow/5">
      <Toaster position="top-right" />
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-6 py-12">
        {isLoading ? (
          <Loader />
        ) : notes.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-32"
          >
            <div className="w-32 h-32 bg-gradient-to-br from-accent-orange to-accent-yellow rounded-full mb-8 flex items-center justify-center shadow-2xl">
              <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h2 className="text-4xl font-display font-bold text-dark-teal mb-4">
              Start Your Journey
            </h2>
            <p className="text-xl text-gray-600 mb-8 max-w-md mx-auto">
              Create your first AI-powered note and transform your thoughts into actionable insights
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleAddNote}
              className="px-8 py-4 bg-accent-orange text-white rounded-2xl font-bold text-lg shadow-xl hover:bg-accent-yellow hover:shadow-2xl transition-all duration-200"
            >
              + Create Your First Note
            </motion.button>
          </motion.div>
        ) : (
          <div className="mb-8">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center justify-between mb-8"
            >
              <div>
                <h2 className="text-3xl font-display font-bold text-dark-teal mb-2">
                  Your Notes
                </h2>
                <p className="text-muted-teal">{notes.length} note{notes.length !== 1 ? 's' : ''} total</p>
              </div>
            </motion.div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {notes.map((note, index) => (
                <motion.div
                  key={note.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <NoteCard
                    note={note}
                    onEdit={handleEditNote}
                    onDelete={handleDeleteNote}
                  />
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Floating Add Button */}
      <motion.button
        initial={{ scale: 0, rotate: 0 }}
        animate={{ scale: 1, rotate: 0 }}
        whileHover={{ scale: 1.15, rotate: 90 }}
        whileTap={{ scale: 0.85 }}
        onClick={handleAddNote}
        className="fixed bottom-10 right-10 w-20 h-20 bg-accent-orange text-white rounded-full shadow-2xl flex items-center justify-center text-4xl font-bold hover:bg-accent-yellow hover:shadow-3xl transition-all duration-300 border-4 border-white"
      >
        +
      </motion.button>

      {/* Modal */}
      <NoteModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingNote(null);
        }}
        onSave={handleSaveNote}
        note={editingNote}
      />
    </div>
  );
};

export default Home;
