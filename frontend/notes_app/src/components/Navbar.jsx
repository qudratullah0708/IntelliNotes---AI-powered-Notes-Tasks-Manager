import { motion } from 'framer-motion';

const Navbar = () => {
  return (
    <nav className="bg-gradient-to-r from-dark-teal to-deep-teal shadow-xl border-b-4 border-accent-orange">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-5xl font-display font-bold text-white tracking-tight mb-2">
          IntelliNotes
          </h1>
          <p className="text-lg text-accent-yellow font-medium">
            Transform your thoughts into insights with AI-powered summarization
          </p>
        </motion.div>
      </div>
    </nav>
  );
};

export default Navbar;
