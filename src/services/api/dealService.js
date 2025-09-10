import dealsData from "@/services/mockData/deals.json";

// Simulate network delay
const delay = (ms = 300) => new Promise(resolve => setTimeout(resolve, ms));

class DealService {
  constructor() {
    this.deals = [...dealsData];
  }

  async getAll() {
    await delay();
    return [...this.deals].sort((a, b) => new Date(b.expectedCloseDate) - new Date(a.expectedCloseDate));
  }

  async getById(id) {
    await delay(200);
    const deal = this.deals.find(deal => deal.Id === parseInt(id));
    if (!deal) {
      throw new Error("Deal not found");
    }
    return { ...deal };
  }

async create(dealData) {
    await delay(400);
    
    const newDeal = {
      Id: Math.max(...this.deals.map(d => d.Id), 0) + 1,
      ...dealData,
      stage: dealData.stage || 'Lead',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.deals.push(newDeal);
    return { ...newDeal };
  }

  async updateStage(id, stage) {
    await delay(200);
    
    const index = this.deals.findIndex(deal => deal.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Deal not found");
    }

    const updatedDeal = {
      ...this.deals[index],
      stage,
      updatedAt: new Date().toISOString()
    };

    this.deals[index] = updatedDeal;
    return { ...updatedDeal };
  }

  async update(id, dealData) {
    await delay(350);
    
    const index = this.deals.findIndex(deal => deal.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Deal not found");
    }

    const updatedDeal = {
      ...this.deals[index],
      ...dealData,
      updatedAt: new Date().toISOString()
    };

    this.deals[index] = updatedDeal;
    return { ...updatedDeal };
  }

  async delete(id) {
    await delay(250);
    
    const index = this.deals.findIndex(deal => deal.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Deal not found");
    }

    const deletedDeal = { ...this.deals[index] };
    this.deals.splice(index, 1);
    return deletedDeal;
  }
}

export default new DealService();