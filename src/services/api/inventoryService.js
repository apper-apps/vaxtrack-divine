import inventoryData from '@/services/mockData/inventory.json';
import { vaccineService } from './vaccineService';

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class InventoryService {
  constructor() {
    this.inventory = [...inventoryData];
  }

  async getAll() {
    await delay(300);
    
    // Enrich with vaccine data
    const vaccines = await vaccineService.getAll();
    const enrichedInventory = this.inventory.map(item => {
      const vaccine = vaccines.find(v => v.Id === item.vaccineId);
      return {
        ...item,
        vaccine: vaccine || null
      };
    });
    
    return enrichedInventory;
  }

  async getById(id) {
    await delay(200);
    const item = this.inventory.find(i => i.Id === parseInt(id));
    if (!item) {
      throw new Error('Inventory item not found');
    }
    
    // Enrich with vaccine data
    const vaccines = await vaccineService.getAll();
    const vaccine = vaccines.find(v => v.Id === item.vaccineId);
    
    return {
      ...item,
      vaccine: vaccine || null
    };
  }

  async create(inventoryData) {
    await delay(400);
    const newId = Math.max(...this.inventory.map(i => i.Id), 0) + 1;
    const newItem = {
      Id: newId,
      ...inventoryData
    };
    this.inventory.push(newItem);
    
    // Return enriched data
    const vaccines = await vaccineService.getAll();
    const vaccine = vaccines.find(v => v.Id === newItem.vaccineId);
    
    return {
      ...newItem,
      vaccine: vaccine || null
    };
  }

  async update(id, inventoryData) {
    await delay(400);
    const index = this.inventory.findIndex(i => i.Id === parseInt(id));
    if (index === -1) {
      throw new Error('Inventory item not found');
    }
    
    this.inventory[index] = {
      ...this.inventory[index],
      ...inventoryData,
      Id: parseInt(id)
    };
    
    // Return enriched data
    const vaccines = await vaccineService.getAll();
    const vaccine = vaccines.find(v => v.Id === this.inventory[index].vaccineId);
    
    return {
      ...this.inventory[index],
      vaccine: vaccine || null
    };
  }

  async delete(id) {
    await delay(300);
    const index = this.inventory.findIndex(i => i.Id === parseInt(id));
    if (index === -1) {
      throw new Error('Inventory item not found');
    }
    
    this.inventory.splice(index, 1);
    return true;
  }
}

export const inventoryService = new InventoryService();