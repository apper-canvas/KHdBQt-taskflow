import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  PlusCircle, 
  Check, 
  X, 
  Trash2, 
  Edit, 
  Calendar, 
  Clock, 
  AlertCircle, 
  ChevronDown, 
  ChevronUp 
} from "lucide-react";
import { format } from "date-fns";

const MainFeature = ({ onTasksChange }) => {
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem("tasks");
    return savedTasks ? JSON.parse(savedTasks) : [];
  });
  
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    dueDate: "",
    priority: "medium"
  });
  
  const [editingTask, setEditingTask] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortDirection, setSortDirection] = useState("desc");
  const [filter, setFilter] = useState("all");
  
  // Save tasks to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
    if (onTasksChange) {
      onTasksChange(tasks);
    }
  }, [tasks, onTasksChange]);
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTask(prev => ({ ...prev, [name]: value }));
  };
  
  const handleAddTask = (e) => {
    e.preventDefault();
    
    if (!newTask.title.trim()) return;
    
    const task = {
      id: Date.now().toString(),
      title: newTask.title.trim(),
      description: newTask.description.trim(),
      dueDate: newTask.dueDate,
      priority: newTask.priority,
      completed: false,
      createdAt: new Date().toISOString()
    };
    
    setTasks(prev => [task, ...prev]);
    setNewTask({
      title: "",
      description: "",
      dueDate: "",
      priority: "medium"
    });
    setIsFormOpen(false);
  };
  
  const handleEditTask = (task) => {
    setEditingTask(task);
    setNewTask({
      title: task.title,
      description: task.description || "",
      dueDate: task.dueDate || "",
      priority: task.priority || "medium"
    });
    setIsFormOpen(true);
  };
  
  const handleUpdateTask = (e) => {
    e.preventDefault();
    
    if (!newTask.title.trim()) return;
    
    setTasks(prev => 
      prev.map(task => 
        task.id === editingTask.id 
          ? { 
              ...task, 
              title: newTask.title.trim(),
              description: newTask.description.trim(),
              dueDate: newTask.dueDate,
              priority: newTask.priority,
              updatedAt: new Date().toISOString()
            } 
          : task
      )
    );
    
    setNewTask({
      title: "",
      description: "",
      dueDate: "",
      priority: "medium"
    });
    setEditingTask(null);
    setIsFormOpen(false);
  };
  
  const handleToggleComplete = (id) => {
    setTasks(prev => 
      prev.map(task => 
        task.id === id 
          ? { 
              ...task, 
              completed: !task.completed,
              completedAt: !task.completed ? new Date().toISOString() : null
            } 
          : task
      )
    );
  };
  
  const handleDeleteTask = (id) => {
    setTasks(prev => prev.filter(task => task.id !== id));
  };
  
  const handleCancelEdit = () => {
    setEditingTask(null);
    setNewTask({
      title: "",
      description: "",
      dueDate: "",
      priority: "medium"
    });
    setIsFormOpen(false);
  };
  
  const toggleSort = (field) => {
    if (sortBy === field) {
      setSortDirection(prev => prev === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortDirection("asc");
    }
  };
  
  // Filter and sort tasks
  const filteredAndSortedTasks = [...tasks]
    .filter(task => {
      if (filter === "all") return true;
      if (filter === "completed") return task.completed;
      if (filter === "pending") return !task.completed;
      return true;
    })
    .sort((a, b) => {
      let valueA, valueB;
      
      if (sortBy === "priority") {
        const priorityValues = { high: 3, medium: 2, low: 1 };
        valueA = priorityValues[a.priority] || 0;
        valueB = priorityValues[b.priority] || 0;
      } else if (sortBy === "dueDate") {
        valueA = a.dueDate ? new Date(a.dueDate).getTime() : Infinity;
        valueB = b.dueDate ? new Date(b.dueDate).getTime() : Infinity;
      } else {
        valueA = a[sortBy] ? new Date(a[sortBy]).getTime() : 0;
        valueB = b[sortBy] ? new Date(b[sortBy]).getTime() : 0;
      }
      
      return sortDirection === "asc" 
        ? valueA - valueB 
        : valueB - valueA;
    });
  
  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high": return "text-accent";
      case "medium": return "text-primary";
      case "low": return "text-secondary";
      default: return "text-surface-500";
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setIsFormOpen(true)}
          className="btn btn-primary flex items-center gap-2 w-full md:w-auto"
        >
          <PlusCircle size={18} />
          Add New Task
        </motion.button>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <select 
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="input-field bg-surface-50 dark:bg-surface-800"
          >
            <option value="all">All Tasks</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
          </select>
          
          <select 
            value={`${sortBy}-${sortDirection}`}
            onChange={(e) => {
              const [field, direction] = e.target.value.split('-');
              setSortBy(field);
              setSortDirection(direction);
            }}
            className="input-field bg-surface-50 dark:bg-surface-800"
          >
            <option value="createdAt-desc">Newest First</option>
            <option value="createdAt-asc">Oldest First</option>
            <option value="dueDate-asc">Due Date (Earliest)</option>
            <option value="dueDate-desc">Due Date (Latest)</option>
            <option value="priority-desc">Priority (High to Low)</option>
            <option value="priority-asc">Priority (Low to High)</option>
          </select>
        </div>
      </div>
      
      <AnimatePresence>
        {isFormOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <form 
              onSubmit={editingTask ? handleUpdateTask : handleAddTask}
              className="card-neu p-6 mb-6"
            >
              <h2 className="text-xl font-semibold mb-4">
                {editingTask ? "Edit Task" : "Add New Task"}
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium mb-1">
                    Task Title <span className="text-accent">*</span>
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={newTask.title}
                    onChange={handleInputChange}
                    placeholder="What needs to be done?"
                    className="input-field"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="description" className="block text-sm font-medium mb-1">
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={newTask.description}
                    onChange={handleInputChange}
                    placeholder="Add details about this task..."
                    className="input-field min-h-[80px]"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="dueDate" className="block text-sm font-medium mb-1">
                      Due Date
                    </label>
                    <input
                      type="date"
                      id="dueDate"
                      name="dueDate"
                      value={newTask.dueDate}
                      onChange={handleInputChange}
                      className="input-field"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="priority" className="block text-sm font-medium mb-1">
                      Priority
                    </label>
                    <select
                      id="priority"
                      name="priority"
                      value={newTask.priority}
                      onChange={handleInputChange}
                      className="input-field"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                </div>
                
                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    className="btn btn-outline flex items-center gap-2"
                  >
                    <X size={18} />
                    Cancel
                  </button>
                  
                  <button
                    type="submit"
                    className="btn btn-primary flex items-center gap-2"
                  >
                    {editingTask ? (
                      <>
                        <Edit size={18} />
                        Update Task
                      </>
                    ) : (
                      <>
                        <PlusCircle size={18} />
                        Add Task
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
      
      <div className="space-y-4">
        {filteredAndSortedTasks.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="card p-8 text-center"
          >
            <div className="flex justify-center mb-4">
              <img 
                src="https://source.unsplash.com/featured/300x200?productivity" 
                alt="No tasks" 
                className="w-40 h-40 object-cover rounded-full"
              />
            </div>
            <h3 className="text-xl font-semibold mb-2">No tasks found</h3>
            <p className="text-surface-500 dark:text-surface-400 mb-4">
              {filter !== "all" 
                ? `You don't have any ${filter} tasks yet.` 
                : "Your task list is empty. Add a new task to get started!"}
            </p>
            {filter !== "all" && (
              <button 
                onClick={() => setFilter("all")}
                className="btn btn-outline"
              >
                View All Tasks
              </button>
            )}
          </motion.div>
        ) : (
          <AnimatePresence>
            {filteredAndSortedTasks.map((task) => (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className={`card p-4 border-l-4 ${
                  task.completed 
                    ? "border-l-secondary bg-secondary/5 dark:bg-secondary/10" 
                    : task.priority === "high"
                    ? "border-l-accent"
                    : task.priority === "medium"
                    ? "border-l-primary"
                    : "border-l-secondary"
                }`}
              >
                <div className="flex items-start gap-3">
                  <button
                    onClick={() => handleToggleComplete(task.id)}
                    className={`mt-1 flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                      task.completed 
                        ? "bg-secondary border-secondary text-white" 
                        : "border-surface-300 dark:border-surface-600"
                    }`}
                    aria-label={task.completed ? "Mark as incomplete" : "Mark as complete"}
                  >
                    {task.completed && <Check size={14} />}
                  </button>
                  
                  <div className="flex-grow">
                    <div className="flex flex-wrap justify-between gap-2">
                      <h3 className={`text-lg font-medium ${
                        task.completed ? "line-through text-surface-500 dark:text-surface-400" : ""
                      }`}>
                        {task.title}
                      </h3>
                      
                      <div className="flex items-center gap-2">
                        <span className={`text-sm px-2 py-0.5 rounded-full ${getPriorityColor(task.priority)} bg-surface-100 dark:bg-surface-800`}>
                          {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                        </span>
                      </div>
                    </div>
                    
                    {task.description && (
                      <p className={`mt-1 text-surface-600 dark:text-surface-300 ${
                        task.completed ? "line-through text-surface-500 dark:text-surface-400" : ""
                      }`}>
                        {task.description}
                      </p>
                    )}
                    
                    <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-surface-500 dark:text-surface-400">
                      {task.dueDate && (
                        <div className="flex items-center gap-1">
                          <Calendar size={14} />
                          <span>Due: {format(new Date(task.dueDate), "MMM d, yyyy")}</span>
                        </div>
                      )}
                      
                      <div className="flex items-center gap-1">
                        <Clock size={14} />
                        <span>Created: {format(new Date(task.createdAt), "MMM d")}</span>
                      </div>
                      
                      {task.completed && task.completedAt && (
                        <div className="flex items-center gap-1 text-secondary">
                          <Check size={14} />
                          <span>Completed: {format(new Date(task.completedAt), "MMM d")}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 ml-2">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleEditTask(task)}
                      className="p-1.5 rounded-full hover:bg-surface-100 dark:hover:bg-surface-700"
                      aria-label="Edit task"
                    >
                      <Edit size={16} className="text-primary" />
                    </motion.button>
                    
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleDeleteTask(task.id)}
                      className="p-1.5 rounded-full hover:bg-surface-100 dark:hover:bg-surface-700"
                      aria-label="Delete task"
                    >
                      <Trash2 size={16} className="text-accent" />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
};

export default MainFeature;