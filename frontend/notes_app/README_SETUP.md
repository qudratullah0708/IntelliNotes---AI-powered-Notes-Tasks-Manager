# AI Notes - Frontend Setup

## 🎯 Project Overview

A professional, modern note-taking application with AI summarization capabilities using React + TailwindCSS.

## 🚀 Quick Start

### Prerequisites
- Node.js installed
- Backend running on `http://localhost:8000`

### Installation

Dependencies are already installed. To start the development server:

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## 📁 Project Structure

```
src/
├── api.js                    # Axios configuration and API calls
├── components/
│   ├── Navbar.jsx           # Top navigation bar
│   ├── NoteCard.jsx         # Individual note card component
│   ├── NoteModal.jsx        # Modal for creating/editing notes
│   └── Loader.jsx           # Loading spinner
├── pages/
│   └── Home.jsx             # Main notes page
├── App.jsx                  # Root component
└── index.css               # TailwindCSS directives
```

## 🎨 Design Features

- **Minimalist black and white theme** - Clean, modern design
- **Responsive grid layout** - Works on desktop and mobile
- **Smooth animations** - Using Framer Motion
- **Professional styling** - Rounded cards, soft shadows, hover effects
- **Toast notifications** - User feedback for all actions

## 🔌 API Integration

The frontend communicates with the FastAPI backend at `http://localhost:8000`:

- `GET /notes/` - Fetch all notes
- `POST /notes/` - Create new note
- `PUT /notes/{id}` - Update note
- `DELETE /notes/{id}` - Delete note
- `POST /summarize/{id}` - Generate AI summary

## ✨ Features

- ✅ Create, edit, and delete notes
- ✅ AI-powered summarization
- ✅ Smooth expand/collapse animations for summaries
- ✅ Floating "+ Add Note" button
- ✅ Modal-based editing interface
- ✅ Loading states and error handling
- ✅ Confirmation dialogs for deletion

## 🛠️ Technologies Used

- React 19
- TailwindCSS for styling
- Framer Motion for animations
- Axios for API calls
- react-hot-toast for notifications
