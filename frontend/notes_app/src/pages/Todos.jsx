import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import toast, { Toaster } from 'react-hot-toast';
import TodoCard from '../components/TodoCard';
import TodoModal from '../components/TodoModal';
import Loader from '../components/Loader';
import { todosAPI } from '../api';

const Todos = () => {
  const [todos, setTodos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTodo, setEditingTodo] = useState(null);

  const fetchTodos = async () => {
    try {
      setIsLoading(true);
      const data = await todosAPI.getAllTodos();
      setTodos(data);
    } catch (error) {
      console.error('Error fetching todos:', error);
      toast.error('Failed to fetch todos');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const handleAddTodo = () => {
    setEditingTodo(null);
    setIsModalOpen(true);
  };

  const handleEditTodo = (todo) => {
    setEditingTodo(todo);
    setIsModalOpen(true);
  };

  const handleSaveTodo = async (todoData) => {
    try {
      if (editingTodo) {
        await todosAPI.updateTodo(editingTodo.id, todoData.title, todoData.description, todoData.priority, todoData.deadline);
        toast.success('Todo updated successfully');
      } else {
        await todosAPI.createTodo(todoData.title, todoData.description, todoData.priority, todoData.deadline);
        toast.success('Todo created successfully');
      }
      setIsModalOpen(false);
      fetchTodos();
    } catch (error) {
      console.error('Error saving todo:', error);
      toast.error('Failed to save todo');
    }
  };

  const handleDeleteTodo = async (id) => {
    if (window.confirm('Are you sure you want to delete this todo?')) {
      try {
        await todosAPI.deleteTodo(id);
        toast.success('Todo deleted successfully');
        fetchTodos();
      } catch (error) {
        console.error('Error deleting todo:', error);
        toast.error('Failed to delete todo');
      }
    }
  };

  const handleToggleTodo = async (id) => {
    try {
      await todosAPI.toggleTodo(id);
      fetchTodos();
    } catch (error) {
      console.error('Error toggling todo:', error);
      toast.error('Failed to update todo');
    }
  };

  const sortTodos = (todosList) => {
    const priorityWeight = { Urgent: 4, High: 3, Medium: 2, Low: 1 };
    return [...todosList].sort((a, b) => {
      // Priority first (highest priority first)
      const aPriority = priorityWeight[a.priority] || 2;
      const bPriority = priorityWeight[b.priority] || 2;
      if (aPriority !== bPriority) return bPriority - aPriority;
      
      // Then deadline (soonest first, nulls last)
      if (!a.deadline && !b.deadline) return 0;
      if (!a.deadline) return 1;
      if (!b.deadline) return -1;
      return new Date(a.deadline) - new Date(b.deadline);
    });
  };

  const sortedTodos = sortTodos(todos);
  const incompleteTodos = sortedTodos.filter(todo => !todo.completed);
  const completedTodos = sortedTodos.filter(todo => todo.completed);

  return (
    <div className="min-h-screen">
      <Toaster position="top-right" />
      
      <main className="max-w-7xl mx-auto px-6 py-12">
        {isLoading ? (
          <Loader />
        ) : todos.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-32"
          >
            <div className="w-32 h-32 bg-gradient-to-br from-accent-orange to-accent-yellow rounded-full mb-8 flex items-center justify-center shadow-2xl">
              <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            </div>
            <h2 className="text-4xl font-display font-bold text-dark-teal mb-4">
              No Todos Yet
            </h2>
            <p className="text-xl text-gray-600 mb-8 max-w-md mx-auto">
              Create your first todo and start organizing your tasks
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleAddTodo}
              className="px-8 py-4 bg-accent-orange text-white rounded-2xl font-bold text-lg shadow-xl hover:bg-accent-yellow hover:shadow-2xl transition-all duration-200"
            >
              + Create Your First Todo
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
                  Your Todos
                </h2>
                <p className="text-muted-teal">
                  {incompleteTodos.length} active, {completedTodos.length} completed
                </p>
              </div>
            </motion.div>

            {/* Active Todos */}
            {incompleteTodos.length > 0 && (
              <div className="mb-12">
                <h3 className="text-xl font-bold text-dark-teal mb-6">Active ({incompleteTodos.length})</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {incompleteTodos.map((todo, index) => (
                    <motion.div
                      key={todo.id}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <TodoCard
                        todo={todo}
                        onEdit={handleEditTodo}
                        onDelete={handleDeleteTodo}
                        onToggle={handleToggleTodo}
                      />
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Completed Todos */}
            {completedTodos.length > 0 && (
              <div>
                <h3 className="text-xl font-bold text-gray-500 mb-6">Completed ({completedTodos.length})</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {completedTodos.map((todo, index) => (
                    <motion.div
                      key={todo.id}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <TodoCard
                        todo={todo}
                        onEdit={handleEditTodo}
                        onDelete={handleDeleteTodo}
                        onToggle={handleToggleTodo}
                      />
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Floating Add Button */}
      <motion.button
        initial={{ scale: 0, rotate: 0 }}
        animate={{ scale: 1, rotate: 0 }}
        whileHover={{ scale: 1.15, rotate: 90 }}
        whileTap={{ scale: 0.85 }}
        onClick={handleAddTodo}
        className="fixed bottom-10 right-10 w-20 h-20 bg-accent-orange text-white rounded-full shadow-2xl flex items-center justify-center text-4xl font-bold hover:bg-accent-yellow hover:shadow-3xl transition-all duration-300 border-4 border-white"
      >
        +
      </motion.button>

      {/* Modal */}
      <TodoModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingTodo(null);
        }}
        onSave={handleSaveTodo}
        todo={editingTodo}
      />
    </div>
  );
};

export default Todos;

