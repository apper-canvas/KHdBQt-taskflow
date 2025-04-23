import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { CheckSquare, Folder, Clock, AlertTriangle, BarChart2 } from 'lucide-react';
import Chart from 'react-apexcharts';
import { fetchTasks } from '../services/taskService';
import { fetchProjects } from '../services/projectService';

const Dashboard = () => {
  const { user } = useSelector((state) => state.user);
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      setIsLoading(true);
      try {
        // Fetch tasks and projects in parallel
        const [tasksResponse, projectsResponse] = await Promise.all([
          fetchTasks(),
          fetchProjects()
        ]);
        
        setTasks(tasksResponse);
        setProjects(projectsResponse);
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  // Calculate task statistics
  const taskStats = {
    total: tasks.length,
    completed: tasks.filter(task => task.status === 'Completed').length,
    inProgress: tasks.filter(task => task.status === 'In Progress').length,
    todo: tasks.filter(task => task.status === 'To Do').length,
  };
  
  // Calculate project statistics
  const projectStats = {
    total: projects.length,
    completed: projects.filter(project => project.status === 'Completed').length,
    inProgress: projects.filter(project => project.status === 'In Progress').length,
    notStarted: projects.filter(project => project.status === 'Not Started').length,
    onHold: projects.filter(project => project.status === 'On Hold').length,
  };

  // Task status chart data
  const taskChartOptions = {
    chart: {
      type: 'donut',
    },
    labels: ['To Do', 'In Progress', 'Completed'],
    colors: ['#3B82F6', '#FBBF24', '#10B981'],
    legend: {
      position: 'bottom',
    },
    responsive: [{
      breakpoint: 480,
      options: {
        chart: {
          width: 200
        },
        legend: {
          position: 'bottom'
        }
      }
    }]
  };
  
  const taskChartSeries = [
    taskStats.todo,
    taskStats.inProgress,
    taskStats.completed
  ];

  // Project status chart data
  const projectChartOptions = {
    chart: {
      type: 'donut',
    },
    labels: ['Not Started', 'In Progress', 'On Hold', 'Completed'],
    colors: ['#6B7280', '#3B82F6', '#F59E0B', '#10B981'],
    legend: {
      position: 'bottom',
    },
    responsive: [{
      breakpoint: 480,
      options: {
        chart: {
          width: 200
        },
        legend: {
          position: 'bottom'
        }
      }
    }]
  };
  
  const projectChartSeries = [
    projectStats.notStarted,
    projectStats.inProgress,
    projectStats.onHold,
    projectStats.completed
  ];

  const recentTasks = tasks
    .sort((a, b) => new Date(b.ModifiedOn || b.CreatedOn) - new Date(a.ModifiedOn || a.CreatedOn))
    .slice(0, 5);

  const upcomingDeadlines = tasks
    .filter(task => task.status !== 'Completed' && task.due_date)
    .sort((a, b) => new Date(a.due_date) - new Date(b.due_date))
    .slice(0, 5);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
        <div className="text-sm text-gray-500">
          Welcome back, {user?.firstName || 'User'}!
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg shadow p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-blue-100 rounded-full p-3">
                  <CheckSquare className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-5">
                  <div className="text-gray-500 text-sm">Total Tasks</div>
                  <div className="text-2xl font-semibold">{taskStats.total}</div>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-green-100 rounded-full p-3">
                  <Folder className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-5">
                  <div className="text-gray-500 text-sm">Total Projects</div>
                  <div className="text-2xl font-semibold">{projectStats.total}</div>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-yellow-100 rounded-full p-3">
                  <Clock className="h-6 w-6 text-yellow-600" />
                </div>
                <div className="ml-5">
                  <div className="text-gray-500 text-sm">In Progress</div>
                  <div className="text-2xl font-semibold">
                    {taskStats.inProgress} <span className="text-sm font-normal text-gray-500">tasks</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-red-100 rounded-full p-3">
                  <AlertTriangle className="h-6 w-6 text-red-600" />
                </div>
                <div className="ml-5">
                  <div className="text-gray-500 text-sm">Pending</div>
                  <div className="text-2xl font-semibold">
                    {taskStats.todo} <span className="text-sm font-normal text-gray-500">tasks</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Task Status Overview</h2>
                <Link to="/tasks" className="text-sm text-blue-600 hover:text-blue-800">
                  View All
                </Link>
              </div>
              <Chart 
                options={taskChartOptions} 
                series={taskChartSeries} 
                type="donut" 
                height={300} 
              />
            </div>
            
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Project Status Overview</h2>
                <Link to="/projects" className="text-sm text-blue-600 hover:text-blue-800">
                  View All
                </Link>
              </div>
              <Chart 
                options={projectChartOptions} 
                series={projectChartSeries} 
                type="donut" 
                height={300} 
              />
            </div>
          </div>

          {/* Recent Tasks and Upcoming Deadlines */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="px-4 py-5 border-b border-gray-200 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Recent Tasks</h2>
                <Link to="/tasks" className="text-sm text-blue-600 hover:text-blue-800">
                  View All
                </Link>
              </div>
              <div className="p-2">
                {recentTasks.length > 0 ? (
                  <ul className="divide-y divide-gray-200">
                    {recentTasks.map(task => (
                      <li key={task.Id} className="p-3 hover:bg-gray-50">
                        <Link to={`/tasks/${task.Id}`} className="block">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <span className={`w-2 h-2 rounded-full mr-3 ${
                                task.status === 'Completed' ? 'bg-green-500' : 
                                task.status === 'In Progress' ? 'bg-yellow-500' : 'bg-blue-500'
                              }`}></span>
                              <span className="text-sm font-medium text-gray-900">{task.title || task.Name}</span>
                            </div>
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              task.priority === 'High' ? 'bg-red-100 text-red-800' : 
                              task.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                            }`}>
                              {task.priority}
                            </span>
                          </div>
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="py-4 text-center text-gray-500">
                    No recent tasks available
                  </div>
                )}
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="px-4 py-5 border-b border-gray-200 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Upcoming Deadlines</h2>
                <Link to="/tasks" className="text-sm text-blue-600 hover:text-blue-800">
                  View All
                </Link>
              </div>
              <div className="p-2">
                {upcomingDeadlines.length > 0 ? (
                  <ul className="divide-y divide-gray-200">
                    {upcomingDeadlines.map(task => (
                      <li key={task.Id} className="p-3 hover:bg-gray-50">
                        <Link to={`/tasks/${task.Id}`} className="block">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <span className="text-sm font-medium text-gray-900">{task.title || task.Name}</span>
                            </div>
                            <span className="text-xs text-gray-500">
                              Due: {new Date(task.due_date).toLocaleDateString()}
                            </span>
                          </div>
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="py-4 text-center text-gray-500">
                    No upcoming deadlines
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;