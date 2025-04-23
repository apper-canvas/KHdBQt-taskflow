import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import ProjectForm from '../components/ProjectForm';
import { fetchProject, createProject, updateProject } from '../services/projectService';

const ProjectDetail = ({ isNew = false }) => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const loadProject = async () => {
      if (isNew) return;
      
      setIsLoading(true);
      try {
        const data = await fetchProject(projectId);
        setProject(data);
        setError(null);
      } catch (err) {
        setError('Failed to load project details. Please try again later.');
        console.error('Error loading project:', err);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadProject();
  }, [projectId, isNew]);
  
  const handleSubmit = async (formData) => {
    setIsLoading(true);
    try {
      if (isNew) {
        await createProject(formData);
      } else {
        await updateProject(projectId, formData);
      }
      navigate('/projects');
    } catch (err) {
      setError(`Failed to ${isNew ? 'create' : 'update'} project. Please try again.`);
      console.error(`Error ${isNew ? 'creating' : 'updating'} project:`, err);
      setIsLoading(false);
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <button
          onClick={() => navigate('/projects')}
          className="mr-4 p-2 rounded-full hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-2xl font-semibold text-gray-900">
          {isNew ? 'Create New Project' : project?.Name || 'Project Details'}
        </h1>
      </div>
      
      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}
      
      {(isNew || project || isLoading) && (
        <ProjectForm 
          project={isNew ? null : project} 
          onSubmit={handleSubmit} 
          isLoading={isLoading} 
        />
      )}
    </div>
  );
};

export default ProjectDetail;