import { 
  fetchRecords, 
  fetchRecord, 
  createRecord, 
  updateRecord, 
  deleteRecord 
} from './apperService';

// Define the table name
const TABLE_NAME = 'project3';

// Define fields to fetch
const PROJECT_FIELDS = [
  'Id', 
  'Name', 
  'description', 
  'start_date', 
  'end_date', 
  'status', 
  'team_members',
  'CreatedOn',
  'ModifiedOn'
];

// Fetch all projects
export const fetchProjects = async (options = {}) => {
  const fetchOptions = {
    fields: PROJECT_FIELDS,
    ...options
  };
  
  return fetchRecords(TABLE_NAME, fetchOptions);
};

// Fetch a specific project by ID
export const fetchProject = async (projectId) => {
  return fetchRecord(TABLE_NAME, projectId, PROJECT_FIELDS);
};

// Create a new project
export const createProject = async (projectData) => {
  // Make sure to map form data to the correct field names
  const record = {
    Name: projectData.Name,
    description: projectData.description,
    start_date: projectData.start_date,
    end_date: projectData.end_date,
    status: projectData.status,
    team_members: projectData.team_members
  };
  
  return createRecord(TABLE_NAME, record);
};

// Update an existing project
export const updateProject = async (projectId, projectData) => {
  // Make sure to map form data to the correct field names
  const record = {
    Name: projectData.Name,
    description: projectData.description,
    start_date: projectData.start_date,
    end_date: projectData.end_date,
    status: projectData.status,
    team_members: projectData.team_members
  };
  
  return updateRecord(TABLE_NAME, projectId, record);
};

// Delete a project
export const deleteProject = async (projectId) => {
  return deleteRecord(TABLE_NAME, projectId);
};

// Fetch projects by status
export const fetchProjectsByStatus = async (status) => {
  const options = {
    fields: PROJECT_FIELDS,
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

// Fetch projects by date range
export const fetchProjectsByDateRange = async (startDate, endDate) => {
  const options = {
    fields: PROJECT_FIELDS,
    filter: {
      logic: 'and',
      conditions: [
        {
          field: 'start_date',
          operator: 'gte',
          value: startDate
        },
        {
          field: 'end_date',
          operator: 'lte',
          value: endDate
        }
      ]
    }
  };
  
  return fetchRecords(TABLE_NAME, options);
};

// Fetch ongoing projects
export const fetchOngoingProjects = async () => {
  const options = {
    fields: PROJECT_FIELDS,
    filter: {
      logic: 'and',
      conditions: [
        {
          field: 'status',
          operator: 'eq',
          value: 'In Progress'
        }
      ]
    }
  };
  
  return fetchRecords(TABLE_NAME, options);
};