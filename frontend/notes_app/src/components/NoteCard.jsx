import { useState, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { notesAPI } from '../api';

const NoteCard = ({ note, onEdit, onDelete }) => {
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [summary, setSummary] = useState(note.summary);
  const [isSummaryVisible, setIsSummaryVisible] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const audioRef = useRef(null);

  const handleSummarize = async () => {
    setIsSummarizing(true);
    try {
      const response = await notesAPI.summarizeNote(note.id);
      setSummary(response.summary);
      setIsSummaryVisible(true);
    } catch (error) {
      console.error('Error summarizing note:', error);
    } finally {
      setIsSummarizing(false);
    }
  };

  const handleSpeak = async () => {
    setIsSpeaking(true);
    try {
      const audioBlob = await notesAPI.speakNote(note.id);
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      audioRef.current = audio;
      
      audio.play().catch(err => console.error('Error playing audio:', err));
      
      audio.onended = () => {
        setIsSpeaking(false);
        URL.revokeObjectURL(audioUrl);
      };
      
      audio.onerror = () => {
        setIsSpeaking(false);
        URL.revokeObjectURL(audioUrl);
      };
    } catch (error) {
      console.error('Error speaking note:', error);
      setIsSpeaking(false);
    }
  };

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

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-2xl shadow-xl border-2 border-gray-100 p-8 hover:shadow-2xl hover:border-accent-orange transition-all duration-300 relative"
    >
      {/* Delete Button - Top Right */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => onDelete(note.id)}
        className="absolute top-4 right-4 px-3 py-2 bg-red-50 border-2 border-red-300 text-red-600 rounded-lg font-semibold hover:bg-red-100 hover:border-red-400 transition-all duration-200 shadow-sm text-xs"
      >
        Delete
      </motion.button>

      <div className="flex flex-col gap-5">
        {/* Header with title */}
        <div className="border-b-2 border-gray-100 pb-4 pr-16">
          <div className="flex items-start justify-between mb-1">
            <h3 className="text-2xl font-bold text-dark-teal font-display">{note.title}</h3>
            {note.category && (
              <span className="px-3 py-1 bg-accent-orange/10 text-accent-orange rounded-full text-xs font-semibold">
                {note.category}
              </span>
            )}
          </div>
          <p className="text-gray-600 text-sm">
            Created: {note.created_at ? formatDate(note.created_at) : 'No date'}
          </p>
        </div>

        {/* Content */}
        <div className="min-h-[80px]">
          <p className={`text-gray-700 text-base leading-relaxed ${isExpanded ? '' : 'line-clamp-4'}`}>
            {note.content}
          </p>
          {note.content.length > 150 && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="mt-2 text-accent-orange font-semibold hover:text-accent-yellow transition-colors text-sm"
            >
              {isExpanded ? 'Show Less' : 'Show Full'}
            </button>
          )}
        </div>

        {/* Summary Section */}
        {summary && isSummaryVisible && (
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0, height: 0, marginTop: 0 }}
              animate={{ opacity: 1, height: 'auto', marginTop: 16 }}
              exit={{ opacity: 0, height: 0, marginTop: 0 }}
              className="p-5 bg-gradient-to-r from-accent-yellow/10 to-accent-orange/5 rounded-xl border-2 border-accent-orange/30"
            >
              <div className="flex items-start gap-2 mb-2">
                <span className="text-xs font-bold text-accent-orange uppercase tracking-wide">Summary</span>
              </div>
              <p className="text-sm font-medium text-gray-800 leading-relaxed">{summary}</p>
            </motion.div>
          </AnimatePresence>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3 mt-6 pt-6 border-t-2 border-gray-100">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onEdit(note)}
            className="flex-1 px-5 py-3 bg-accent-orange text-white rounded-lg font-semibold hover:bg-accent-yellow transition-colors duration-200 shadow-md"
          >
            Edit
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSummarize}
            disabled={isSummarizing}
            className="flex-1 px-5 py-3 bg-deep-teal text-black rounded-lg font-semibold hover:bg-muted-teal transition-all duration-200 disabled:opacity-50 shadow-md border-2 border-deep-teal"
          >
            {isSummarizing ? 'Processing...' : 'Summarize with AI'}
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSpeak}
            disabled={isSpeaking}
            className="flex-1 px-5 py-3 bg-accent-yellow text-dark-teal rounded-lg font-semibold hover:bg-accent-orange hover:text-white transition-all duration-200 disabled:opacity-50 shadow-md"
          >
            {isSpeaking ? 'Playing...' : 'Listen'}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default NoteCard;
