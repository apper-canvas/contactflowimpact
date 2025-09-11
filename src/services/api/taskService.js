class TaskService {
  constructor() {
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    this.tableName = 'task_c';
  }

  async getAll() {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "type_c"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "due_date_c"}},
          {"field": {"Name": "priority_c"}},
          {"field": {"Name": "completed_c"}},
          {"field": {"Name": "created_at_c"}},
          {"field": {"Name": "updated_at_c"}},
          {"field": {"Name": "contact_id_c"}},
          {"field": {"Name": "deal_id_c"}}
        ],
        orderBy: [{"fieldName": "due_date_c", "sorttype": "ASC"}],
        pagingInfo: {"limit": 100, "offset": 0}
      };
      
      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error fetching tasks:", error?.response?.data?.message || error);
      throw error;
    }
  }

  async getById(id) {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "type_c"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "due_date_c"}},
          {"field": {"Name": "priority_c"}},
          {"field": {"Name": "completed_c"}},
          {"field": {"Name": "created_at_c"}},
          {"field": {"Name": "updated_at_c"}},
          {"field": {"Name": "contact_id_c"}},
          {"field": {"Name": "deal_id_c"}}
        ]
      };
      
      const response = await this.apperClient.getRecordById(this.tableName, parseInt(id), params);
      
      if (!response.data) {
        throw new Error("Task not found");
      }
      
      return response.data;
    } catch (error) {
      console.error(`Error fetching task ${id}:`, error?.response?.data?.message || error);
      throw error;
    }
  }

  async create(taskData) {
    try {
      const params = {
        records: [{
          Name: taskData.title_c || taskData.Name,
          type_c: taskData.type_c,
          title_c: taskData.title_c,
          description_c: taskData.description_c?.trim() || "",
          due_date_c: taskData.due_date_c ? new Date(taskData.due_date_c).toISOString() : null,
          priority_c: taskData.priority_c || 'Medium',
          completed_c: taskData.completed_c || false,
          contact_id_c: taskData.contact_id_c ? parseInt(taskData.contact_id_c) : null,
          deal_id_c: taskData.deal_id_c ? parseInt(taskData.deal_id_c) : null,
          created_at_c: new Date().toISOString(),
          updated_at_c: new Date().toISOString()
        }]
      };
      
      const response = await this.apperClient.createRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to create task:`, failed);
          const errorMessage = failed[0].errors?.[0] || failed[0].message || 'Creation failed';
          throw new Error(errorMessage);
        }
        
        return successful[0]?.data;
      }
    } catch (error) {
      console.error("Error creating task:", error?.response?.data?.message || error);
      throw error;
    }
  }

  async update(id, taskData) {
    try {
      const params = {
        records: [{
          Id: parseInt(id),
          Name: taskData.title_c || taskData.Name,
          type_c: taskData.type_c,
          title_c: taskData.title_c,
          description_c: taskData.description_c?.trim() || "",
          due_date_c: taskData.due_date_c ? new Date(taskData.due_date_c).toISOString() : null,
          priority_c: taskData.priority_c || 'Medium',
          completed_c: taskData.completed_c !== undefined ? taskData.completed_c : false,
          contact_id_c: taskData.contact_id_c ? parseInt(taskData.contact_id_c) : null,
          deal_id_c: taskData.deal_id_c ? parseInt(taskData.deal_id_c) : null,
          updated_at_c: new Date().toISOString()
        }]
      };
      
      const response = await this.apperClient.updateRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to update task:`, failed);
          const errorMessage = failed[0].errors?.[0] || failed[0].message || 'Update failed';
          throw new Error(errorMessage);
        }
        
        return successful[0]?.data;
      }
    } catch (error) {
      console.error("Error updating task:", error?.response?.data?.message || error);
      throw error;
    }
  }

  async delete(id) {
    try {
      const params = { 
        RecordIds: [parseInt(id)]
      };
      
      const response = await this.apperClient.deleteRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to delete task:`, failed);
          const errorMessage = failed[0].message || 'Delete failed';
          throw new Error(errorMessage);
        }
        
        return true;
      }
    } catch (error) {
      console.error("Error deleting task:", error?.response?.data?.message || error);
      throw error;
    }
  }

  async markComplete(id, data) {
    try {
      const params = {
        records: [{
          Id: parseInt(id),
          completed_c: data.completed_c !== undefined ? data.completed_c : true,
          updated_at_c: new Date().toISOString()
        }]
      };
      
      const response = await this.apperClient.updateRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to mark task complete:`, failed);
          const errorMessage = failed[0].errors?.[0] || failed[0].message || 'Update failed';
          throw new Error(errorMessage);
        }
        
        return successful[0]?.data;
      }
    } catch (error) {
      console.error("Error marking task complete:", error?.response?.data?.message || error);
      throw error;
    }
  }

  async getByContactId(contactId) {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "type_c"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "due_date_c"}},
          {"field": {"Name": "priority_c"}},
          {"field": {"Name": "completed_c"}},
          {"field": {"Name": "created_at_c"}},
          {"field": {"Name": "updated_at_c"}},
          {"field": {"Name": "contact_id_c"}},
          {"field": {"Name": "deal_id_c"}}
        ],
        where: [{"FieldName": "contact_id_c", "Operator": "EqualTo", "Values": [parseInt(contactId)]}],
        orderBy: [{"fieldName": "updated_at_c", "sorttype": "DESC"}],
        pagingInfo: {"limit": 100, "offset": 0}
      };
      
      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error fetching tasks by contact:", error?.response?.data?.message || error);
      throw error;
    }
  }

  async getActivityMetrics() {
    try {
      const allTasks = await this.getAll();
      const completed = allTasks.filter(task => task.completed_c === true).length;
      const pending = allTasks.filter(task => task.completed_c !== true).length;
      const overdue = allTasks.filter(task => {
        if (task.completed_c === true) return false;
        return new Date(task.due_date_c) < new Date();
      }).length;

      return { completed, pending, overdue, total: allTasks.length };
    } catch (error) {
      console.error("Error getting activity metrics:", error?.response?.data?.message || error);
      throw error;
    }
  }
}

export default new TaskService();