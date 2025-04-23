import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  CheckSquare, 
  Folder, 
  BarChart2, 
  Users, 
  Settings, 
  Menu, 
  X 
} from 'lucide-react';

const Navigation = ({ isOpen, toggleSidebar }) => {
  const location = useLocation();
  
  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };
  
  const navigationItems = [
    { name: 'Dashboard', path: '/', icon: Home },
    { name: 'Tasks', path: '/tasks', icon: CheckSquare },
    { name: 'Projects', path: '/projects', icon: Folder },
    { name: 'Reports', path: '/reports', icon: BarChart2 },
    { name: 'Team', path: '/team', icon: Users },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  return (
    <div 
      className={`${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } fixed inset-y-0 left-0 z-30 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:h-screen md:flex-shrink-0`}
    >
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between px-4 py-5 border-b border-gray-200">
          <Link to="/" className="flex items-center">
            <span className="text-xl font-bold text-blue-600">TaskFlow</span>
          </Link>
          <button 
            onClick={toggleSidebar}
            className="p-1 rounded-md text-gray-500 hover:text-gray-700 md:hidden"
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto py-4">
          <nav className="px-2 space-y-1">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`flex items-center px-4 py-3 text-sm font-medium rounded-md ${
                    isActive(item.path)
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <Icon size={18} className="mr-3" />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </div>
  );
};

export default Navigation;