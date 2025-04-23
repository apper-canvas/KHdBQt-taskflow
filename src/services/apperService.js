// Initialize the ApperClient with Canvas ID
export const initApperClient = () => {
  const { ApperClient } = window.ApperSDK;
  return new ApperClient("ab583a0e21614339bc3472433cb55df3");
};

// Common service for any shared functions across entities
export const fetchRecords = async (tableName, options = {}) => {
  try {
    const apperClient = initApperClient();
    
    const params = {
      fields: options.fields || [],
      pagingInfo: options.pagingInfo || { limit: 100, offset: 0 },
      orderBy: options.orderBy || [{ field: "CreatedOn", direction: "desc" }],
      filter: options.filter || null
    };
    
    const response = await apperClient.fetchRecords(tableName, params);
    
    if (!response || !response.data) {
      return [];
    }
    
    return response.data;
  } catch (error) {
    console.error(`Error fetching records from ${tableName}:`, error);
    throw error;
  }
};

export const fetchRecord = async (tableName, recordId, fields = []) => {
  try {
    const apperClient = initApperClient();
    
    const response = await apperClient.fetchRecord(tableName, recordId, { fields });
    
    if (!response || !response.data) {
      throw new Error(`Record not found in ${tableName}`);
    }
    
    return response.data;
  } catch (error) {
    console.error(`Error fetching record from ${tableName}:`, error);
    throw error;
  }
};

export const createRecord = async (tableName, record) => {
  try {
    const apperClient = initApperClient();
    
    const params = { record };
    
    const response = await apperClient.createRecord(tableName, params);
    
    if (!response || !response.data) {
      throw new Error(`Failed to create record in ${tableName}`);
    }
    
    return response.data;
  } catch (error) {
    console.error(`Error creating record in ${tableName}:`, error);
    throw error;
  }
};

export const updateRecord = async (tableName, recordId, record) => {
  try {
    const apperClient = initApperClient();
    
    const params = { record };
    
    const response = await apperClient.updateRecord(tableName, recordId, params);
    
    if (!response || !response.data) {
      throw new Error(`Failed to update record in ${tableName}`);
    }
    
    return response.data;
  } catch (error) {
    console.error(`Error updating record in ${tableName}:`, error);
    throw error;
  }
};

export const deleteRecord = async (tableName, recordId) => {
  try {
    const apperClient = initApperClient();
    
    const response = await apperClient.deleteRecord(tableName, recordId);
    
    if (!response || !response.success) {
      throw new Error(`Failed to delete record in ${tableName}`);
    }
    
    return true;
  } catch (error) {
    console.error(`Error deleting record from ${tableName}:`, error);
    throw error;
  }
};