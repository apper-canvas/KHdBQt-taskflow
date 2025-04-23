import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setUser, setLoading } from '../store/userSlice';

const Signup = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, loading } = useSelector((state) => state.user);

  // If user is already authenticated, redirect to dashboard
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    const setupApperUI = () => {
      dispatch(setLoading(true));
      
      const { ApperClient, ApperUI } = window.ApperSDK;
      const apperClient = new ApperClient("ab583a0e21614339bc3472433cb55df3");

      ApperUI.setup(apperClient, {
        target: '#authentication',
        clientId: "ab583a0e21614339bc3472433cb55df3",
        hide: [],
        view: 'signup',
        onSuccess: function(user, account) {
          // Store user details in Redux
          dispatch(setUser(user));
          
          // Navigate to dashboard after successful signup
          navigate('/');
        },
        onError: function(error) {
          console.error("Authentication failed:", error);
          dispatch(setLoading(false));
        }
      });
      
      ApperUI.showSignup("#authentication");
    };

    setupApperUI();
  }, [dispatch, navigate]);

  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-gray-50">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Create your account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Join TaskFlow to manage your projects and tasks efficiently
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {loading && (
            <div className="flex justify-center mb-4">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          )}
          
          <div 
            id="authentication" 
            className="min-h-[400px] flex items-center justify-center" 
          />
          
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  Already have an account?
                </span>
              </div>
            </div>

            <div className="mt-6 text-center">
              <Link
                to="/login"
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                Sign in instead
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;