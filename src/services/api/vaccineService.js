import { toast } from 'react-toastify';

// Initialize ApperClient
const { ApperClient } = window.ApperSDK;
const apperClient = new ApperClient({
  apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
  apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
});

class VaccineService {
  async getAll() {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "commercial_name" } },
          { field: { Name: "generic_name" } },
          { field: { Name: "family" } },
          { field: { Name: "alert_threshold" } }
        ]
      };
      
      const response = await apperClient.fetchRecords('vaccine', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }
      
      return response.data.map(item => ({
        Id: item.Id,
        commercialName: item.commercial_name,
        genericName: item.generic_name,
        family: item.family,
        alertThreshold: item.alert_threshold
      }));
    } catch (error) {
      console.error('Error fetching vaccines:', error);
      toast.error('Failed to fetch vaccines');
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
          { field: { Name: "commercial_name" } },
          { field: { Name: "generic_name" } },
          { field: { Name: "family" } },
          { field: { Name: "alert_threshold" } }
        ]
      };
      
      const response = await apperClient.getRecordById('vaccine', parseInt(id), params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error('Vaccine not found');
      }
      
      const item = response.data;
      return {
        Id: item.Id,
        commercialName: item.commercial_name,
        genericName: item.generic_name,
        family: item.family,
        alertThreshold: item.alert_threshold
      };
    } catch (error) {
      console.error('Error fetching vaccine:', error);
      throw error;
    }
  }

  async create(vaccineData) {
    try {
      const params = {
        records: [{
          Name: vaccineData.commercialName,
          commercial_name: vaccineData.commercialName,
          generic_name: vaccineData.genericName,
          family: vaccineData.family,
          alert_threshold: parseInt(vaccineData.alertThreshold)
        }]
      };
      
      const response = await apperClient.createRecord('vaccine', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error('Failed to create vaccine');
      }
      
      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          failedRecords.forEach(record => {
            if (record.message) toast.error(record.message);
          });
          throw new Error('Failed to create vaccine');
        }
        
        const successfulRecord = response.results.find(result => result.success);
        if (successfulRecord) {
          const item = successfulRecord.data;
          return {
            Id: item.Id,
            commercialName: item.commercial_name,
            genericName: item.generic_name,
            family: item.family,
            alertThreshold: item.alert_threshold
          };
        }
      }
      
      throw new Error('Failed to create vaccine');
    } catch (error) {
      console.error('Error creating vaccine:', error);
      throw error;
    }
  }

  async update(id, vaccineData) {
    try {
      const params = {
        records: [{
          Id: parseInt(id),
          Name: vaccineData.commercialName,
          commercial_name: vaccineData.commercialName,
          generic_name: vaccineData.genericName,
          family: vaccineData.family,
          alert_threshold: parseInt(vaccineData.alertThreshold)
        }]
      };
      
      const response = await apperClient.updateRecord('vaccine', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error('Failed to update vaccine');
      }
      
      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        if (failedRecords.length > 0) {
          console.error(`Failed to update ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          failedRecords.forEach(record => {
            if (record.message) toast.error(record.message);
          });
          throw new Error('Failed to update vaccine');
        }
        
        const successfulRecord = response.results.find(result => result.success);
        if (successfulRecord) {
          const item = successfulRecord.data;
          return {
            Id: item.Id,
            commercialName: item.commercial_name,
            genericName: item.generic_name,
            family: item.family,
            alertThreshold: item.alert_threshold
          };
        }
      }
      
      throw new Error('Failed to update vaccine');
    } catch (error) {
      console.error('Error updating vaccine:', error);
      throw error;
    }
  }

  async delete(id) {
    try {
      const params = {
        RecordIds: [parseInt(id)]
      };
      
      const response = await apperClient.deleteRecord('vaccine', params);
      
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
      console.error('Error deleting vaccine:', error);
      throw error;
    }
  }
}

export const vaccineService = new VaccineService();