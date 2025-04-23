import { 
  fetchRecords, 
  fetchRecord 
} from './apperService';

// Define the table name
const TABLE_NAME = 'User';

// Define fields to fetch
const USER_FIELDS = [
  'Id', 
  'Name', 
  'FirstName', 
  'LastName', 
  'Email', 
  'AvatarUrl', 
  'Phone'
];

// Fetch current user profile
export const fetchCurrentUser = async () => {
  try {
    const { ApperClient } = window.ApperSDK;
    const userInfo = ApperClient.getUserInfo();
    
    if (!userInfo || !userInfo.userId) {
      throw new Error('User is not authenticated');
    }
    
    return fetchRecord(TABLE_NAME, userInfo.userId, USER_FIELDS);
  } catch (error) {
    console.error('Error fetching current user:', error);
    throw error;
  }
};

// Fetch all users
export const fetchUsers = async (options = {}) => {
  const fetchOptions = {
    fields: USER_FIELDS,
    ...options
  };
  
  return fetchRecords(TABLE_NAME, fetchOptions);
};

// Fetch a specific user by ID
export const fetchUser = async (userId) => {
  return fetchRecord(TABLE_NAME, userId, USER_FIELDS);
};

// Fetch users by email
export const fetchUserByEmail = async (email) => {
  const options = {
    fields: USER_FIELDS,
    filter: {
      logic: 'and',
      conditions: [
        {
          field: 'Email',
          operator: 'eq',
          value: email
        }
      ]
    }
  };
  
  const users = await fetchRecords(TABLE_NAME, options);
  return users[0] || null;
};

// Logout current user
export const logout = async () => {
  try {
    const { ApperClient } = window.ApperSDK;
    return ApperClient.logout();
  } catch (error) {
    console.error('Error logging out:', error);
    throw error;
  }
};