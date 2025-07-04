import administrationsData from '@/services/mockData/administrations.json';

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class AdministrationService {
  constructor() {
    this.administrations = [...administrationsData];
  }

  async getAll() {
    await delay(300);
    return [...this.administrations];
  }

  async getById(id) {
    await delay(200);
    const administration = this.administrations.find(a => a.Id === parseInt(id));
    if (!administration) {
      throw new Error('Administration record not found');
    }
    return { ...administration };
  }

  async create(administrationData) {
    await delay(400);
    const newId = Math.max(...this.administrations.map(a => a.Id), 0) + 1;
    const newAdministration = {
      Id: newId,
      ...administrationData
    };
    this.administrations.push(newAdministration);
    return { ...newAdministration };
  }

  async update(id, administrationData) {
    await delay(400);
    const index = this.administrations.findIndex(a => a.Id === parseInt(id));
    if (index === -1) {
      throw new Error('Administration record not found');
    }
    
    this.administrations[index] = {
      ...this.administrations[index],
      ...administrationData,
      Id: parseInt(id)
    };
    
    return { ...this.administrations[index] };
  }

  async delete(id) {
    await delay(300);
    const index = this.administrations.findIndex(a => a.Id === parseInt(id));
    if (index === -1) {
      throw new Error('Administration record not found');
    }
    
    this.administrations.splice(index, 1);
    return true;
  }
}

export const administrationService = new AdministrationService();