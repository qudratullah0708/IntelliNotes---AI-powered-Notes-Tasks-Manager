import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

const TodoCard = ({ todo, onEdit, onDelete, onToggle }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const formatDate = (dateString) => {
    if (!dateString) return 'No date';
    const date = new Date(dateString);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
                    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const month = months[date.getMonth()];
    const day = date.getDate();
    const year = date.getFullYear();
    const hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const period = hours >= 12 ? 'PM' : 'AM';
    const displayHour = hours % 12 || 12;
    return `${month} ${day}, ${year}, ${displayHour}:${minutes} ${period}`;
  };
  
  const getTimeRemaining = (deadline) => {
    if (!deadline) return '';
    const now = new Date();
    const due = new Date(deadline);
    const diffMs = due - now;
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffMs < 0) return 'OVERDUE';
    if (diffDays > 0) return `${diffDays} ${diffDays === 1 ? 'day' : 'days'} left`;
    if (diffHours > 0) return `${diffHours} ${diffHours === 1 ? 'hour' : 'hours'} left`;
    if (diffHours === 0) return 'Due soon';
    return '';
  };
  
  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'Urgent': return 'bg-red-500 text-white';
      case 'High': return 'bg-accent-orange text-white';
      case 'Medium': return 'bg-accent-yellow text-dark-teal';
      case 'Low': return 'bg-gray-300 text-gray-700';
      default: return 'bg-gray-300 text-gray-700';
    }
  };
  
  const isOverdue = todo.deadline && new Date(todo.deadline) < new Date() && !todo.completed;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ duration: 0.3 }}
      className={`bg-white rounded-2xl shadow-xl border-2 ${
        todo.completed ? 'border-green-300' : 'border-gray-100'
      } p-8 hover:shadow-2xl hover:border-accent-orange transition-all duration-300 relative`}
    >
      {/* Delete Button - Top Right */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => onDelete(todo.id)}
        className="absolute top-4 right-4 px-3 py-2 bg-red-50 border-2 border-red-300 text-red-600 rounded-lg font-semibold hover:bg-red-100 hover:border-red-400 transition-all duration-200 shadow-sm text-xs"
      >
        Delete
      </motion.button>

      <div className="flex flex-col gap-5">
        {/* Header with title and checkbox */}
        <div className="border-b-2 border-gray-100 pb-4 pr-16">
          <div className="flex items-start justify-between mb-1">
            <div className="flex items-center gap-3 flex-1">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => onToggle(todo.id)}
                className={`w-6 h-6 rounded-lg border-2 ${
                  todo.completed 
                    ? 'bg-green-500 border-green-500' 
                    : 'border-gray-300 hover:border-accent-orange'
                } transition-all duration-200 flex items-center justify-center`}
              >
                {todo.completed && (
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </motion.button>
              <h3 className={`text-2xl font-bold font-display ${
                todo.completed ? 'text-gray-500 line-through' : 'text-dark-teal'
              }`}>
                {todo.title}
              </h3>
            </div>
            {todo.priority && (
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getPriorityColor(todo.priority)}`}>
                {todo.priority}
              </span>
            )}
          </div>
          <p className="text-gray-600 text-sm mb-2">
            Created: {todo.created_at && formatDate(todo.created_at)}
          </p>
          {todo.deadline && (
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`inline-block px-3 py-1.5 rounded-lg text-xs font-bold ${
                isOverdue 
                  ? 'bg-red-500 text-white animate-pulse' 
                  : 'bg-accent-orange/20 text-accent-orange'
              }`}>
                📅 {formatDate(todo.deadline)}
              </span>
              <span className={`text-xs font-bold ${
                isOverdue ? 'text-red-600' : 'text-muted-teal'
              }`}>
                ({getTimeRemaining(todo.deadline)})
              </span>
            </div>
          )}
        </div>

        {/* Description */}
        {todo.description && (
          <div className="min-h-[60px]">
            <p className={`text-gray-700 text-base leading-relaxed ${
              isExpanded ? '' : 'line-clamp-2'
            } ${todo.completed ? 'line-through opacity-50' : ''}`}>
              {todo.description}
            </p>
            {todo.description.length > 100 && (
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="mt-2 text-accent-orange font-semibold hover:text-accent-yellow transition-colors text-sm"
              >
                {isExpanded ? 'Show Less' : 'Show More'}
              </button>
            )}
          </div>
        )}

        {/* Completion Status */}
        {todo.completed && (
          <div className="px-4 py-2 bg-green-50 border-l-4 border-green-500 rounded-xl">
            <p className="text-sm font-semibold text-green-700">✓ Completed</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3 mt-6 pt-6 border-t-2 border-gray-100">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onEdit(todo)}
            className="flex-1 px-5 py-3 bg-accent-orange text-white rounded-lg font-semibold hover:bg-accent-yellow transition-colors duration-200 shadow-md"
          >
            Edit
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onToggle(todo.id)}
            className={`flex-1 px-5 py-3 rounded-lg font-semibold transition-all duration-200 shadow-md ${
              todo.completed
                ? 'bg-muted-teal text-white hover:bg-deep-teal'
                : 'bg-accent-yellow text-dark-teal hover:bg-accent-orange hover:text-white'
            }`}
          >
            {todo.completed ? 'Mark Incomplete' : 'Mark Complete'}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default TodoCard;

