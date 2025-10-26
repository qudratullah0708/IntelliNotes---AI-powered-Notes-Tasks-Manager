import { motion } from 'framer-motion';

const Loader = () => {
  return (
    <div className="flex items-center justify-center py-32">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        className="relative"
      >
        <div className="w-20 h-20 border-8 border-gray-100 rounded-full"></div>
        <div className="absolute top-0 left-0 w-20 h-20 border-8 border-transparent border-t-black rounded-full"></div>
      </motion.div>
    </div>
  );
};

export default Loader;
