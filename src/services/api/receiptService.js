import receiptsData from '@/services/mockData/receipts.json';

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class ReceiptService {
  constructor() {
    this.receipts = [...receiptsData];
  }

  async getAll() {
    await delay(300);
    return [...this.receipts];
  }

  async getById(id) {
    await delay(200);
    const receipt = this.receipts.find(r => r.Id === parseInt(id));
    if (!receipt) {
      throw new Error('Receipt not found');
    }
    return { ...receipt };
  }

  async create(receiptData) {
    await delay(400);
    const newId = Math.max(...this.receipts.map(r => r.Id), 0) + 1;
    const newReceipt = {
      Id: newId,
      ...receiptData
    };
    this.receipts.push(newReceipt);
    return { ...newReceipt };
  }

  async update(id, receiptData) {
    await delay(400);
    const index = this.receipts.findIndex(r => r.Id === parseInt(id));
    if (index === -1) {
      throw new Error('Receipt not found');
    }
    
    this.receipts[index] = {
      ...this.receipts[index],
      ...receiptData,
      Id: parseInt(id)
    };
    
    return { ...this.receipts[index] };
  }

  async delete(id) {
    await delay(300);
    const index = this.receipts.findIndex(r => r.Id === parseInt(id));
    if (index === -1) {
      throw new Error('Receipt not found');
    }
    
    this.receipts.splice(index, 1);
    return true;
  }
}

export const receiptService = new ReceiptService();