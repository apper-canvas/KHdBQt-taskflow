import { 
  fetchRecords, 
  fetchRecord, 
  createRecord, 
  updateRecord, 
  deleteRecord 
} from './apperService';

// Define the table name
const TABLE_NAME = 'task7';

// Define fields to fetch
const TASK_FIELDS = [
  'Id', 
  'Name', 
  'title', 
  'description', 
  'due_date', 
  'status', 
  'priority', 
  'assignee', 
  'tags',
  'CreatedOn',
  'ModifiedOn'
];

// Fetch all tasks
export const fetchTasks = async (options = {}) => {
  const fetchOptions = {
    fields: TASK_FIELDS,
    ...options
  };
  
  return fetchRecords(TABLE_NAME, fetchOptions);
};

// Fetch a specific task by ID
export const fetchTask = async (taskId) => {
  return fetchRecord(TABLE_NAME, taskId, TASK_FIELDS);
};

// Create a new task
export const createTask = async (taskData) => {
  // Make sure to map form data to the correct field names
  const record = {
    title: taskData.title,
    description: taskData.description,
    due_date: taskData.due_date,
    status: taskData.status,
    priority: taskData.priority,
    tags: taskData.tags
  };
  
  return createRecord(TABLE_NAME, record);
};

// Update an existing task
export const updateTask = async (taskId, taskData) => {
  // Make sure to map form data to the correct field names
  const record = {
    title: taskData.title,
    description: taskData.description,
    due_date: taskData.due_date,
    status: taskData.status,
    priority: taskData.priority,
    tags: taskData.tags
  };
  
  return updateRecord(TABLE_NAME, taskId, record);
};

// Delete a task
export const deleteTask = async (taskId) => {
  return deleteRecord(TABLE_NAME, taskId);
};

// Fetch tasks by status
export const fetchTasksByStatus = async (status) => {
  const options = {
    fields: TASK_FIELDS,
    filter: {
      logic: 'and',
      conditions: [
        {
          field: 'status',
          operator: 'eq',
          value: status
        }
      ]
    }
  };
  
  return fetchRecords(TABLE_NAME, options);
};

// Fetch tasks by priority
export const fetchTasksByPriority = async (priority) => {
  const options = {
    fields: TASK_FIELDS,
    filter: {
      logic: 'and',
      conditions: [
        {
          field: 'priority',
          operator: 'eq',
          value: priority
        }
      ]
    }
  };
  
  return fetchRecords(TABLE_NAME, options);
};

// Fetch tasks by due date range
export const fetchTasksByDueDate = async (startDate, endDate) => {
  const options = {
    fields: TASK_FIELDS,
    filter: {
      logic: 'and',
      conditions: [
        {
          field: 'due_date',
          operator: 'gte',
          value: startDate
        },
        {
          field: 'due_date',
          operator: 'lte',
          value: endDate
        }
      ]
    }
  };
  
  return fetchRecords(TABLE_NAME, options);
};