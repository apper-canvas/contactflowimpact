import contactsData from "@/services/mockData/contacts.json";
import dealsData from "@/services/mockData/deals.json";
import tasksData from "@/services/mockData/tasks.json";
import { format, startOfMonth, endOfMonth, subMonths, isWithinInterval } from "date-fns";

function delay(ms = 300) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

class DashboardService {
  constructor() {
    this.contacts = [...contactsData];
    this.deals = [...dealsData];
    this.tasks = [...tasksData];
  }

  async getMetrics(timeRange = 'thisMonth') {
    await delay(200);
    
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
    const currentDeals = this.deals.filter(deal => {
      const dealDate = new Date(deal.updatedAt);
      return isWithinInterval(dealDate, currentMonth);
    });

    const lastMonthDeals = this.deals.filter(deal => {
      const dealDate = new Date(deal.updatedAt);
      return isWithinInterval(dealDate, lastMonth);
    });

    // Calculate metrics
    const totalPipelineValue = this.deals
      .filter(deal => deal.stage !== 'Closed Won' && deal.stage !== 'Closed Lost')
      .reduce((sum, deal) => sum + (deal.value || 0), 0);

    const closedDealsThisMonth = currentDeals.filter(deal => deal.stage === 'Closed Won');
    const closedDealsLastMonth = lastMonthDeals.filter(deal => deal.stage === 'Closed Won');

    const revenueThisMonth = closedDealsThisMonth.reduce((sum, deal) => sum + (deal.value || 0), 0);
    const revenueLastMonth = closedDealsLastMonth.reduce((sum, deal) => sum + (deal.value || 0), 0);

    const averageDealSize = closedDealsThisMonth.length > 0 
      ? revenueThisMonth / closedDealsThisMonth.length 
      : 0;

    const totalDeals = this.deals.filter(deal => deal.stage !== 'Closed Lost').length;
    const wonDeals = this.deals.filter(deal => deal.stage === 'Closed Won').length;
    const conversionRate = totalDeals > 0 ? (wonDeals / totalDeals) * 100 : 0;

    // Calculate growth percentages
    const revenueGrowth = lastMonth === 0 ? 0 : 
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
    
// Import settings service dynamically to get current pipeline stages
    const settingsService = await import('./settingsService.js').then(m => m.default);
    const stages = settingsService.getPipelineStages();
    
    const pipelineData = stages.map(stage => {
      const stageDeals = this.deals.filter(deal => deal.stage === stage);
      const stageConfig = settingsService.getStageByName(stage);
      return {
        stage,
        count: stageDeals.length,
        value: stageDeals.reduce((sum, deal) => sum + (deal.value || 0), 0),
        winProbability: stageConfig?.winProbability || 0,
        color: stageConfig?.color || '#64748b'
      };
    });

    return pipelineData;
  }

  async getActivitySummary() {
    await delay(100);
    
    const now = new Date();
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - 7);
    
    const weekTasks = this.tasks.filter(task => {
      const taskDate = new Date(task.updatedAt);
      return taskDate >= weekStart;
    });

    const completedTasks = weekTasks.filter(task => task.status === 'Completed').length;
    const callTasks = weekTasks.filter(task => task.type === 'Call').length;
    const emailTasks = weekTasks.filter(task => task.type === 'Email').length;

    return {
      tasksCompleted: completedTasks,
      callsMade: callTasks,
      emailsSent: emailTasks,
      totalActivities: weekTasks.length
    };
  }

  async getRevenueTrends() {
    await delay(200);
    
    const months = [];
    const revenue = [];
    
    for (let i = 5; i >= 0; i--) {
      const date = subMonths(new Date(), i);
      const monthStart = startOfMonth(date);
      const monthEnd = endOfMonth(date);
      
      const monthDeals = this.deals.filter(deal => {
        if (deal.stage !== 'Closed Won') return false;
        const dealDate = new Date(deal.updatedAt);
        return isWithinInterval(dealDate, { start: monthStart, end: monthEnd });
      });
      
      const monthRevenue = monthDeals.reduce((sum, deal) => sum + (deal.value || 0), 0);
      
      months.push(format(date, 'MMM'));
      revenue.push(monthRevenue);
    }

    return { months, revenue };
  }

  async getTopPerformers() {
    await delay(150);
    
    // Top contacts by deal value
    const contactDeals = {};
    this.deals.forEach(deal => {
      if (deal.contactId && deal.stage === 'Closed Won') {
        if (!contactDeals[deal.contactId]) {
          contactDeals[deal.contactId] = { totalValue: 0, dealCount: 0 };
        }
        contactDeals[deal.contactId].totalValue += deal.value || 0;
        contactDeals[deal.contactId].dealCount += 1;
      }
    });

    const topContacts = Object.entries(contactDeals)
      .map(([contactId, data]) => {
        const contact = this.contacts.find(c => c.Id === parseInt(contactId));
        return {
          id: parseInt(contactId),
          name: contact ? contact.name : 'Unknown Contact',
          company: contact ? contact.company : '',
          totalValue: data.totalValue,
          dealCount: data.dealCount
        };
      })
      .sort((a, b) => b.totalValue - a.totalValue)
      .slice(0, 5);

    // Most active prospects (by task count)
    const contactTasks = {};
    this.tasks.forEach(task => {
      if (task.contactId) {
        contactTasks[task.contactId] = (contactTasks[task.contactId] || 0) + 1;
      }
    });

    const activeProspects = Object.entries(contactTasks)
      .map(([contactId, taskCount]) => {
        const contact = this.contacts.find(c => c.Id === parseInt(contactId));
        return {
          id: parseInt(contactId),
          name: contact ? contact.name : 'Unknown Contact',
          company: contact ? contact.company : '',
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