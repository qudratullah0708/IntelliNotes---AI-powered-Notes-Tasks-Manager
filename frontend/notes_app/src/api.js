import axios from 'axios';

const API_URL = 'http://localhost:8000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const notesAPI = {
  // Get all notes
  getAllNotes: async () => {
    const response = await api.get('/notes/');
    return response.data;
  },

  // Create a new note
  createNote: async (title, content, category = null) => {
    const response = await api.post('/notes/', null, {
      params: { title, content, category },
    });
    return response.data;
  },

  // Update a note
  updateNote: async (id, title, content, category = null) => {
    const response = await api.put(`/notes/${id}`, null, {
      params: { title, content, category },
    });
    return response.data;
  },

  // Delete a note
  deleteNote: async (id) => {
    const response = await api.delete(`/notes/${id}`);
    return response.data;
  },

  // Summarize a note
  summarizeNote: async (id) => {
    const response = await api.post(`/summarize/${id}`);
    return response.data;
  },

  // Speak a note (get audio URL)
  speakNote: async (id) => {
    const response = await api.post(`/speak/${id}`, {}, {
      responseType: 'blob',
    });
    return response.data;
  },
};

export const todosAPI = {
  // Get all todos
  getAllTodos: async () => {
    const response = await api.get('/todos/');
    return response.data;
  },

  // Create a new todo
  createTodo: async (title, description = null, priority = null, deadline = null) => {
    const response = await api.post('/todos/', null, {
      params: { title, description, priority, deadline },
    });
    return response.data;
  },

  // Get a single todo
  getTodo: async (id) => {
    const response = await api.get(`/todos/${id}`);
    return response.data;
  },

  // Update a todo
  updateTodo: async (id, title = null, description = null, priority = null, deadline = null) => {
    const response = await api.put(`/todos/${id}`, null, {
      params: { title, description, priority, deadline },
    });
    return response.data;
  },

  // Delete a todo
  deleteTodo: async (id) => {
    const response = await api.delete(`/todos/${id}`);
    return response.data;
  },

  // Toggle todo completion status
  toggleTodo: async (id) => {
    const response = await api.patch(`/todos/${id}/toggle`);
    return response.data;
  },
};

export default api;
