import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Label from "@/components/atoms/Label";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import taskService from "@/services/api/taskService";
import contactService from "@/services/api/contactService";
import dealService from "@/services/api/dealService";
import { cn } from "@/utils/cn";
import { format } from "date-fns";

const TasksPage = () => {
  const [tasks, setTasks] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterPriority, setFilterPriority] = useState("all");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    type: "Call",
    title: "",
    description: "",
    dueDate: "",
    dueTime: "",
    contactId: "",
    dealId: "",
    priority: "Medium"
  });

  const taskTypes = [
    { value: "Call", label: "Call", icon: "Phone" },
    { value: "Email", label: "Email", icon: "Mail" },
    { value: "Meeting", label: "Meeting", icon: "Calendar" },
    { value: "Follow-up", label: "Follow-up", icon: "Clock" },
    { value: "Custom", label: "Custom", icon: "CheckSquare" }
  ];

  const priorities = [
    { value: "Low", label: "Low", color: "text-neutral-600 bg-neutral-100" },
    { value: "Medium", label: "Medium", color: "text-warning-600 bg-warning-100" },
    { value: "High", label: "High", color: "text-error-600 bg-error-100" }
  ];

useEffect(() => {
    loadData();
  }, []);

  // Check for overdue tasks and show notifications
  const checkOverdueTasks = () => {
    const now = new Date();
    const overdueTasks = tasks.filter(task => 
      !task.completed && new Date(task.dueDate) < now
    );
    
    if (overdueTasks.length > 0) {
      toast.warning(`You have ${overdueTasks.length} overdue task${overdueTasks.length > 1 ? 's' : ''}!`);
    }
  };

  useEffect(() => {
    if (tasks.length > 0) {
      checkOverdueTasks();
    }
  }, [tasks]);

  const isTaskOverdue = (task) => {
    if (task.completed) return false;
    return new Date(task.dueDate) < new Date();
  };

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [tasksData, contactsData, dealsData] = await Promise.all([
        taskService.getAll(),
        contactService.getAll(),
        dealService.getAll()
      ]);
      
      setTasks(tasksData);
      setContacts(contactsData);
      setDeals(dealsData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getTaskTypeIcon = (type) => {
    const taskType = taskTypes.find(t => t.value === type);
    return taskType ? taskType.icon : "CheckSquare";
  };

  const getPriorityColor = (priority) => {
    const priorityConfig = priorities.find(p => p.value === priority);
    return priorityConfig ? priorityConfig.color : "text-neutral-600 bg-neutral-100";
  };

  const getContactName = (contactId) => {
    const contact = contacts.find(c => c.Id === contactId);
    return contact ? `${contact.firstName} ${contact.lastName}` : "";
  };

  const getDealName = (dealId) => {
    const deal = deals.find(d => d.Id === dealId);
    return deal ? deal.title : "";
  };

  const formatDateTime = (dateString) => {
    try {
      return format(new Date(dateString), "MMM d, yyyy 'at' h:mm a");
    } catch {
      return "Invalid date";
    }
  };

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === "all" || 
                         (filterStatus === "completed" && task.completed) ||
                         (filterStatus === "pending" && !task.completed);
    
    const matchesPriority = filterPriority === "all" || task.priority === filterPriority;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  const handleTaskSelect = (task) => {
    setSelectedTask(task);
    setShowForm(false);
  };

  const handleNewTask = () => {
    setSelectedTask(null);
    setShowForm(true);
    setFormData({
      type: "Call",
      title: "",
      description: "",
      dueDate: "",
      dueTime: "",
      contactId: "",
      dealId: "",
      priority: "Medium"
    });
  };

  const handleEditTask = (task) => {
    setSelectedTask(task);
    setShowForm(true);
    const dueDate = new Date(task.dueDate);
    setFormData({
      type: task.type || "Call",
      title: task.title,
      description: task.description,
      dueDate: dueDate.toISOString().split('T')[0],
      dueTime: dueDate.toTimeString().slice(0, 5),
      contactId: task.contactId || "",
      dealId: task.dealId || "",
      priority: task.priority
    });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      toast.error("Task title is required");
      return;
    }

    setIsSubmitting(true);
    
    try {
      const dueDateTime = new Date(`${formData.dueDate}T${formData.dueTime || '09:00'}`).toISOString();
      
      const taskData = {
        ...formData,
        dueDate: dueDateTime,
        contactId: formData.contactId ? parseInt(formData.contactId) : null,
        dealId: formData.dealId ? parseInt(formData.dealId) : null
      };
      
      if (selectedTask && showForm) {
        await taskService.update(selectedTask.Id, taskData);
        toast.success("Task updated successfully!");
      } else {
        await taskService.create(taskData);
        toast.success("Task created successfully!");
      }
      
      await loadData();
      setShowForm(false);
      setSelectedTask(null);
    } catch (err) {
      toast.error(err.message || "Failed to save task");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleMarkComplete = async (task) => {
    try {
      await taskService.markComplete(task.Id, { completed: !task.completed });
      toast.success(task.completed ? "Task marked as pending" : "Task completed!");
      await loadData();
    } catch (err) {
      toast.error(err.message || "Failed to update task");
    }
  };

  const handleDeleteTask = async (task) => {
    if (!confirm("Are you sure you want to delete this task?")) return;
    
    try {
      await taskService.delete(task.Id);
      toast.success("Task deleted successfully!");
      await loadData();
      setSelectedTask(null);
      setShowForm(false);
    } catch (err) {
      toast.error(err.message || "Failed to delete task");
    }
  };

  if (loading) {
    return (
      <div className="flex-1 overflow-auto">
        <div className="max-w-7xl mx-auto p-6">
          <Loading message="Loading tasks..." />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 overflow-auto">
        <div className="max-w-7xl mx-auto p-6">
          <Error message={error} onRetry={loadData} />
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-auto">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-neutral-900">Tasks & Activities</h1>
              <p className="text-neutral-600">Manage your tasks and track activities</p>
            </div>
            <Button onClick={handleNewTask} variant="primary">
              <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
              New Task
            </Button>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-4 p-4 bg-white rounded-lg border border-neutral-200">
            <div className="flex-1 min-w-64">
              <Input
                placeholder="Search tasks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="all">All Tasks</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
            </select>

            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="all">All Priorities</option>
              <option value="High">High Priority</option>
              <option value="Medium">Medium Priority</option>
              <option value="Low">Low Priority</option>
            </select>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Task List */}
          <div className="lg:col-span-1 space-y-4">
            <div className="bg-white rounded-lg border border-neutral-200 overflow-hidden">
              <div className="p-4 border-b border-neutral-200">
                <h2 className="font-semibold text-neutral-900">
                  Tasks ({filteredTasks.length})
                </h2>
              </div>
              
              <div className="max-h-96 overflow-y-auto">
                {filteredTasks.length === 0 ? (
                  <div className="p-8">
                    <Empty
                      title="No tasks found"
                      message="Create your first task to get started."
                      actionLabel="New Task"
                      onAction={handleNewTask}
                      icon="CheckSquare"
                    />
                  </div>
                ) : (
                  <div className="space-y-1">
{filteredTasks.map((task) => (
                      <div
                        key={task.Id}
                        onClick={() => handleTaskSelect(task)}
                        className={cn(
                          "p-4 border-b border-neutral-100 cursor-pointer transition-colors hover:bg-neutral-50",
                          selectedTask?.Id === task.Id && "bg-primary-50 border-primary-200",
                          isTaskOverdue(task) && "bg-red-50 border-red-200 hover:bg-red-100"
                        )}
                      >
                        <div className="flex items-start space-x-3">
                          <div className="flex-shrink-0 mt-1">
                            <ApperIcon name={getTaskTypeIcon(task.type)} className="w-4 h-4 text-neutral-600" />
                          </div>
                          <div className="flex-1 min-w-0">
<div className="flex items-center justify-between mb-1">
                              <div className="flex items-center space-x-2 flex-1 min-w-0">
                                <h3 className={cn(
                                  "text-sm font-medium truncate",
                                  task.completed ? "line-through text-neutral-500" : "text-neutral-900",
                                  isTaskOverdue(task) && !task.completed && "text-red-900"
                                )}>
                                  {task.title}
                                </h3>
                                {isTaskOverdue(task) && !task.completed && (
                                  <Badge size="sm" className="bg-red-100 text-red-800">
                                    Overdue
                                  </Badge>
                                )}
                              </div>
                              <Badge
                                size="sm"
                                className={getPriorityColor(task.priority)}
                              >
                                {task.priority}
                              </Badge>
                            </div>
                            <p className="text-xs text-neutral-600 mb-2 line-clamp-2">
                              {task.description}
                            </p>
<div className="flex items-center justify-between text-xs">
                              <span className={cn(
                                isTaskOverdue(task) && !task.completed ? "text-red-600 font-medium" : "text-neutral-500"
                              )}>
                                {formatDateTime(task.dueDate)}
                              </span>
                              {task.contactId && (
                                <span className="truncate ml-2">
                                  {getContactName(task.contactId)}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Task Details/Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg border border-neutral-200 h-fit">
              {showForm ? (
                <div>
                  <div className="p-4 border-b border-neutral-200">
                    <h2 className="font-semibold text-neutral-900">
                      {selectedTask ? "Edit Task" : "New Task"}
                    </h2>
                  </div>
                  
                  <form onSubmit={handleFormSubmit} className="p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label required>Task Type</Label>
                        <select
                          value={formData.type}
                          onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
                          className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                          required
                        >
                          {taskTypes.map(type => (
                            <option key={type.value} value={type.value}>
                              {type.label}
                            </option>
                          ))}
                        </select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label required>Priority</Label>
                        <select
                          value={formData.priority}
                          onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value }))}
                          className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                          required
                        >
                          {priorities.map(priority => (
                            <option key={priority.value} value={priority.value}>
                              {priority.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label required>Title</Label>
                      <Input
                        value={formData.title}
                        onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                        placeholder="Enter task title"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Description</Label>
                      <textarea
                        value={formData.description}
                        onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Enter task description"
                        rows={3}
                        className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label required>Due Date</Label>
                        <Input
                          type="date"
                          value={formData.dueDate}
                          onChange={(e) => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Due Time</Label>
                        <Input
                          type="time"
                          value={formData.dueTime}
                          onChange={(e) => setFormData(prev => ({ ...prev, dueTime: e.target.value }))}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Associated Contact</Label>
                        <select
                          value={formData.contactId}
                          onChange={(e) => setFormData(prev => ({ ...prev, contactId: e.target.value }))}
                          className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                        >
                          <option value="">Select a contact</option>
                          {contacts.map(contact => (
                            <option key={contact.Id} value={contact.Id}>
                              {contact.firstName} {contact.lastName}
                            </option>
                          ))}
                        </select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Associated Deal</Label>
                        <select
                          value={formData.dealId}
                          onChange={(e) => setFormData(prev => ({ ...prev, dealId: e.target.value }))}
                          className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                        >
                          <option value="">Select a deal</option>
                          {deals.map(deal => (
                            <option key={deal.Id} value={deal.Id}>
                              {deal.title}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="flex items-center justify-end space-x-3 pt-4 border-t border-neutral-100">
                      <Button
                        type="button"
                        variant="secondary"
                        onClick={() => setShowForm(false)}
                        disabled={isSubmitting}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                            {selectedTask ? "Updating..." : "Creating..."}
                          </>
                        ) : (
                          <>
                            <ApperIcon name={selectedTask ? "Save" : "Plus"} className="w-4 h-4 mr-2" />
                            {selectedTask ? "Update Task" : "Create Task"}
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                </div>
              ) : selectedTask ? (
                <div>
                  <div className="p-4 border-b border-neutral-200">
                    <div className="flex items-center justify-between">
                      <h2 className="font-semibold text-neutral-900">Task Details</h2>
                      <div className="flex items-center space-x-2">
                        <Button
                          onClick={() => handleEditTask(selectedTask)}
                          variant="outline"
                          size="sm"
                        >
                          <ApperIcon name="Edit" className="w-4 h-4 mr-1" />
                          Edit
                        </Button>
                        <Button
                          onClick={() => handleMarkComplete(selectedTask)}
                          variant={selectedTask.completed ? "secondary" : "primary"}
                          size="sm"
                        >
                          <ApperIcon name={selectedTask.completed ? "RotateCcw" : "Check"} className="w-4 h-4 mr-1" />
                          {selectedTask.completed ? "Mark Pending" : "Mark Complete"}
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-6 space-y-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 rounded-lg bg-primary-100 flex items-center justify-center">
                        <ApperIcon name={getTaskTypeIcon(selectedTask.type)} className="w-6 h-6 text-primary-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className={cn(
                            "text-xl font-semibold",
                            selectedTask.completed ? "line-through text-neutral-500" : "text-neutral-900"
                          )}>
                            {selectedTask.title}
                          </h3>
                          <Badge className={getPriorityColor(selectedTask.priority)}>
                            {selectedTask.priority}
                          </Badge>
                          <Badge variant={selectedTask.completed ? "success" : "warning"}>
                            {selectedTask.completed ? "Completed" : "Pending"}
                          </Badge>
                        </div>
                        <p className="text-sm text-neutral-600 mb-4">
                          {selectedTask.type} • {formatDateTime(selectedTask.dueDate)}
                        </p>
                      </div>
                    </div>

                    {selectedTask.description && (
                      <div className="space-y-2">
                        <h4 className="font-medium text-neutral-900">Description</h4>
                        <p className="text-neutral-700 bg-neutral-50 rounded-lg p-3">
                          {selectedTask.description}
                        </p>
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {selectedTask.contactId && (
                        <div className="space-y-2">
                          <h4 className="font-medium text-neutral-900">Associated Contact</h4>
                          <div className="flex items-center space-x-2">
                            <ApperIcon name="User" className="w-4 h-4 text-neutral-400" />
                            <span className="text-neutral-700">
                              {getContactName(selectedTask.contactId)}
                            </span>
                          </div>
                        </div>
                      )}

                      {selectedTask.dealId && (
                        <div className="space-y-2">
                          <h4 className="font-medium text-neutral-900">Associated Deal</h4>
                          <div className="flex items-center space-x-2">
                            <ApperIcon name="DollarSign" className="w-4 h-4 text-neutral-400" />
                            <span className="text-neutral-700">
                              {getDealName(selectedTask.dealId)}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="pt-4 border-t border-neutral-100">
                      <Button
                        onClick={() => handleDeleteTask(selectedTask)}
                        variant="ghost"
                        size="sm"
                        className="text-error-600 hover:text-error-700 hover:bg-error-50"
                      >
                        <ApperIcon name="Trash2" className="w-4 h-4 mr-1" />
                        Delete Task
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-8">
                  <Empty
                    title="Select a task"
                    message="Choose a task from the list to view details or create a new one."
                    actionLabel="New Task"
                    onAction={handleNewTask}
                    icon="CheckSquare"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TasksPage;