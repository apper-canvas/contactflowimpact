class DealService {
  constructor() {
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    this.tableName = 'deal_c';
  }

  async validateStage(stage) {
    try {
      const settingsService = await import('./settingsService.js').then(m => m.default);
      const validStages = settingsService.getPipelineStages();
      return validStages.includes(stage) ? stage : validStages[0] || 'Lead';
    } catch (error) {
      return stage; // Fallback to provided stage if settings service unavailable
    }
  }

  async getByContactId(contactId) {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "value_c"}},
          {"field": {"Name": "stage_c"}},
          {"field": {"Name": "probability_c"}},
          {"field": {"Name": "expected_close_date_c"}},
          {"field": {"Name": "notes_c"}},
          {"field": {"Name": "created_at_c"}},
          {"field": {"Name": "updated_at_c"}},
          {"field": {"Name": "contact_id_c"}}
        ],
        where: [{"FieldName": "contact_id_c", "Operator": "EqualTo", "Values": [parseInt(contactId)]}],
        orderBy: [{"fieldName": "expected_close_date_c", "sorttype": "DESC"}],
        pagingInfo: {"limit": 100, "offset": 0}
      };
      
      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error fetching deals by contact:", error?.response?.data?.message || error);
      throw error;
    }
  }

  async getAll() {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "value_c"}},
          {"field": {"Name": "stage_c"}},
          {"field": {"Name": "probability_c"}},
          {"field": {"Name": "expected_close_date_c"}},
          {"field": {"Name": "notes_c"}},
          {"field": {"Name": "created_at_c"}},
          {"field": {"Name": "updated_at_c"}},
          {"field": {"Name": "contact_id_c"}}
        ],
        orderBy: [{"fieldName": "expected_close_date_c", "sorttype": "DESC"}],
        pagingInfo: {"limit": 100, "offset": 0}
      };
      
      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error fetching deals:", error?.response?.data?.message || error);
      throw error;
    }
  }

  async getById(id) {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "value_c"}},
          {"field": {"Name": "stage_c"}},
          {"field": {"Name": "probability_c"}},
          {"field": {"Name": "expected_close_date_c"}},
          {"field": {"Name": "notes_c"}},
          {"field": {"Name": "created_at_c"}},
          {"field": {"Name": "updated_at_c"}},
          {"field": {"Name": "contact_id_c"}}
        ]
      };
      
      const response = await this.apperClient.getRecordById(this.tableName, parseInt(id), params);
      
      if (!response.data) {
        throw new Error("Deal not found");
      }
      
      return response.data;
    } catch (error) {
      console.error(`Error fetching deal ${id}:`, error?.response?.data?.message || error);
      throw error;
    }
  }

  async create(dealData) {
    try {
      const params = {
        records: [{
          Name: dealData.title_c || dealData.Name,
          title_c: dealData.title_c,
          value_c: parseFloat(dealData.value_c) || 0,
          stage_c: await this.validateStage(dealData.stage_c || 'Lead'),
          probability_c: parseInt(dealData.probability_c) || 0,
          expected_close_date_c: dealData.expected_close_date_c ? new Date(dealData.expected_close_date_c).toISOString() : null,
          notes_c: dealData.notes_c?.trim() || "",
          contact_id_c: parseInt(dealData.contact_id_c),
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
          console.error(`Failed to create deal:`, failed);
          const errorMessage = failed[0].errors?.[0] || failed[0].message || 'Creation failed';
          throw new Error(errorMessage);
        }
        
        return successful[0]?.data;
      }
    } catch (error) {
      console.error("Error creating deal:", error?.response?.data?.message || error);
      throw error;
    }
  }

  async updateStage(id, stage) {
    try {
      const params = {
        records: [{
          Id: parseInt(id),
          stage_c: await this.validateStage(stage),
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
          console.error(`Failed to update deal stage:`, failed);
          const errorMessage = failed[0].errors?.[0] || failed[0].message || 'Update failed';
          throw new Error(errorMessage);
        }
        
        return successful[0]?.data;
      }
    } catch (error) {
      console.error("Error updating deal stage:", error?.response?.data?.message || error);
      throw error;
    }
  }

  async update(id, dealData) {
    try {
      const params = {
        records: [{
          Id: parseInt(id),
          Name: dealData.title_c || dealData.Name,
          title_c: dealData.title_c,
          value_c: parseFloat(dealData.value_c) || 0,
          stage_c: dealData.stage_c,
          probability_c: parseInt(dealData.probability_c) || 0,
          expected_close_date_c: dealData.expected_close_date_c ? new Date(dealData.expected_close_date_c).toISOString() : null,
          notes_c: dealData.notes_c?.trim() || "",
          contact_id_c: parseInt(dealData.contact_id_c),
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
          console.error(`Failed to update deal:`, failed);
          const errorMessage = failed[0].errors?.[0] || failed[0].message || 'Update failed';
          throw new Error(errorMessage);
        }
        
        return successful[0]?.data;
      }
    } catch (error) {
      console.error("Error updating deal:", error?.response?.data?.message || error);
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
          console.error(`Failed to delete deal:`, failed);
          const errorMessage = failed[0].message || 'Delete failed';
          throw new Error(errorMessage);
        }
        
        return true;
      }
    } catch (error) {
      console.error("Error deleting deal:", error?.response?.data?.message || error);
      throw error;
    }
  }
}

export default new DealService();