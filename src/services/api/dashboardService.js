import { format, startOfMonth, endOfMonth, subMonths, isWithinInterval } from "date-fns";

function delay(ms = 300) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

class DashboardService {
  constructor() {
    this.contactService = null;
    this.dealService = null;
    this.taskService = null;
  }

  async getServices() {
    if (!this.contactService) {
      const contactServiceModule = await import('./contactService.js');
      const dealServiceModule = await import('./dealService.js');
      const taskServiceModule = await import('./taskService.js');
      
      this.contactService = contactServiceModule.default;
      this.dealService = dealServiceModule.default;
      this.taskService = taskServiceModule.default;
    }
    
    return {
      contacts: this.contactService,
      deals: this.dealService,
      tasks: this.taskService
    };
  }

  async getMetrics(timeRange = 'thisMonth') {
    await delay(200);
    
    const { deals } = await this.getServices();
    const allDeals = await deals.getAll();
    
    const now = new Date();
    const currentMonth = {
      start: startOfMonth(now),
      end: endOfMonth(now)
    };
    const lastMonth = {
      start: startOfMonth(subMonths(now, 1)),
      end: endOfMonth(subMonths(now, 1))
    };

    // Filter deals by time range
    const currentDeals = allDeals.filter(deal => {
      const dealDate = new Date(deal.updated_at_c || deal.ModifiedOn);
      return isWithinInterval(dealDate, currentMonth);
    });

    const lastMonthDeals = allDeals.filter(deal => {
      const dealDate = new Date(deal.updated_at_c || deal.ModifiedOn);
      return isWithinInterval(dealDate, lastMonth);
    });

    // Calculate metrics
    const totalPipelineValue = allDeals
      .filter(deal => deal.stage_c !== 'Closed Won' && deal.stage_c !== 'Closed Lost')
      .reduce((sum, deal) => sum + (deal.value_c || 0), 0);

    const closedDealsThisMonth = currentDeals.filter(deal => deal.stage_c === 'Closed Won');
    const closedDealsLastMonth = lastMonthDeals.filter(deal => deal.stage_c === 'Closed Won');

    const revenueThisMonth = closedDealsThisMonth.reduce((sum, deal) => sum + (deal.value_c || 0), 0);
    const revenueLastMonth = closedDealsLastMonth.reduce((sum, deal) => sum + (deal.value_c || 0), 0);

    const averageDealSize = closedDealsThisMonth.length > 0 
      ? revenueThisMonth / closedDealsThisMonth.length 
      : 0;

    const totalDeals = allDeals.filter(deal => deal.stage_c !== 'Closed Lost').length;
    const wonDeals = allDeals.filter(deal => deal.stage_c === 'Closed Won').length;
    const conversionRate = totalDeals > 0 ? (wonDeals / totalDeals) * 100 : 0;

    // Calculate growth percentages
    const revenueGrowth = revenueLastMonth === 0 ? 0 : 
      ((revenueThisMonth - revenueLastMonth) / revenueLastMonth) * 100;
    
    const dealsGrowth = closedDealsLastMonth.length === 0 ? 0 :
      ((closedDealsThisMonth.length - closedDealsLastMonth.length) / closedDealsLastMonth.length) * 100;

    return {
      totalPipelineValue,
      closedDealsCount: closedDealsThisMonth.length,
      averageDealSize,
      conversionRate,
      revenueThisMonth,
      growth: {
        revenue: revenueGrowth,
        deals: dealsGrowth,
        pipeline: 15.2, // Mock growth for pipeline
        conversion: 5.8 // Mock growth for conversion
      }
    };
  }

  async getPipelineData() {
    await delay(150);
    
    const { deals } = await this.getServices();
    const allDeals = await deals.getAll();
    
    // Import settings service dynamically to get current pipeline stages
    const settingsService = await import('./settingsService.js').then(m => m.default);
    const stages = settingsService.getPipelineStages();
    
    const pipelineData = stages.map(stage => {
      const stageDeals = allDeals.filter(deal => deal.stage_c === stage);
      const stageConfig = settingsService.getStageByName(stage);
      return {
        stage,
        count: stageDeals.length,
        value: stageDeals.reduce((sum, deal) => sum + (deal.value_c || 0), 0),
        winProbability: stageConfig?.winProbability || 0,
        color: stageConfig?.color || '#64748b'
      };
    });

    return pipelineData;
  }

  async getActivitySummary() {
    await delay(100);
    
    const { tasks } = await this.getServices();
    const allTasks = await tasks.getAll();
    
    const now = new Date();
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - 7);
    
    const weekTasks = allTasks.filter(task => {
      const taskDate = new Date(task.updated_at_c || task.ModifiedOn);
      return taskDate >= weekStart;
    });

    const completedTasks = weekTasks.filter(task => task.completed_c === true).length;
    const callTasks = weekTasks.filter(task => task.type_c === 'Call').length;
    const emailTasks = weekTasks.filter(task => task.type_c === 'Email').length;

    return {
      tasksCompleted: completedTasks,
      callsMade: callTasks,
      emailsSent: emailTasks,
      totalActivities: weekTasks.length
    };
  }

  async getRevenueTrends() {
    await delay(200);
    
    const { deals } = await this.getServices();
    const allDeals = await deals.getAll();
    
    const months = [];
    const revenue = [];
    
    for (let i = 5; i >= 0; i--) {
      const date = subMonths(new Date(), i);
      const monthStart = startOfMonth(date);
      const monthEnd = endOfMonth(date);
      
      const monthDeals = allDeals.filter(deal => {
        if (deal.stage_c !== 'Closed Won') return false;
        const dealDate = new Date(deal.updated_at_c || deal.ModifiedOn);
        return isWithinInterval(dealDate, { start: monthStart, end: monthEnd });
      });
      
      const monthRevenue = monthDeals.reduce((sum, deal) => sum + (deal.value_c || 0), 0);
      
      months.push(format(date, 'MMM'));
      revenue.push(monthRevenue);
    }

    return { months, revenue };
  }

  async getTopPerformers() {
    await delay(150);
    
    const { contacts, deals, tasks } = await this.getServices();
    const allContacts = await contacts.getAll();
    const allDeals = await deals.getAll();
    const allTasks = await tasks.getAll();
    
    // Top contacts by deal value
    const contactDeals = {};
    allDeals.forEach(deal => {
      if (deal.contact_id_c && deal.stage_c === 'Closed Won') {
        const contactId = deal.contact_id_c?.Id || deal.contact_id_c;
        if (!contactDeals[contactId]) {
          contactDeals[contactId] = { totalValue: 0, dealCount: 0 };
        }
        contactDeals[contactId].totalValue += deal.value_c || 0;
        contactDeals[contactId].dealCount += 1;
      }
    });

    const topContacts = Object.entries(contactDeals)
      .map(([contactId, data]) => {
        const contact = allContacts.find(c => c.Id === parseInt(contactId));
        const name = contact ? `${contact.first_name_c || ''} ${contact.last_name_c || ''}`.trim() : 'Unknown Contact';
        return {
          id: parseInt(contactId),
          name: name || 'Unknown Contact',
          company: contact ? contact.company_c : '',
          totalValue: data.totalValue,
          dealCount: data.dealCount
        };
      })
      .sort((a, b) => b.totalValue - a.totalValue)
      .slice(0, 5);

    // Most active prospects (by task count)
    const contactTasks = {};
    allTasks.forEach(task => {
      if (task.contact_id_c) {
        const contactId = task.contact_id_c?.Id || task.contact_id_c;
        contactTasks[contactId] = (contactTasks[contactId] || 0) + 1;
      }
    });

    const activeProspects = Object.entries(contactTasks)
      .map(([contactId, taskCount]) => {
        const contact = allContacts.find(c => c.Id === parseInt(contactId));
        const name = contact ? `${contact.first_name_c || ''} ${contact.last_name_c || ''}`.trim() : 'Unknown Contact';
        return {
          id: parseInt(contactId),
          name: name || 'Unknown Contact',
          company: contact ? contact.company_c : '',
          taskCount
        };
      })
      .sort((a, b) => b.taskCount - a.taskCount)
      .slice(0, 5);

    return { topContacts, activeProspects };
  }
}

const dashboardService = new DashboardService();
export default dashboardService;