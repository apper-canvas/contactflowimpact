const delay = (ms = 300) => new Promise(resolve => setTimeout(resolve, ms));

// Default settings data
const defaultSettings = {
  pipeline: {
    stages: [
      { Id: 1, name: 'Lead', winProbability: 10, order: 1, color: '#64748b' },
      { Id: 2, name: 'Qualified', winProbability: 25, order: 2, color: '#3b82f6' },
      { Id: 3, name: 'Proposal', winProbability: 50, order: 3, color: '#f59e0b' },
      { Id: 4, name: 'Negotiation', winProbability: 75, order: 4, color: '#10b981' },
      { Id: 5, name: 'Closed Won', winProbability: 100, order: 5, color: '#059669' }
    ]
  },
taskTypes: [
    { Id: 1, name: 'Call', color: '#3b82f6', defaultDuration: 30, priority: 'Medium' },
    { Id: 2, name: 'Email', color: '#10b981', defaultDuration: 15, priority: 'Low' },
    { Id: 3, name: 'Meeting', color: '#f59e0b', defaultDuration: 60, priority: 'High' },
    { Id: 4, name: 'Follow-up', color: '#8b5cf6', defaultDuration: 15, priority: 'Medium' },
    { Id: 5, name: 'Demo', color: '#ef4444', defaultDuration: 90, priority: 'High' }
  ],
  contactFields: [
    { Id: 1, name: 'company', label: 'Company', type: 'text', required: true, visible: true },
    { Id: 2, name: 'title', label: 'Job Title', type: 'text', required: false, visible: true },
    { Id: 3, name: 'phone', label: 'Phone', type: 'phone', required: false, visible: true },
    { Id: 4, name: 'email', label: 'Email', type: 'email', required: true, visible: true },
    { Id: 5, name: 'industry', label: 'Industry', type: 'select', required: false, visible: true },
    { Id: 6, name: 'source', label: 'Lead Source', type: 'select', required: false, visible: true }
  ],
  preferences: {
    currency: 'USD',
    dateFormat: 'MM/dd/yyyy',
    timeFormat: '12h',
    theme: 'light',
    notifications: {
      email: true,
      desktop: true,
      dealUpdates: true,
      taskReminders: true
    },
    dashboard: {
      defaultTimeRange: 'thisMonth',
      showRevenueTrends: true,
      showTopPerformers: true,
      showActivitySummary: true
    }
  }
};

class SettingsService {
  constructor() {
    this.settings = this.loadSettings();
  }

  loadSettings() {
    const saved = localStorage.getItem('crm-settings');
    return saved ? JSON.parse(saved) : { ...defaultSettings };
  }

  saveSettings() {
    localStorage.setItem('crm-settings', JSON.stringify(this.settings));
  }

  // Pipeline Settings
  async getPipelineSettings() {
    await delay();
    return { ...this.settings.pipeline };
  }

  async updatePipelineStages(stages) {
    await delay();
    this.settings.pipeline.stages = stages.map((stage, index) => ({
      ...stage,
      order: index + 1
    }));
    this.saveSettings();
    return this.settings.pipeline.stages;
  }

  async addPipelineStage(stageData) {
    await delay();
    const newId = Math.max(...this.settings.pipeline.stages.map(s => s.Id)) + 1;
    const newStage = {
      Id: newId,
      name: stageData.name,
      winProbability: stageData.winProbability || 0,
      order: this.settings.pipeline.stages.length + 1,
      color: stageData.color || '#64748b'
    };
    this.settings.pipeline.stages.push(newStage);
    this.saveSettings();
    return newStage;
  }

  async deletePipelineStage(id) {
    await delay();
    this.settings.pipeline.stages = this.settings.pipeline.stages.filter(s => s.Id !== id);
    this.saveSettings();
    return true;
  }

// Task Types Settings
  async getTaskTypes() {
    await delay();
    return [...this.settings.taskTypes];
  }
async updateTaskTypes(taskTypes) {
    await delay();
    this.settings.taskTypes = taskTypes;
    this.saveSettings();
    return this.settings.taskTypes;
  }
async addTaskType(taskTypeData) {
    await delay();
    const maxId = Math.max(...this.settings.taskTypes.map(t => t.Id), 0);
    const newTaskType = {
      Id: maxId + 1,
      name: taskTypeData.name || 'New Task Type',
      defaultDuration: taskTypeData.defaultDuration || 30,
      priority: taskTypeData.priority || 'Medium',
      color: taskTypeData.color || '#3b82f6'
    };
    
    this.settings.taskTypes.push(newTaskType);
    this.saveSettings();
    return newTaskType;
  }
  async deleteTaskType(id) {
    await delay();
    const taskTypeExists = this.settings.taskTypes.find(t => t.Id === id);
    if (!taskTypeExists) {
      throw new Error('Task type not found');
    }
    
    this.settings.taskTypes = this.settings.taskTypes.filter(t => t.Id !== id);
    this.saveSettings();
    return true;
  }

  // Contact Fields Settings
  async getContactFields() {
    await delay();
    return [...this.settings.contactFields];
  }

  async updateContactFields(fields) {
    await delay();
    this.settings.contactFields = fields;
    this.saveSettings();
    return this.settings.contactFields;
  }

  // General Preferences
  async getPreferences() {
    await delay();
    return { ...this.settings.preferences };
  }

  async updatePreferences(preferences) {
    await delay();
    this.settings.preferences = { ...this.settings.preferences, ...preferences };
    this.saveSettings();
    return this.settings.preferences;
  }

  // Get pipeline stages for other services
  getPipelineStages() {
    return this.settings.pipeline.stages
      .sort((a, b) => a.order - b.order)
      .map(stage => stage.name);
  }

  getStageByName(stageName) {
    return this.settings.pipeline.stages.find(stage => stage.name === stageName);
  }
}

const settingsService = new SettingsService();
export default settingsService;