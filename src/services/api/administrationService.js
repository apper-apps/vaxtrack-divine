import { toast } from 'react-toastify';

// Initialize ApperClient
const { ApperClient } = window.ApperSDK;
const apperClient = new ApperClient({
  apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
  apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
});

class AdministrationService {
  async getAll() {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "doses_administered" } },
          { field: { Name: "administration_date" } },
          { field: { Name: "inventory_id" } }
        ],
        orderBy: [
          {
            fieldName: "administration_date",
            sorttype: "DESC"
          }
        ]
      };

      const response = await apperClient.fetchRecords('administration', params);
      
      if (!response.success) {
        console.error('Administration fetch failed:', response.message);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error('Error fetching administrations:', error);
      toast.error('Failed to fetch administrations');
      return [];
    }
  }

  async getById(id) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "doses_administered" } },
          { field: { Name: "administration_date" } },
          { field: { Name: "inventory_id" } }
        ]
      };
      
      const response = await apperClient.fetchRecords('administration', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }
      
      return response.data.map(item => ({
        Id: item.Id,
        inventoryId: item.inventory_id,
        dosesAdministered: item.doses_administered,
        administrationDate: item.administration_date
      }));
    } catch (error) {
      console.error('Error fetching administrations:', error);
      toast.error('Failed to fetch administrations');
      return [];
    }
  }

  async getById(id) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "doses_administered" } },
          { field: { Name: "administration_date" } },
          { field: { Name: "inventory_id" } }
        ]
      };
      
      const response = await apperClient.getRecordById('administration', parseInt(id), params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error('Administration record not found');
      }
      
      const item = response.data;
      return {
        Id: item.Id,
        inventoryId: item.inventory_id,
        dosesAdministered: item.doses_administered,
        administrationDate: item.administration_date
      };
    } catch (error) {
      console.error('Error fetching administration:', error);
      throw error;
    }
  }

  async create(administrationData) {
    try {
      const params = {
        records: [{
          Name: `Administration ${new Date().toISOString()}`,
          doses_administered: parseInt(administrationData.dosesAdministered),
          administration_date: administrationData.administrationDate,
          inventory_id: parseInt(administrationData.inventoryId)
        }]
      };
      
      const response = await apperClient.createRecord('administration', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error('Failed to create administration record');
      }
      
      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          failedRecords.forEach(record => {
            if (record.message) toast.error(record.message);
          });
          throw new Error('Failed to create administration record');
        }
        
        const successfulRecord = response.results.find(result => result.success);
        if (successfulRecord) {
          const item = successfulRecord.data;
          return {
            Id: item.Id,
            inventoryId: item.inventory_id,
            dosesAdministered: item.doses_administered,
            administrationDate: item.administration_date
          };
        }
      }
      
      throw new Error('Failed to create administration record');
    } catch (error) {
      console.error('Error creating administration:', error);
      throw error;
    }
  }

  async update(id, administrationData) {
    try {
      const params = {
        records: [{
          Id: parseInt(id),
          Name: `Administration ${new Date().toISOString()}`,
          doses_administered: parseInt(administrationData.dosesAdministered),
          administration_date: administrationData.administrationDate,
          inventory_id: parseInt(administrationData.inventoryId)
        }]
      };
      
      const response = await apperClient.updateRecord('administration', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error('Failed to update administration record');
      }
      
      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        if (failedRecords.length > 0) {
          console.error(`Failed to update ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          failedRecords.forEach(record => {
            if (record.message) toast.error(record.message);
          });
          throw new Error('Failed to update administration record');
        }
        
        const successfulRecord = response.results.find(result => result.success);
        if (successfulRecord) {
          const item = successfulRecord.data;
          return {
            Id: item.Id,
            inventoryId: item.inventory_id,
            dosesAdministered: item.doses_administered,
            administrationDate: item.administration_date
          };
        }
      }
      
      throw new Error('Failed to update administration record');
    } catch (error) {
      console.error('Error updating administration:', error);
      throw error;
    }
  }

  async delete(id) {
    try {
      const params = {
        RecordIds: [parseInt(id)]
      };
      
      const response = await apperClient.deleteRecord('administration', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return false;
      }
      
      if (response.results) {
        const failedDeletions = response.results.filter(result => !result.success);
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message);
          });
          return false;
        }
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Error deleting administration:', error);
      throw error;
    }
  }
}

export const administrationService = new AdministrationService();