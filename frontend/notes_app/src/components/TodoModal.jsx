import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const priorities = ['Urgent', 'High', 'Medium', 'Low'];

const TodoModal = ({ isOpen, onClose, onSave, todo }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [deadline, setDeadline] = useState('');

  useEffect(() => {
    if (todo) {
      setTitle(todo.title);
      setDescription(todo.description || '');
      setPriority(todo.priority || 'Medium');
      setDeadline(todo.deadline ? todo.deadline.slice(0, 16) : '');
    } else {
      setTitle('');
      setDescription('');
      setPriority('Medium');
      setDeadline('');
    }
  }, [todo, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (title.trim()) {
      onSave({ title: title.trim(), description: description.trim(), priority: priority, deadline: deadline });
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
              {todo ? 'Edit Todo' : 'New Todo'}
            </h2>
            <p className="text-accent-yellow mt-1">Manage your tasks and stay organized</p>
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
                  placeholder="Enter todo title..."
                  className="w-full px-6 py-4 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-accent-orange focus:border-accent-orange text-lg transition-all duration-200"
                  autoFocus
                />
              </div>
              <div>
                <label className="block text-lg font-bold text-dark-teal mb-3 font-display">
                  Description (Optional)
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Add details about this task..."
                  rows={8}
                  className="w-full px-6 py-4 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-accent-orange focus:border-accent-orange resize-none text-base leading-relaxed transition-all duration-200"
                />
              </div>
              <div>
                <label className="block text-lg font-bold text-dark-teal mb-3 font-display">
                  Priority
                </label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  className="w-full px-6 py-4 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-accent-orange focus:border-accent-orange text-base transition-all duration-200"
                >
                  {priorities.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-lg font-bold text-dark-teal mb-3 font-display">
                  Deadline (Optional)
                </label>
                <input
                  type="datetime-local"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  className="w-full px-6 py-4 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-accent-orange focus:border-accent-orange text-base transition-all duration-200"
                />
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
              Save Todo
            </motion.button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default TodoModal;

