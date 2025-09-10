import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import Loading from "@/components/ui/Loading";
import Input from "@/components/atoms/Input";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Label from "@/components/atoms/Label";
import dealService from "@/services/api/dealService";
import contactService from "@/services/api/contactService";

const PIPELINE_STAGES = [
  { id: 'Lead', label: 'Lead', color: 'bg-neutral-100 text-neutral-700' },
  { id: 'Qualified', label: 'Qualified', color: 'bg-primary-100 text-primary-700' },
  { id: 'Proposal', label: 'Proposal', color: 'bg-accent-100 text-accent-700' },
  { id: 'Negotiation', label: 'Negotiation', color: 'bg-warning-100 text-warning-700' },
  { id: 'Closed', label: 'Closed', color: 'bg-success-100 text-success-700' }
];

const DealCard = ({ deal, contact, onDragStart, onDragEnd }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <Card
      className="p-4 mb-3 cursor-grab active:cursor-grabbing hover:shadow-card-hover transition-shadow"
      draggable
      onDragStart={(e) => onDragStart(e, deal)}
      onDragEnd={onDragEnd}
    >
      <div className="space-y-3">
        <div>
          <h3 className="font-medium text-neutral-900 mb-1">{deal.title}</h3>
          <p className="text-sm text-neutral-600">{contact?.name || 'Unknown Contact'}</p>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-lg font-semibold text-success-600">
            {formatCurrency(deal.value)}
          </span>
          <span className="text-sm text-neutral-500">
            {formatDate(deal.expectedCloseDate)}
          </span>
        </div>
        
        {deal.probability && (
          <div className="flex items-center space-x-2">
            <div className="flex-1 bg-neutral-200 rounded-full h-2">
              <div
                className="bg-primary-500 h-2 rounded-full transition-all"
                style={{ width: `${deal.probability}%` }}
              />
            </div>
            <span className="text-xs text-neutral-500">{deal.probability}%</span>
          </div>
        )}
      </div>
    </Card>
  );
};

const DealModal = ({ isOpen, onClose, onSave, contacts }) => {
  const [formData, setFormData] = useState({
    title: '',
    contactId: '',
    value: '',
    expectedCloseDate: '',
    notes: '',
    stage: 'Lead',
    probability: 50
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setFormData({
        title: '',
        contactId: '',
        value: '',
        expectedCloseDate: '',
        notes: '',
        stage: 'Lead',
        probability: 50
      });
    }
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.contactId || !formData.value) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    try {
      const dealData = {
        ...formData,
        contactId: parseInt(formData.contactId),
        value: parseFloat(formData.value),
        probability: parseInt(formData.probability)
      };
      
      await onSave(dealData);
      onClose();
      toast.success('Deal created successfully');
    } catch (error) {
      toast.error(`Failed to create deal: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-modal max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-neutral-900">Add New Deal</h2>
            <button
              onClick={onClose}
              className="text-neutral-400 hover:text-neutral-600 transition-colors"
            >
              <ApperIcon name="X" size={24} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="title" required>Company/Deal Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleChange('title', e.target.value)}
                placeholder="Enter deal title"
                required
              />
            </div>

            <div>
              <Label htmlFor="contactId" required>Contact Person</Label>
              <select
                id="contactId"
                value={formData.contactId}
                onChange={(e) => handleChange('contactId', e.target.value)}
                className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                required
              >
                <option value="">Select a contact</option>
                {contacts.map(contact => (
                  <option key={contact.Id} value={contact.Id}>
                    {contact.name} - {contact.company}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <Label htmlFor="value" required>Deal Value</Label>
              <Input
                id="value"
                type="number"
                step="0.01"
                value={formData.value}
                onChange={(e) => handleChange('value', e.target.value)}
                placeholder="0.00"
                required
              />
            </div>

            <div>
              <Label htmlFor="expectedCloseDate" required>Expected Close Date</Label>
              <Input
                id="expectedCloseDate"
                type="date"
                value={formData.expectedCloseDate}
                onChange={(e) => handleChange('expectedCloseDate', e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="probability">Probability (%)</Label>
              <Input
                id="probability"
                type="range"
                min="0"
                max="100"
                value={formData.probability}
                onChange={(e) => handleChange('probability', e.target.value)}
                className="w-full"
              />
              <div className="text-center text-sm text-neutral-600 mt-1">
                {formData.probability}%
              </div>
            </div>

            <div>
              <Label htmlFor="notes">Notes</Label>
              <textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => handleChange('notes', e.target.value)}
                placeholder="Additional notes..."
                className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                rows="3"
              />
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Creating...' : 'Create Deal'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

const DealsPage = () => {
  const [deals, setDeals] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [draggedDeal, setDraggedDeal] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  const loadDeals = async () => {
    try {
      setLoading(true);
      const [dealsData, contactsData] = await Promise.all([
        dealService.getAll(),
        contactService.getAll()
      ]);
      setDeals(dealsData);
      setContacts(contactsData);
      setError(null);
    } catch (err) {
      setError(`Failed to load deals: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDeals();
  }, []);

  const handleCreateDeal = async (dealData) => {
    const newDeal = await dealService.create(dealData);
    setDeals(prev => [...prev, newDeal]);
  };
const handleCreateDeal = async (dealData) => {
    const newDeal = await dealService.create(dealData);
    setDeals(prev => [...prev, newDeal]);
  };

  const handleDragStart = (e, deal) => {
    setDraggedDeal(deal);
    setIsDragging(true);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragEnd = () => {
    setIsDragging(false);
    setDraggedDeal(null);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = async (e, targetStage) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (!draggedDeal || draggedDeal.stage === targetStage) {
      setDraggedDeal(null);
      return;
    }

    try {
      const updatedDeal = await dealService.update(draggedDeal.Id, {
        stage: targetStage
      });
      
      setDeals(prev => prev.map(deal => 
        deal.Id === draggedDeal.Id ? updatedDeal : deal
      ));
      
      toast.success(`Deal moved to ${targetStage}`);
    } catch (error) {
      toast.error(`Failed to update deal: ${error.message}`);
    } finally {
      setDraggedDeal(null);
    }
  };
const getStageTotal = (stage) => {
    return deals
      .filter(deal => deal.stage === stage)
      .reduce((sum, deal) => sum + deal.value, 0);
  };

  const getDealsByStage = (stage) => {
    return deals.filter(deal => deal.stage === stage || (stage === 'Lead' && !deal.stage));
  };

  const getContactById = (contactId) => {
    return contacts.find(contact => contact.Id === contactId);
  };

  if (loading) return <Loading message="Loading deals..." />;
  if (error) return <Error message={error} onRetry={loadDeals} showRetry />;

  const totalDeals = deals.length;
  const totalValue = deals.reduce((sum, deal) => sum + deal.value, 0);

  // Calculate stage totals
  const stageTotals = PIPELINE_STAGES.reduce((acc, stage) => {
    acc[stage.id] = getStageTotal(stage.id);
    return acc;
  }, {});

  return (
    <div className="flex-1 overflow-auto">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-neutral-900">Sales Pipeline</h1>
            <p className="text-neutral-600 mt-1">
              {totalDeals} deals • Total value: ${totalValue.toLocaleString()}
            </p>
          </div>
          <Button 
            variant="primary" 
            onClick={() => setIsModalOpen(true)}
          >
            <ApperIcon name="Plus" size={16} className="mr-2" />
            Add Deal
          </Button>
        </div>

        {/* Pipeline Value Totals */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          {PIPELINE_STAGES.map((stage) => (
            <Card key={stage.id} className="p-4">
              <div className="text-sm font-medium text-neutral-600 mb-1">
                {stage.label}
              </div>
              <div className="text-lg font-bold text-neutral-900">
                ${stageTotals[stage.id].toLocaleString()}
              </div>
              <div className="text-xs text-neutral-500">
                {deals.filter(deal => deal.stage === stage.id).length} deals
              </div>
            </Card>
          ))}
        </div>

        {/* Pipeline Board */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          {PIPELINE_STAGES.map((stage) => {
            const stageDeals = getDealsByStage(stage.id);
            const isDropTarget = isDragging && draggedDeal?.stage !== stage.id;
            
            return (
              <div
                key={stage.id}
                className={`bg-neutral-50 rounded-lg p-4 min-h-[600px] transition-all duration-200 ${
                  isDropTarget 
                    ? 'bg-primary-50 border-2 border-primary-200 border-dashed' 
                    : 'border border-neutral-200'
                }`}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, stage.id)}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-neutral-900 flex items-center gap-2">
                    <span className={`w-3 h-3 rounded-full ${stage.color.split(' ')[0]}`}></span>
                    {stage.label}
                  </h3>
                  <span className="text-sm text-neutral-500">
                    {stageDeals.length}
                  </span>
                </div>
                
                <div className="space-y-3">
                  {stageDeals.map((deal) => {
                    const contact = getContactById(deal.contactId);
                    return (
                      <DealCard
                        key={deal.Id}
                        deal={deal}
                        contact={contact}
                        onDragStart={handleDragStart}
                        onDragEnd={handleDragEnd}
                        isDragging={draggedDeal?.Id === deal.Id}
                      />
                    );
                  })}
                  
                  {isDropTarget && (
                    <div className="border-2 border-primary-300 border-dashed rounded-lg p-4 text-center text-primary-600 bg-primary-25">
                      <ApperIcon name="MoveHorizontal" size={20} className="mx-auto mb-2" />
                      <p className="text-sm font-medium">Drop here to move to {stage.label}</p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
</div>

        {totalDeals === 0 ? (
          <Empty
            title="No deals yet"
            message="Start tracking your sales opportunities by creating your first deal."
            actionLabel="Add Deal"
            onAction={() => setIsModalOpen(true)}
          />
        ) : (
          /* Pipeline Board */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {PIPELINE_STAGES.map(stage => {
              const stageDeals = getDealsByStage(stage.id);
              const stageValue = stageDeals.reduce((sum, deal) => sum + deal.value, 0);
              
              return (
                <div key={stage.id} className="flex flex-col">
                  {/* Stage Header */}
                  <div className={`px-4 py-3 rounded-lg ${stage.color} mb-4`}>
                    <div className="flex justify-between items-center">
                      <h3 className="font-medium">{stage.label}</h3>
                      <span className="text-sm">({stageDeals.length})</span>
                    </div>
                    <p className="text-sm mt-1 opacity-75">
                      ${stageValue.toLocaleString()}
                    </p>
                  </div>

                  {/* Drop Zone */}
                  <div
                    className={`flex-1 min-h-[400px] p-3 rounded-lg border-2 border-dashed transition-colors ${
                      draggedDeal && draggedDeal.stage !== stage.id
                        ? 'border-primary-300 bg-primary-50'
                        : 'border-neutral-200'
                    }`}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, stage.id)}
                  >
                    {stageDeals.length === 0 ? (
                      <div className="flex items-center justify-center h-32 text-neutral-400">
                        <p className="text-sm">No deals</p>
                      </div>
                    ) : (
                      stageDeals.map(deal => (
                        <DealCard
                          key={deal.Id}
                          deal={deal}
                          contact={getContactById(deal.contactId)}
                          onDragStart={handleDragStart}
                          onDragEnd={handleDragEnd}
                        />
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <DealModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleCreateDeal}
          contacts={contacts}
        />
      </div>
    </div>
  );
};

export default DealsPage;