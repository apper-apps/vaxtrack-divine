import { toast } from 'react-toastify';

// Initialize ApperClient
const { ApperClient } = window.ApperSDK;
const apperClient = new ApperClient({
  apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
  apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
});

class InventoryService {
  async getAll() {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "lot_number" } },
          { field: { Name: "expiration_date" } },
          { field: { Name: "quantity_on_hand" } },
          { field: { Name: "received_date" } },
          { 
            field: { Name: "vaccine_id" },
            referenceField: { 
              field: { Name: "commercial_name" }
            }
          },
          { 
            field: { Name: "vaccine_id" },
            referenceField: { 
              field: { Name: "generic_name" }
            }
          },
          { 
            field: { Name: "vaccine_id" },
            referenceField: { 
              field: { Name: "family" }
            }
          },
          { 
            field: { Name: "vaccine_id" },
            referenceField: { 
              field: { Name: "alert_threshold" }
            }
          }
        ]
      };
      
      const response = await apperClient.fetchRecords('inventory', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }
      
      return response.data.map(item => ({
        Id: item.Id,
        vaccineId: item.vaccine_id?.Id || null,
        lotNumber: item.lot_number,
        expirationDate: item.expiration_date,
        quantityOnHand: item.quantity_on_hand,
        receivedDate: item.received_date,
        vaccine: item.vaccine_id ? {
          Id: item.vaccine_id.Id,
          commercialName: item.vaccine_id.commercial_name,
          genericName: item.vaccine_id.generic_name,
          family: item.vaccine_id.family,
          alertThreshold: item.vaccine_id.alert_threshold
        } : null
      }));
    } catch (error) {
      console.error('Error fetching inventory:', error);
      toast.error('Failed to fetch inventory');
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
          { field: { Name: "lot_number" } },
          { field: { Name: "expiration_date" } },
          { field: { Name: "quantity_on_hand" } },
          { field: { Name: "received_date" } },
          { 
            field: { Name: "vaccine_id" },
            referenceField: { 
              field: { Name: "commercial_name" }
            }
          }
        ]
      };
      
      const response = await apperClient.getRecordById('inventory', parseInt(id), params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error('Inventory item not found');
      }
      
      const item = response.data;
      return {
        Id: item.Id,
        vaccineId: item.vaccine_id?.Id || null,
        lotNumber: item.lot_number,
        expirationDate: item.expiration_date,
        quantityOnHand: item.quantity_on_hand,
        receivedDate: item.received_date,
        vaccine: item.vaccine_id ? {
          Id: item.vaccine_id.Id,
          commercialName: item.vaccine_id.commercial_name,
          genericName: item.vaccine_id.generic_name,
          family: item.vaccine_id.family,
          alertThreshold: item.vaccine_id.alert_threshold
        } : null
      };
    } catch (error) {
      console.error('Error fetching inventory item:', error);
      throw error;
    }
  }

  async create(inventoryData) {
    try {
      const params = {
        records: [{
          Name: `${inventoryData.lotNumber}`,
          vaccine_id: parseInt(inventoryData.vaccineId),
          lot_number: inventoryData.lotNumber,
          expiration_date: inventoryData.expirationDate,
          quantity_on_hand: parseInt(inventoryData.quantityOnHand),
          received_date: inventoryData.receivedDate
        }]
      };
      
      const response = await apperClient.createRecord('inventory', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error('Failed to create inventory item');
      }
      
      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          failedRecords.forEach(record => {
            if (record.message) toast.error(record.message);
          });
          throw new Error('Failed to create inventory item');
        }
        
        const successfulRecord = response.results.find(result => result.success);
        if (successfulRecord) {
          return await this.getById(successfulRecord.data.Id);
        }
      }
      
      throw new Error('Failed to create inventory item');
    } catch (error) {
      console.error('Error creating inventory item:', error);
      throw error;
    }
  }

  async update(id, inventoryData) {
    try {
      const params = {
        records: [{
          Id: parseInt(id),
          Name: inventoryData.lotNumber || `${inventoryData.lotNumber}`,
          vaccine_id: parseInt(inventoryData.vaccineId),
          lot_number: inventoryData.lotNumber,
          expiration_date: inventoryData.expirationDate,
          quantity_on_hand: parseInt(inventoryData.quantityOnHand),
          received_date: inventoryData.receivedDate
        }]
      };
      
      const response = await apperClient.updateRecord('inventory', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error('Failed to update inventory item');
      }
      
      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        if (failedRecords.length > 0) {
          console.error(`Failed to update ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          failedRecords.forEach(record => {
            if (record.message) toast.error(record.message);
          });
          throw new Error('Failed to update inventory item');
        }
        
        const successfulRecord = response.results.find(result => result.success);
        if (successfulRecord) {
          return await this.getById(successfulRecord.data.Id);
        }
      }
      
      throw new Error('Failed to update inventory item');
    } catch (error) {
      console.error('Error updating inventory item:', error);
      throw error;
    }
  }

  async delete(id) {
    try {
      const params = {
        RecordIds: [parseInt(id)]
      };
      
      const response = await apperClient.deleteRecord('inventory', params);
      
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
      console.error('Error deleting inventory item:', error);
      throw error;
    }
  }
}

export const inventoryService = new InventoryService();