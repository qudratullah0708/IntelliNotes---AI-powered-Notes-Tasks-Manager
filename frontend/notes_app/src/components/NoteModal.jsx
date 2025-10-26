import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const categories = ['Work', 'Personal', 'Ideas', 'Tasks', 'Important', 'Study'];

const NoteModal = ({ isOpen, onClose, onSave, note }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  const [customCategory, setCustomCategory] = useState('');
  const [isCustomCategory, setIsCustomCategory] = useState(false);

  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setContent(note.content);
      setCategory(note.category || '');
      setIsCustomCategory(!categories.includes(note.category || ''));
      setCustomCategory(note.category || '');
    } else {
      setTitle('');
      setContent('');
      setCategory('');
      setCustomCategory('');
      setIsCustomCategory(false);
    }
  }, [note, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (title.trim() && content.trim()) {
      const finalCategory = isCustomCategory && customCategory.trim() ? customCategory.trim() : category;
      onSave({ title: title.trim(), content: content.trim(), category: finalCategory });
      setTitle('');
      setContent('');
      setCategory('');
      setCustomCategory('');
      setIsCustomCategory(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/60 backdrop-blur-md"
          onClick={onClose}
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 40 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 40 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="relative bg-white rounded-3xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col border-4 border-accent-orange"
        >
          {/* Header */}
          <div className="px-8 py-6 border-b-4 border-accent-orange bg-gradient-to-r from-dark-teal to-deep-teal">
            <h2 className="text-4xl font-display font-bold text-white">
              {note ? 'Edit Note' : 'New Note'}
            </h2>
            <p className="text-accent-yellow mt-1">Capture your thoughts and ideas</p>
          </div>

          {/* Content */}
          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-8">
            <div className="space-y-6">
              <div>
                <label className="block text-lg font-bold text-dark-teal mb-3 font-display">
                  Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter note title..."
                  className="w-full px-6 py-4 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-accent-orange focus:border-accent-orange text-lg transition-all duration-200"
                  autoFocus
                />
              </div>
              <div>
                <label className="block text-lg font-bold text-dark-teal mb-3 font-display">
                  Content
                </label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Write your thoughts here..."
                  rows={10}
                  className="w-full px-6 py-4 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-accent-orange focus:border-accent-orange resize-none text-base leading-relaxed transition-all duration-200"
                />
              </div>
              <div>
                <label className="block text-lg font-bold text-dark-teal mb-3 font-display">
                  Category
                </label>
                <div className="space-y-3">
                  <select
                    value={isCustomCategory ? 'custom' : category}
                    onChange={(e) => {
                      if (e.target.value === 'custom') {
                        setIsCustomCategory(true);
                        setCategory('');
                      } else {
                        setIsCustomCategory(false);
                        setCategory(e.target.value);
                        setCustomCategory('');
                      }
                    }}
                    className="w-full px-6 py-4 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-accent-orange focus:border-accent-orange text-base transition-all duration-200"
                  >
                    <option value="">Select a category...</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                    <option value="custom">+ Custom Category</option>
                  </select>
                  {isCustomCategory && (
                    <input
                      type="text"
                      value={customCategory}
                      onChange={(e) => setCustomCategory(e.target.value)}
                      placeholder="Enter custom category..."
                      className="w-full px-6 py-4 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-accent-orange focus:border-accent-orange text-base transition-all duration-200"
                    />
                  )}
                </div>
              </div>
            </div>
          </form>

          {/* Footer */}
          <div className="px-8 py-6 border-t-4 border-accent-orange bg-white flex gap-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="button"
              onClick={onClose}
              className="flex-1 px-8 py-4 bg-white border-4 border-muted-teal text-dark-teal rounded-2xl font-bold hover:bg-gray-100 transition-all duration-200 shadow-lg"
            >
              Cancel
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSubmit}
              className="flex-1 px-8 py-4 bg-accent-orange text-white rounded-2xl font-bold hover:bg-accent-yellow transition-all duration-200 shadow-xl"
            >
              Save Note
            </motion.button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default NoteModal;
