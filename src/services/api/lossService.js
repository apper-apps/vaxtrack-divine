import { toast } from 'react-toastify';

// Initialize ApperClient
const { ApperClient } = window.ApperSDK;
const apperClient = new ApperClient({
  apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
  apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
});

class LossService {
  async getAll() {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "quantity" } },
          { field: { Name: "reason" } },
          { field: { Name: "details" } },
          { field: { Name: "report_date" } },
          { field: { Name: "inventory_id" } }
        ]
      };
      
      const response = await apperClient.fetchRecords('loss', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }
      
      return response.data.map(item => ({
        Id: item.Id,
        inventoryId: item.inventory_id,
        quantity: item.quantity,
        reason: item.reason,
        details: item.details,
        reportDate: item.report_date
      }));
    } catch (error) {
      console.error('Error fetching losses:', error);
      toast.error('Failed to fetch losses');
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
          { field: { Name: "quantity" } },
          { field: { Name: "reason" } },
          { field: { Name: "details" } },
          { field: { Name: "report_date" } },
          { field: { Name: "inventory_id" } }
        ]
      };
      
      const response = await apperClient.getRecordById('loss', parseInt(id), params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error('Loss record not found');
      }
      
      const item = response.data;
      return {
        Id: item.Id,
        inventoryId: item.inventory_id,
        quantity: item.quantity,
        reason: item.reason,
        details: item.details,
        reportDate: item.report_date
      };
    } catch (error) {
      console.error('Error fetching loss:', error);
      throw error;
    }
  }

  async create(lossData) {
    try {
      const params = {
        records: [{
          Name: `Loss ${new Date().toISOString()}`,
          quantity: parseInt(lossData.quantity),
          reason: lossData.reason,
          details: lossData.details,
          report_date: lossData.reportDate,
          inventory_id: parseInt(lossData.inventoryId)
        }]
      };
      
      const response = await apperClient.createRecord('loss', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error('Failed to create loss record');
      }
      
      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          failedRecords.forEach(record => {
            if (record.message) toast.error(record.message);
          });
          throw new Error('Failed to create loss record');
        }
        
        const successfulRecord = response.results.find(result => result.success);
        if (successfulRecord) {
          const item = successfulRecord.data;
          return {
            Id: item.Id,
            inventoryId: item.inventory_id,
            quantity: item.quantity,
            reason: item.reason,
            details: item.details,
            reportDate: item.report_date
          };
        }
      }
      
      throw new Error('Failed to create loss record');
    } catch (error) {
      console.error('Error creating loss:', error);
      throw error;
    }
  }

  async update(id, lossData) {
    try {
      const params = {
        records: [{
          Id: parseInt(id),
          Name: `Loss ${new Date().toISOString()}`,
          quantity: parseInt(lossData.quantity),
          reason: lossData.reason,
          details: lossData.details,
          report_date: lossData.reportDate,
          inventory_id: parseInt(lossData.inventoryId)
        }]
      };
      
      const response = await apperClient.updateRecord('loss', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error('Failed to update loss record');
      }
      
      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        if (failedRecords.length > 0) {
          console.error(`Failed to update ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          failedRecords.forEach(record => {
            if (record.message) toast.error(record.message);
          });
          throw new Error('Failed to update loss record');
        }
        
        const successfulRecord = response.results.find(result => result.success);
        if (successfulRecord) {
          const item = successfulRecord.data;
          return {
            Id: item.Id,
            inventoryId: item.inventory_id,
            quantity: item.quantity,
            reason: item.reason,
            details: item.details,
            reportDate: item.report_date
          };
        }
      }
      
      throw new Error('Failed to update loss record');
    } catch (error) {
      console.error('Error updating loss:', error);
      throw error;
    }
  }

  async delete(id) {
    try {
      const params = {
        RecordIds: [parseInt(id)]
      };
      
      const response = await apperClient.deleteRecord('loss', params);
      
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
      console.error('Error deleting loss:', error);
      throw error;
    }
  }
}

export const lossService = new LossService();