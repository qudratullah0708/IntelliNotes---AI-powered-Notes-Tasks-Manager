# TaskFlow Pro - AI-Powered Notes & Task Management System

A modern, full-stack application for managing notes and todos with AI-powered summarization and text-to-speech capabilities.

## 🎯 Features

### Notes Management
- ✅ Create, read, update, and delete notes
- ✅ AI-powered summarization using Google Gemini
- ✅ Text-to-speech (TTS) with gTTS integration
- ✅ Category organization
- ✅ Timestamp tracking with professional date formatting
- ✅ Full-text search and expand/collapse for long content

### Todo Management
- ✅ Priority-based task organization (Urgent, High, Medium, Low)
- ✅ Deadline tracking with overdue indicators
- ✅ Completion status toggle
- ✅ Smart sorting: Priority first, then by deadline
- ✅ Visual priority badges with color coding
- ✅ Description and optional categories

### UI/UX
- 🎨 Professional ORANGE DRIP color scheme
- 🎨 Modern, minimalist design with smooth animations
- 🎨 Responsive grid layout (desktop & mobile)
- 🎨 Framer Motion animations for transitions
- 🎨 Toast notifications for user feedback
- 🎨 Interactive hover effects and shadows

## 🛠️ Tech Stack

### Backend
- **FastAPI** - Modern Python web framework
- **SQLAlchemy** - ORM for database management
- **SQLite** - Lightweight database
- **Google Gemini AI** - Text summarization
- **gTTS** - Text-to-speech functionality

### Frontend
- **React 19** - UI framework
- **TailwindCSS** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **React Hot Toast** - Toast notifications
- **Google Fonts** - Inter & Space Grotesk

## 📁 Project Structure

```
notes_app/
├── backend/
│   ├── main.py           # FastAPI application with CRUD endpoints
│   ├── models.py         # SQLAlchemy models (Note, Todo)
│   ├── database.py       # Database configuration
│   ├── ai_utils.py       # AI summarization logic
│   └── requirements.txt  # Python dependencies
│
└── frontend/notes_app/
    ├── src/
    │   ├── components/
    │   │   ├── Navbar.jsx       # Navigation bar
    │   │   ├── NoteCard.jsx     # Note display card
    │   │   ├── NoteModal.jsx    # Note create/edit modal
    │   │   ├── TodoCard.jsx     # Todo display card
    │   │   ├── TodoModal.jsx    # Todo create/edit modal
    │   │   └── Loader.jsx       # Loading spinner
    │   ├── pages/
    │   │   ├── Home.jsx         # Notes page
    │   │   └── Todos.jsx        # Todos page
    │   ├── api.js               # API integration layer
    │   ├── App.jsx              # Root component with routing
    │   └── main.jsx             # Application entry point
    ├── tailwind.config.js       # Tailwind configuration
    └── vite.config.js          # Vite configuration
```

## 🚀 Getting Started

### Prerequisites
- Python 3.8+
- Node.js 18+
- npm or yarn

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Create virtual environment (optional but recommended):
```bash
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Set up environment variables:
```bash
# Create .env file (optional, can also use system environment)
export GEMINI_API_KEY="your_api_key_here"
```

5. Start the backend server:
```bash
uvicorn main:app --reload
```

Backend will run on `http://localhost:8000`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend/notes_app
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

Frontend will run on `http://localhost:5174`

## 📋 API Endpoints

### Notes
- `GET /notes/` - Get all notes
- `POST /notes/` - Create a new note (params: title, content, category)
- `PUT /notes/{id}` - Update a note (params: title, content, category)
- `DELETE /notes/{id}` - Delete a note
- `POST /summarize/{id}` - Generate AI summary for a note
- `POST /speak/{id}` - Generate TTS audio for a note

### Todos
- `GET /todos/` - Get all todos
- `POST /todos/` - Create a new todo (params: title, description, category (priority), deadline)
- `GET /todos/{id}` - Get a single todo
- `PUT /todos/{id}` - Update a todo (params: title, description, category, deadline)
- `DELETE /todos/{id}` - Delete a todo
- `PATCH /todos/{id}/toggle` - Toggle completion status

## 🎨 Design System

### Color Palette (ORANGE DRIP)
- **Dark Teal** (#051821) - Headers, primary text
- **Deep Teal** (#1A4645) - Secondary backgrounds
- **Muted Teal** (#266867) - Borders, accents
- **Vibrant Orange** (#F58800) - Primary actions, highlights
- **Golden Yellow** (#F8BC24) - Hover states, accents

### Priority Colors
- **Urgent** - Red badge (bg-red-500)
- **High** - Orange badge (bg-accent-orange)
- **Medium** - Yellow badge (bg-accent-yellow)
- **Low** - Gray badge (bg-gray-300)

### Typography
- **Display Font**: Space Grotesk (Headings)
- **Body Font**: Inter (Content)

## 🧩 Key Features Explained

### AI Summarization
- Uses Google Gemini 2.5 Flash model
- Converts note content into concise summaries
- Summaries expand/collapse with smooth animations

### Text-to-Speech
- Uses Google Text-to-Speech (gTTS)
- Plays audio directly in browser (no downloads)
- Shows "Playing..." state during audio playback

### Smart Sorting (Todos)
1. **Priority First**: Urgent → High → Medium → Low
2. **Deadline Second**: Soonest deadlines first
3. **Null Handling**: Todos without deadlines appear last within priority

### Date Formatting
- Format: `Apr 10, 2025, 10:20 AM`
- Includes minutes for precision
- Applied consistently across notes and todos
- Shows both created timestamp and deadline

## 🔧 Configuration

### Backend Port
Default: `http://localhost:8000`
Configure in `uvicorn` command or via environment variables.

### Frontend Port
Configured in `vite.config.js`:
```javascript
server: {
  port: 5174,
  strictPort: true
}
```

### CORS
Backend allows requests from `http://localhost:5174`

## 📝 Database Schema

### Notes Table
- `id` - Integer (Primary Key)
- `title` - String (Required)
- `content` - String (Required)
- `summary` - String (Nullable)
- `category` - String (Nullable)
- `created_at` - DateTime (Auto-generated)

### Todos Table
- `id` - Integer (Primary Key)
- `title` - String (Required)
- `description` - String (Nullable)
- `completed` - Boolean (Default: False)
- `category` - String (Stores priority: Urgent/High/Medium/Low)
- `created_at` - DateTime (Auto-generated)
- `deadline` - DateTime (Nullable)

## 🎓 Learning Resources

### Key Concepts Demonstrated
- **Full-Stack Development**: Separate frontend/backend with API integration
- **Database Migrations**: Adding columns without losing data using ALTER TABLE
- **CRUD Operations**: Create, Read, Update, Delete for both resources
- **State Management**: React hooks for component state
- **API Design**: RESTful endpoints with FastAPI
- **Responsive Design**: TailwindCSS utility classes
- **Modern React**: Hooks, functional components, router
- **Third-Party APIs**: Gemini AI and gTTS integration

### Why This Architecture?
- **SQLite**: Simple, no server needed, perfect for development
- **FastAPI**: Fast, modern, automatic API docs
- **React**: Component-based, reusable UI
- **TailwindCSS**: Rapid styling without custom CSS
- **Framer Motion**: Smooth, professional animations

## 🐛 Troubleshooting

### Backend Issues
- **Database not found**: Delete `notes.db` to recreate schema
- **Import errors**: Ensure all requirements installed
- **CORS errors**: Check `allow_origins` in CORS middleware

### Frontend Issues
- **Styles not loading**: Restart dev server after Tailwind changes
- **API errors**: Verify backend is running on correct port
- **Animations not working**: Check Framer Motion is installed

## 📄 License

MIT License - Feel free to use this project for learning or commercial purposes.

## 🤝 Contributing

Contributions welcome! This is a learning project, so any improvements are appreciated.

---

**Built with ❤️ using FastAPI, React, and modern web technologies**
