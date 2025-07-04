import { toast } from 'react-toastify';

// Initialize ApperClient
const { ApperClient } = window.ApperSDK;
const apperClient = new ApperClient({
  apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
  apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
});

class ReceiptService {
  async getAll() {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "vaccine_id" } },
          { field: { Name: "lot_number" } },
          { field: { Name: "quantity_sent" } },
          { field: { Name: "quantity_received" } },
          { field: { Name: "passed_inspection" } },
          { field: { Name: "failed_inspection" } },
          { field: { Name: "discrepancy_reason" } },
          { field: { Name: "received_date" } }
        ]
      };
      
      const response = await apperClient.fetchRecords('receipt', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }
      
      return response.data.map(item => ({
        Id: item.Id,
        vaccineId: item.vaccine_id,
        lotNumber: item.lot_number,
        quantitySent: item.quantity_sent,
        quantityReceived: item.quantity_received,
        passedInspection: item.passed_inspection,
        failedInspection: item.failed_inspection,
        discrepancyReason: item.discrepancy_reason,
        receivedDate: item.received_date
      }));
    } catch (error) {
      console.error('Error fetching receipts:', error);
      toast.error('Failed to fetch receipts');
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
          { field: { Name: "vaccine_id" } },
          { field: { Name: "lot_number" } },
          { field: { Name: "quantity_sent" } },
          { field: { Name: "quantity_received" } },
          { field: { Name: "passed_inspection" } },
          { field: { Name: "failed_inspection" } },
          { field: { Name: "discrepancy_reason" } },
          { field: { Name: "received_date" } }
        ]
      };
      
      const response = await apperClient.getRecordById('receipt', parseInt(id), params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error('Receipt not found');
      }
      
      const item = response.data;
      return {
        Id: item.Id,
        vaccineId: item.vaccine_id,
        lotNumber: item.lot_number,
        quantitySent: item.quantity_sent,
        quantityReceived: item.quantity_received,
        passedInspection: item.passed_inspection,
        failedInspection: item.failed_inspection,
        discrepancyReason: item.discrepancy_reason,
        receivedDate: item.received_date
      };
    } catch (error) {
      console.error('Error fetching receipt:', error);
      throw error;
    }
  }

  async create(receiptData) {
    try {
      const params = {
        records: [{
          Name: `Receipt ${receiptData.lotNumber}`,
          vaccine_id: parseInt(receiptData.vaccineId),
          lot_number: receiptData.lotNumber,
          quantity_sent: parseInt(receiptData.quantitySent),
          quantity_received: parseInt(receiptData.quantityReceived),
          passed_inspection: parseInt(receiptData.passedInspection),
          failed_inspection: parseInt(receiptData.failedInspection),
          discrepancy_reason: receiptData.discrepancyReason || '',
          received_date: receiptData.receivedDate
        }]
      };
      
      const response = await apperClient.createRecord('receipt', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error('Failed to create receipt');
      }
      
      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          failedRecords.forEach(record => {
            if (record.message) toast.error(record.message);
          });
          throw new Error('Failed to create receipt');
        }
        
        const successfulRecord = response.results.find(result => result.success);
        if (successfulRecord) {
          const item = successfulRecord.data;
          return {
            Id: item.Id,
            vaccineId: item.vaccine_id,
            lotNumber: item.lot_number,
            quantitySent: item.quantity_sent,
            quantityReceived: item.quantity_received,
            passedInspection: item.passed_inspection,
            failedInspection: item.failed_inspection,
            discrepancyReason: item.discrepancy_reason,
            receivedDate: item.received_date
          };
        }
      }
      
      throw new Error('Failed to create receipt');
    } catch (error) {
      console.error('Error creating receipt:', error);
      throw error;
    }
  }

  async update(id, receiptData) {
    try {
      const params = {
        records: [{
          Id: parseInt(id),
          Name: `Receipt ${receiptData.lotNumber}`,
          vaccine_id: parseInt(receiptData.vaccineId),
          lot_number: receiptData.lotNumber,
          quantity_sent: parseInt(receiptData.quantitySent),
          quantity_received: parseInt(receiptData.quantityReceived),
          passed_inspection: parseInt(receiptData.passedInspection),
          failed_inspection: parseInt(receiptData.failedInspection),
          discrepancy_reason: receiptData.discrepancyReason || '',
          received_date: receiptData.receivedDate
        }]
      };
      
      const response = await apperClient.updateRecord('receipt', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error('Failed to update receipt');
      }
      
      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        if (failedRecords.length > 0) {
          console.error(`Failed to update ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          failedRecords.forEach(record => {
            if (record.message) toast.error(record.message);
          });
          throw new Error('Failed to update receipt');
        }
        
        const successfulRecord = response.results.find(result => result.success);
        if (successfulRecord) {
          const item = successfulRecord.data;
          return {
            Id: item.Id,
            vaccineId: item.vaccine_id,
            lotNumber: item.lot_number,
            quantitySent: item.quantity_sent,
            quantityReceived: item.quantity_received,
            passedInspection: item.passed_inspection,
            failedInspection: item.failed_inspection,
            discrepancyReason: item.discrepancy_reason,
            receivedDate: item.received_date
          };
        }
      }
      
      throw new Error('Failed to update receipt');
    } catch (error) {
      console.error('Error updating receipt:', error);
      throw error;
    }
  }

  async delete(id) {
    try {
      const params = {
        RecordIds: [parseInt(id)]
      };
      
      const response = await apperClient.deleteRecord('receipt', params);
      
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
      console.error('Error deleting receipt:', error);
      throw error;
    }
  }
}

export const receiptService = new ReceiptService();