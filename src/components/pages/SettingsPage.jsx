import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import settingsService from '@/services/api/settingsService';
import Card from '@/components/atoms/Card';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import Label from '@/components/atoms/Label';
import ApperIcon from '@/components/ApperIcon';

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState('pipeline');
  const [loading, setLoading] = useState(true);
  const [pipelineStages, setPipelineStages] = useState([]);
  const [taskTypes, setTaskTypes] = useState([]);
  const [contactFields, setContactFields] = useState([]);
  const [preferences, setPreferences] = useState({});
  const [draggedItem, setDraggedItem] = useState(null);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const [pipeline, tasks, fields, prefs] = await Promise.all([
        settingsService.getPipelineSettings(),
        settingsService.getTaskTypes(),
        settingsService.getContactFields(),
        settingsService.getPreferences()
      ]);
      setPipelineStages(pipeline.stages);
      setTaskTypes(tasks);
      setContactFields(fields);
      setPreferences(prefs);
    } catch (error) {
      toast.error('Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const handleDragStart = (e, index) => {
    setDraggedItem(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = async (e, dropIndex) => {
    e.preventDefault();
    if (draggedItem === null) return;

    const newStages = [...pipelineStages];
    const draggedStage = newStages[draggedItem];
    newStages.splice(draggedItem, 1);
    newStages.splice(dropIndex, 0, draggedStage);

    setPipelineStages(newStages);
    setDraggedItem(null);

    try {
      await settingsService.updatePipelineStages(newStages);
      toast.success('Pipeline stages reordered successfully');
    } catch (error) {
      toast.error('Failed to update pipeline order');
      loadSettings(); // Revert on error
    }
  };

  const handleStageUpdate = async (stageId, field, value) => {
    const updatedStages = pipelineStages.map(stage =>
      stage.Id === stageId ? { ...stage, [field]: value } : stage
    );
    setPipelineStages(updatedStages);

    try {
      await settingsService.updatePipelineStages(updatedStages);
      toast.success('Pipeline stage updated');
    } catch (error) {
      toast.error('Failed to update stage');
      loadSettings();
    }
  };

  const handleAddStage = async () => {
    const stageName = prompt('Enter stage name:');
    if (!stageName) return;

    try {
      const newStage = await settingsService.addPipelineStage({
        name: stageName,
        winProbability: 0,
        color: '#64748b'
      });
      setPipelineStages([...pipelineStages, newStage]);
      toast.success('Pipeline stage added');
    } catch (error) {
      toast.error('Failed to add stage');
    }
  };

  const handleDeleteStage = async (stageId) => {
    if (!confirm('Are you sure you want to delete this stage? This will affect existing deals.')) return;

    try {
      await settingsService.deletePipelineStage(stageId);
      setPipelineStages(pipelineStages.filter(s => s.Id !== stageId));
      toast.success('Pipeline stage deleted');
    } catch (error) {
      toast.error('Failed to delete stage');
    }
  };

const handleTaskTypeUpdate = async (taskId, field, value) => {
    const updatedTypes = taskTypes.map(type =>
      type.Id === taskId ? { ...type, [field]: value } : type
    );
    setTaskTypes(updatedTypes);

    try {
      await settingsService.updateTaskTypes(updatedTypes);
      toast.success('Task type updated');
    } catch (error) {
      toast.error('Failed to update task type');
      loadSettings();
    }
  };

  const handleAddTaskType = async () => {
    try {
      const newTaskType = await settingsService.addTaskType({
        name: 'New Task Type',
        defaultDuration: 30,
        priority: 'Medium',
        color: '#3b82f6'
      });
      setTaskTypes([...taskTypes, newTaskType]);
      toast.success('Task type added');
    } catch (error) {
      toast.error('Failed to add task type');
    }
  };

  const handleDeleteTaskType = async (taskId) => {
    if (!confirm('Are you sure you want to delete this task type? This may affect existing tasks.')) return;

    try {
      await settingsService.deleteTaskType(taskId);
      setTaskTypes(taskTypes.filter(t => t.Id !== taskId));
      toast.success('Task type deleted');
    } catch (error) {
      toast.error('Failed to delete task type');
    }
  };

  const handleFieldToggle = async (fieldId, field, value) => {
    const updatedFields = contactFields.map(f =>
      f.Id === fieldId ? { ...f, [field]: value } : f
    );
    setContactFields(updatedFields);

    try {
      await settingsService.updateContactFields(updatedFields);
      toast.success('Contact field updated');
    } catch (error) {
      toast.error('Failed to update field');
      loadSettings();
    }
  };

  const handlePreferenceUpdate = async (category, field, value) => {
    const updatedPrefs = {
      ...preferences,
      [category]: {
        ...preferences[category],
        [field]: value
      }
    };
    setPreferences(updatedPrefs);

    try {
      await settingsService.updatePreferences(updatedPrefs);
      toast.success('Preferences updated');
    } catch (error) {
      toast.error('Failed to update preferences');
      loadSettings();
    }
  };

  const tabs = [
    { id: 'pipeline', label: 'Pipeline Setup', icon: 'GitBranch' },
    { id: 'tasks', label: 'Task Types', icon: 'CheckSquare' },
    { id: 'fields', label: 'Contact Fields', icon: 'User' },
    { id: 'preferences', label: 'General Preferences', icon: 'Settings' }
  ];

  if (loading) {
    return (
      <div className="flex-1 overflow-auto">
        <div className="max-w-7xl mx-auto p-6">
          <div className="flex items-center justify-center h-64">
            <ApperIcon name="Loader2" className="animate-spin h-8 w-8 text-primary-600" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-auto">
      <div className="max-w-7xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-neutral-900 mb-2">System Settings</h1>
          <p className="text-neutral-600">Customize your CRM to match your sales process and workflow</p>
        </div>

        {/* Tabs */}
        <div className="border-b border-neutral-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-neutral-500 hover:text-neutral-700 hover:border-neutral-300'
                }`}
              >
                <ApperIcon 
                  name={tab.icon} 
                  className={`mr-2 h-5 w-5 ${
                    activeTab === tab.id ? 'text-primary-500' : 'text-neutral-400 group-hover:text-neutral-500'
                  }`} 
                />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="space-y-6">
          {activeTab === 'pipeline' && (
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-semibold text-neutral-900">Pipeline Stages</h2>
                  <p className="text-sm text-neutral-600 mt-1">Drag to reorder stages and set win probabilities</p>
                </div>
                <Button onClick={handleAddStage} className="flex items-center">
                  <ApperIcon name="Plus" size={16} className="mr-2" />
                  Add Stage
                </Button>
              </div>
              
              <div className="space-y-3">
                {pipelineStages.map((stage, index) => (
                  <div
                    key={stage.Id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, index)}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, index)}
                    className="flex items-center gap-4 p-4 bg-neutral-50 rounded-lg border cursor-move hover:bg-neutral-100 transition-colors"
                  >
                    <ApperIcon name="GripVertical" size={20} className="text-neutral-400" />
                    
                    <div className="flex-1 grid grid-cols-3 gap-4">
                      <div>
                        <Label>Stage Name</Label>
                        <Input
                          value={stage.name}
                          onChange={(e) => handleStageUpdate(stage.Id, 'name', e.target.value)}
                          className="mt-1"
                        />
                      </div>
                      
                      <div>
                        <Label>Win Probability (%)</Label>
                        <Input
                          type="number"
                          min="0"
                          max="100"
                          value={stage.winProbability}
                          onChange={(e) => handleStageUpdate(stage.Id, 'winProbability', parseInt(e.target.value))}
                          className="mt-1"
                        />
                      </div>
                      
                      <div>
                        <Label>Color</Label>
                        <div className="flex items-center gap-2 mt-1">
                          <input
                            type="color"
                            value={stage.color}
                            onChange={(e) => handleStageUpdate(stage.Id, 'color', e.target.value)}
                            className="w-10 h-10 rounded border"
                          />
                          <span className="text-sm text-neutral-600">{stage.color}</span>
                        </div>
                      </div>
                    </div>
                    
                    {pipelineStages.length > 1 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteStage(stage.Id)}
                        className="text-error-600 hover:text-error-700 hover:bg-error-50"
                      >
                        <ApperIcon name="Trash2" size={16} />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </Card>
          )}

{activeTab === 'tasks' && (
            <Card className="p-6">
              <div className="mb-6 flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-semibold text-neutral-900">Task Types</h2>
                  <p className="text-sm text-neutral-600 mt-1">Configure task categories with default durations and priorities</p>
                </div>
                <Button onClick={handleAddTaskType} className="flex items-center gap-2">
                  <ApperIcon name="Plus" size={16} />
                  Add Task Type
                </Button>
              </div>
              
              <div className="space-y-4">
                {taskTypes.map((type) => (
                  <div key={type.Id} className="flex items-center gap-4 p-4 bg-neutral-50 rounded-lg">
                    <div className="flex-1 grid grid-cols-4 gap-4">
                      <div>
                        <Label>Task Type</Label>
                        <Input
                          value={type.name}
                          onChange={(e) => handleTaskTypeUpdate(type.Id, 'name', e.target.value)}
                          className="mt-1"
                          placeholder="Enter task type name"
                        />
                      </div>
                      
                      <div>
                        <Label>Default Duration (minutes)</Label>
                        <Input
                          type="number"
                          min="1"
                          max="480"
                          value={type.defaultDuration}
                          onChange={(e) => handleTaskTypeUpdate(type.Id, 'defaultDuration', parseInt(e.target.value) || 15)}
                          className="mt-1"
                          placeholder="15"
                        />
                      </div>
                      
                      <div>
                        <Label>Priority</Label>
                        <select
                          value={type.priority || 'Medium'}
                          onChange={(e) => handleTaskTypeUpdate(type.Id, 'priority', e.target.value)}
                          className="mt-1 w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                        >
                          <option value="Low">Low</option>
                          <option value="Medium">Medium</option>
                          <option value="High">High</option>
                        </select>
                      </div>
                      
                      <div>
                        <Label>Color</Label>
                        <input
                          type="color"
                          value={type.color}
                          onChange={(e) => handleTaskTypeUpdate(type.Id, 'color', e.target.value)}
                          className="mt-1 w-full h-10 rounded border border-neutral-300 cursor-pointer"
                        />
                      </div>
                    </div>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteTaskType(type.Id)}
                      className="text-error-600 hover:text-error-700 hover:bg-error-50 p-2"
                    >
                      <ApperIcon name="Trash2" size={16} />
                    </Button>
                  </div>
                ))}
                
                {taskTypes.length === 0 && (
                  <div className="text-center py-8 text-neutral-500">
                    <ApperIcon name="CheckSquare" size={32} className="mx-auto mb-2 opacity-50" />
                    <p>No custom task types configured</p>
                    <p className="text-sm">Click "Add Task Type" to create your first custom task type</p>
                  </div>
                )}
              </div>
            </Card>
          )}

          {activeTab === 'fields' && (
            <Card className="p-6">
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-neutral-900">Contact Fields</h2>
                <p className="text-sm text-neutral-600 mt-1">Configure which fields are visible and required</p>
              </div>
              
              <div className="space-y-4">
                {contactFields.map((field) => (
                  <div key={field.Id} className="flex items-center justify-between p-4 bg-neutral-50 rounded-lg">
                    <div className="flex items-center gap-4">
                      <div>
                        <p className="font-medium text-neutral-900">{field.label}</p>
                        <p className="text-sm text-neutral-600">{field.name} ({field.type})</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={field.visible}
                          onChange={(e) => handleFieldToggle(field.Id, 'visible', e.target.checked)}
                          className="w-4 h-4 text-primary-600 border-neutral-300 rounded focus:ring-primary-500"
                        />
                        <span className="text-sm text-neutral-700">Visible</span>
                      </label>
                      
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={field.required}
                          onChange={(e) => handleFieldToggle(field.Id, 'required', e.target.checked)}
                          className="w-4 h-4 text-primary-600 border-neutral-300 rounded focus:ring-primary-500"
                        />
                        <span className="text-sm text-neutral-700">Required</span>
                      </label>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {activeTab === 'preferences' && (
            <div className="space-y-6">
              <Card className="p-6">
                <h2 className="text-xl font-semibold text-neutral-900 mb-4">General Settings</h2>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <Label>Currency</Label>
                    <select
                      value={preferences.currency}
                      onChange={(e) => handlePreferenceUpdate('', 'currency', e.target.value)}
                      className="mt-1 w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    >
                      <option value="USD">USD - US Dollar</option>
                      <option value="EUR">EUR - Euro</option>
                      <option value="GBP">GBP - British Pound</option>
                    </select>
                  </div>
                  
                  <div>
                    <Label>Date Format</Label>
                    <select
                      value={preferences.dateFormat}
                      onChange={(e) => handlePreferenceUpdate('', 'dateFormat', e.target.value)}
                      className="mt-1 w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    >
                      <option value="MM/dd/yyyy">MM/dd/yyyy</option>
                      <option value="dd/MM/yyyy">dd/MM/yyyy</option>
                      <option value="yyyy-MM-dd">yyyy-MM-dd</option>
                    </select>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <h2 className="text-xl font-semibold text-neutral-900 mb-4">Notifications</h2>
                <div className="space-y-4">
                  {Object.entries(preferences.notifications || {}).map(([key, value]) => (
                    <label key={key} className="flex items-center justify-between">
                      <span className="text-neutral-700 capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                      <input
                        type="checkbox"
                        checked={value}
                        onChange={(e) => handlePreferenceUpdate('notifications', key, e.target.checked)}
                        className="w-4 h-4 text-primary-600 border-neutral-300 rounded focus:ring-primary-500"
                      />
                    </label>
                  ))}
                </div>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;