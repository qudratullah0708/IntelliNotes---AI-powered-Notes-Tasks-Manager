import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import Todos from './pages/Todos';
import Navbar from './components/Navbar';
import './App.css';

function Navigation() {
  const location = useLocation();

  return (
    <div className="bg-gradient-to-r from-dark-teal to-deep-teal shadow-xl border-b-4 border-accent-orange">
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="flex items-center justify-between">
          <h1 className="text-4xl font-display font-bold text-white tracking-tight">
            Intelli Notes - Task Manager
          </h1>
          <nav className="flex gap-4">
            <Link
              to="/"
              className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
                location.pathname === '/'
                  ? 'bg-accent-orange text-white shadow-lg'
                  : 'bg-white/10 text-accent-yellow hover:bg-white/20'
              }`}
            >
              Notes
            </Link>
            <Link
              to="/todos"
              className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
                location.pathname === '/todos'
                  ? 'bg-accent-orange text-white shadow-lg'
                  : 'bg-white/10 text-accent-yellow hover:bg-white/20'
              }`}
            >
              Todos
            </Link>
          </nav>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gradient-to-br from-dark-teal/5 via-white to-accent-yellow/5">
        <Navigation />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/todos" element={<Todos />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;