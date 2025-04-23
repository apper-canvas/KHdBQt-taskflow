import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import MainFeature from "../components/MainFeature";

const Home = () => {
  const [stats, setStats] = useState({
    completed: 0,
    pending: 0,
    total: 0
  });

  // Update stats when tasks change
  const updateStats = (tasks) => {
    const completed = tasks.filter(task => task.completed).length;
    const pending = tasks.length - completed;
    
    setStats({
      completed,
      pending,
      total: tasks.length
    });
  };

  // Load tasks from localStorage on initial render
  useEffect(() => {
    const savedTasks = localStorage.getItem("tasks");
    if (savedTasks) {
      updateStats(JSON.parse(savedTasks));
    }
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h1 className="text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Organize Your Day
        </h1>
        <p className="text-surface-600 dark:text-surface-300 text-lg">
          Manage your tasks efficiently and boost your productivity
        </p>
      </motion.div>

      {stats.total > 0 && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
        >
          <div className="card p-6 flex flex-col items-center">
            <span className="text-4xl font-bold text-primary mb-2">{stats.total}</span>
            <span className="text-surface-500 dark:text-surface-400">Total Tasks</span>
          </div>
          
          <div className="card p-6 flex flex-col items-center">
            <span className="text-4xl font-bold text-secondary mb-2">{stats.completed}</span>
            <span className="text-surface-500 dark:text-surface-400">Completed</span>
          </div>
          
          <div className="card p-6 flex flex-col items-center">
            <span className="text-4xl font-bold text-accent mb-2">{stats.pending}</span>
            <span className="text-surface-500 dark:text-surface-400">Pending</span>
          </div>
        </motion.div>
      )}

      <MainFeature onTasksChange={updateStats} />
    </div>
  );
};

export default Home;