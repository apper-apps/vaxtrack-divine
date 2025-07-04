import lossesData from '@/services/mockData/losses.json';

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class LossService {
  constructor() {
    this.losses = [...lossesData];
  }

  async getAll() {
    await delay(300);
    return [...this.losses];
  }

  async getById(id) {
    await delay(200);
    const loss = this.losses.find(l => l.Id === parseInt(id));
    if (!loss) {
      throw new Error('Loss record not found');
    }
    return { ...loss };
  }

  async create(lossData) {
    await delay(400);
    const newId = Math.max(...this.losses.map(l => l.Id), 0) + 1;
    const newLoss = {
      Id: newId,
      ...lossData
    };
    this.losses.push(newLoss);
    return { ...newLoss };
  }

  async update(id, lossData) {
    await delay(400);
    const index = this.losses.findIndex(l => l.Id === parseInt(id));
    if (index === -1) {
      throw new Error('Loss record not found');
    }
    
    this.losses[index] = {
      ...this.losses[index],
      ...lossData,
      Id: parseInt(id)
    };
    
    return { ...this.losses[index] };
  }

  async delete(id) {
    await delay(300);
    const index = this.losses.findIndex(l => l.Id === parseInt(id));
    if (index === -1) {
      throw new Error('Loss record not found');
    }
    
    this.losses.splice(index, 1);
    return true;
  }
}

export const lossService = new LossService();