import vaccinesData from '@/services/mockData/vaccines.json';

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class VaccineService {
  constructor() {
    this.vaccines = [...vaccinesData];
  }

  async getAll() {
    await delay(300);
    return [...this.vaccines];
  }

  async getById(id) {
    await delay(200);
    const vaccine = this.vaccines.find(v => v.Id === parseInt(id));
    if (!vaccine) {
      throw new Error('Vaccine not found');
    }
    return { ...vaccine };
  }

  async create(vaccineData) {
    await delay(400);
    const newId = Math.max(...this.vaccines.map(v => v.Id), 0) + 1;
    const newVaccine = {
      Id: newId,
      ...vaccineData
    };
    this.vaccines.push(newVaccine);
    return { ...newVaccine };
  }

  async update(id, vaccineData) {
    await delay(400);
    const index = this.vaccines.findIndex(v => v.Id === parseInt(id));
    if (index === -1) {
      throw new Error('Vaccine not found');
    }
    
    this.vaccines[index] = {
      ...this.vaccines[index],
      ...vaccineData,
      Id: parseInt(id)
    };
    
    return { ...this.vaccines[index] };
  }

  async delete(id) {
    await delay(300);
    const index = this.vaccines.findIndex(v => v.Id === parseInt(id));
    if (index === -1) {
      throw new Error('Vaccine not found');
    }
    
    this.vaccines.splice(index, 1);
    return true;
  }
}

export const vaccineService = new VaccineService();