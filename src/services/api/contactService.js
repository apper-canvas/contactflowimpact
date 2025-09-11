class ContactService {
  constructor() {
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    this.tableName = 'contact_c';
  }

  async getAll() {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "first_name_c"}},
          {"field": {"Name": "last_name_c"}},
          {"field": {"Name": "email_c"}},
          {"field": {"Name": "phone_c"}},
          {"field": {"Name": "company_c"}},
          {"field": {"Name": "job_title_c"}},
          {"field": {"Name": "address_c"}},
          {"field": {"Name": "notes_c"}},
          {"field": {"Name": "tags_c"}},
          {"field": {"Name": "created_at_c"}},
          {"field": {"Name": "updated_at_c"}},
          {"field": {"Name": "CreatedOn"}},
          {"field": {"Name": "ModifiedOn"}}
        ],
        orderBy: [{"fieldName": "ModifiedOn", "sorttype": "DESC"}],
        pagingInfo: {"limit": 100, "offset": 0}
      };
      
      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error fetching contacts:", error?.response?.data?.message || error);
      throw error;
    }
  }

  async getById(id) {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "first_name_c"}},
          {"field": {"Name": "last_name_c"}},
          {"field": {"Name": "email_c"}},
          {"field": {"Name": "phone_c"}},
          {"field": {"Name": "company_c"}},
          {"field": {"Name": "job_title_c"}},
          {"field": {"Name": "address_c"}},
          {"field": {"Name": "notes_c"}},
          {"field": {"Name": "tags_c"}},
          {"field": {"Name": "created_at_c"}},
          {"field": {"Name": "updated_at_c"}},
          {"field": {"Name": "CreatedOn"}},
          {"field": {"Name": "ModifiedOn"}}
        ]
      };
      
      const response = await this.apperClient.getRecordById(this.tableName, parseInt(id), params);
      
      if (!response.data) {
        throw new Error("Contact not found");
      }
      
      return response.data;
    } catch (error) {
      console.error(`Error fetching contact ${id}:`, error?.response?.data?.message || error);
      throw error;
    }
  }

  async create(contactData) {
    try {
      // Validation
      if (!contactData.first_name_c?.trim()) {
        throw new Error("First name is required");
      }
      if (!contactData.last_name_c?.trim()) {
        throw new Error("Last name is required");
      }
      if (!contactData.email_c?.trim()) {
        throw new Error("Email is required");
      }
      
      // Email format validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(contactData.email_c)) {
        throw new Error("Please enter a valid email address");
      }

      const params = {
        records: [{
          Name: `${contactData.first_name_c?.trim()} ${contactData.last_name_c?.trim()}`,
          first_name_c: contactData.first_name_c?.trim(),
          last_name_c: contactData.last_name_c?.trim(),
          email_c: contactData.email_c?.trim().toLowerCase(),
          phone_c: contactData.phone_c?.trim() || "",
          company_c: contactData.company_c?.trim() || "",
          job_title_c: contactData.job_title_c?.trim() || "",
          address_c: contactData.address_c?.trim() || "",
          notes_c: contactData.notes_c?.trim() || "",
          tags_c: Array.isArray(contactData.tags_c) ? contactData.tags_c.join(',') : (contactData.tags_c || ""),
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
          console.error(`Failed to create contact:`, failed);
          const errorMessage = failed[0].errors?.[0] || failed[0].message || 'Creation failed';
          throw new Error(errorMessage);
        }
        
        return successful[0]?.data;
      }
    } catch (error) {
      console.error("Error creating contact:", error?.response?.data?.message || error);
      throw error;
    }
  }

  async update(id, contactData) {
    try {
      // Validation
      if (!contactData.first_name_c?.trim()) {
        throw new Error("First name is required");
      }
      if (!contactData.last_name_c?.trim()) {
        throw new Error("Last name is required");
      }
      if (!contactData.email_c?.trim()) {
        throw new Error("Email is required");
      }

      // Email format validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(contactData.email_c)) {
        throw new Error("Please enter a valid email address");
      }

      const params = {
        records: [{
          Id: parseInt(id),
          Name: `${contactData.first_name_c?.trim()} ${contactData.last_name_c?.trim()}`,
          first_name_c: contactData.first_name_c?.trim(),
          last_name_c: contactData.last_name_c?.trim(),
          email_c: contactData.email_c?.trim().toLowerCase(),
          phone_c: contactData.phone_c?.trim() || "",
          company_c: contactData.company_c?.trim() || "",
          job_title_c: contactData.job_title_c?.trim() || "",
          address_c: contactData.address_c?.trim() || "",
          notes_c: contactData.notes_c?.trim() || "",
          tags_c: Array.isArray(contactData.tags_c) ? contactData.tags_c.join(',') : (contactData.tags_c || ""),
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
          console.error(`Failed to update contact:`, failed);
          const errorMessage = failed[0].errors?.[0] || failed[0].message || 'Update failed';
          throw new Error(errorMessage);
        }
        
        return successful[0]?.data;
      }
    } catch (error) {
      console.error("Error updating contact:", error?.response?.data?.message || error);
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
          console.error(`Failed to delete contact:`, failed);
          const errorMessage = failed[0].message || 'Delete failed';
          throw new Error(errorMessage);
        }
        
        return true;
      }
    } catch (error) {
      console.error("Error deleting contact:", error?.response?.data?.message || error);
      throw error;
    }
  }

  async search(query) {
    try {
      if (!query.trim()) {
        return await this.getAll();
      }

      const searchTerm = query.toLowerCase().trim();
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "first_name_c"}},
          {"field": {"Name": "last_name_c"}},
          {"field": {"Name": "email_c"}},
          {"field": {"Name": "phone_c"}},
          {"field": {"Name": "company_c"}},
          {"field": {"Name": "job_title_c"}},
          {"field": {"Name": "address_c"}},
          {"field": {"Name": "notes_c"}},
          {"field": {"Name": "tags_c"}},
          {"field": {"Name": "created_at_c"}},
          {"field": {"Name": "updated_at_c"}},
          {"field": {"Name": "CreatedOn"}},
          {"field": {"Name": "ModifiedOn"}}
        ],
        whereGroups: [{
          "operator": "OR",
          "subGroups": [
            {"conditions": [{"fieldName": "first_name_c", "operator": "Contains", "values": [searchTerm]}], "operator": ""},
            {"conditions": [{"fieldName": "last_name_c", "operator": "Contains", "values": [searchTerm]}], "operator": ""},
            {"conditions": [{"fieldName": "email_c", "operator": "Contains", "values": [searchTerm]}], "operator": ""},
            {"conditions": [{"fieldName": "company_c", "operator": "Contains", "values": [searchTerm]}], "operator": ""},
            {"conditions": [{"fieldName": "job_title_c", "operator": "Contains", "values": [searchTerm]}], "operator": ""},
            {"conditions": [{"fieldName": "phone_c", "operator": "Contains", "values": [searchTerm]}], "operator": ""},
            {"conditions": [{"fieldName": "tags_c", "operator": "Contains", "values": [searchTerm]}], "operator": ""}
          ]
        }],
        orderBy: [{"fieldName": "ModifiedOn", "sorttype": "DESC"}],
        pagingInfo: {"limit": 100, "offset": 0}
      };
      
      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error searching contacts:", error?.response?.data?.message || error);
      throw error;
    }
  }
}

const contactService = new ContactService();
export default new ContactService();