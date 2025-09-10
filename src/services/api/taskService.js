import tasksData from "@/services/mockData/tasks.json";

// Simulate network delay
const delay = (ms = 300) => new Promise(resolve => setTimeout(resolve, ms));

class TaskService {
  constructor() {
    this.tasks = [...tasksData];
  }

  async getAll() {
    await delay();
    return [...this.tasks].sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
  }

  async getById(id) {
    await delay(200);
    const task = this.tasks.find(task => task.Id === parseInt(id));
    if (!task) {
      throw new Error("Task not found");
    }
    return { ...task };
  }

  async create(taskData) {
    await delay(400);
    
    const newTask = {
      Id: Math.max(...this.tasks.map(t => t.Id), 0) + 1,
      ...taskData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.tasks.push(newTask);
    return { ...newTask };
  }

  async update(id, taskData) {
    await delay(350);
    
    const index = this.tasks.findIndex(task => task.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Task not found");
    }

    const updatedTask = {
      ...this.tasks[index],
      ...taskData,
      updatedAt: new Date().toISOString()
    };
this.tasks[index] = updatedTask;
    return { ...updatedTask };
  }

  async delete(id) {
    await delay(250);
    
    const index = this.tasks.findIndex(task => task.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Task not found");
    }

    const deletedTask = { ...this.tasks[index] };
    this.tasks.splice(index, 1);
    return deletedTask;
  }

  async markComplete(id, data) {
    await delay(200);
    
    const index = this.tasks.findIndex(task => task.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Task not found");
    }

    const updatedTask = {
      ...this.tasks[index],
      ...data,
      updatedAt: new Date().toISOString()
    };

this.tasks[index] = updatedTask;
    return { ...updatedTask };
  }

async getByContactId(contactId) {
    await delay(200);
    return [...this.tasks]
      .filter(task => task.contactId === parseInt(contactId))
      .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
  }

  async getActivityMetrics() {
    await delay(150);
    const completed = this.tasks.filter(task => task.status === 'Completed').length;
    const pending = this.tasks.filter(task => task.status === 'Pending').length;
    const overdue = this.tasks.filter(task => {
      if (task.status === 'Completed') return false;
      return new Date(task.dueDate) < new Date();
    }).length;

    return { completed, pending, overdue, total: this.tasks.length };
  }
}
export default new TaskService();