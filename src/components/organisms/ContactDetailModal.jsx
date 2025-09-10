import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { format } from "date-fns";
import { toast } from "react-toastify";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";
import contactService from "@/services/api/contactService";
import taskService from "@/services/api/taskService";
import { cn } from "@/utils/cn";

const ContactDetailModal = ({ isOpen, onClose, contact, onContactEdit, onContactDeleted }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [contactTasks, setContactTasks] = useState([]);
  const [loadingTasks, setLoadingTasks] = useState(false);

  useEffect(() => {
    if (isOpen && contact) {
      loadContactTasks();
    }
  }, [isOpen, contact]);

  const loadContactTasks = async () => {
    if (!contact?.Id) return;
    
    try {
      setLoadingTasks(true);
      const tasks = await taskService.getByContactId(contact.Id);
      setContactTasks(tasks);
    } catch (error) {
      console.error('Failed to load contact tasks:', error);
    } finally {
      setLoadingTasks(false);
    }
  };
  if (!isOpen || !contact) return null;

  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), "MMMM d, yyyy 'at' h:mm a");
    } catch (error) {
      return "Invalid date";
    }
  };

const getInitials = (firstName, lastName) => {
    return `${firstName?.charAt(0) || ""}${lastName?.charAt(0) || ""}`.toUpperCase();
  };

  const getTaskStatusColor = (task) => {
    if (task.completed) return "success";
    const isOverdue = new Date(task.dueDate) < new Date();
    return isOverdue ? "error" : "warning";
  };

  const getTaskStatusText = (task) => {
    if (task.completed) return "Completed";
    const isOverdue = new Date(task.dueDate) < new Date();
    return isOverdue ? "Overdue" : "Pending";
  };
  const handleEdit = () => {
    onContactEdit(contact);
    onClose();
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await contactService.delete(contact.Id);
      toast.success("Contact deleted successfully!");
      onContactDeleted?.(contact.Id);
      onClose();
    } catch (error) {
      toast.error(error.message || "Failed to delete contact");
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  const handleClose = () => {
    if (isDeleting) return;
    setShowDeleteConfirm(false);
    onClose();
  };

  return createPortal(
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm transition-opacity"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className={cn(
          "relative w-full max-w-2xl bg-white rounded-2xl shadow-modal transform transition-all",
          "animate-scale-in"
        )}>
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-neutral-100">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white font-semibold text-lg">
                {getInitials(contact.firstName, contact.lastName)}
              </div>
              <div>
                <h2 className="text-xl font-semibold text-neutral-900">
                  {contact.firstName} {contact.lastName}
                </h2>
                {contact.jobTitle && contact.company && (
                  <p className="text-neutral-600">
                    {contact.jobTitle} at {contact.company}
                  </p>
                )}
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                onClick={handleEdit}
                variant="outline"
                size="sm"
                disabled={isDeleting}
              >
                <ApperIcon name="Edit" className="w-4 h-4 mr-1" />
                Edit
              </Button>
              <button
                onClick={handleClose}
                disabled={isDeleting}
                className="p-2 hover:bg-neutral-100 rounded-lg transition-colors duration-200 disabled:opacity-50"
              >
                <ApperIcon name="X" className="w-5 h-5 text-neutral-500" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Contact Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="font-semibold text-neutral-900">Contact Information</h3>
                
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <ApperIcon name="Mail" className="w-5 h-5 text-neutral-400 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-neutral-500">Email</p>
                      <a 
                        href={`mailto:${contact.email}`}
                        className="text-primary-600 hover:text-primary-700 transition-colors"
                      >
                        {contact.email}
                      </a>
                    </div>
                  </div>

                  {contact.phone && (
                    <div className="flex items-center space-x-3">
                      <ApperIcon name="Phone" className="w-5 h-5 text-neutral-400 flex-shrink-0" />
                      <div>
                        <p className="text-sm text-neutral-500">Phone</p>
                        <a 
                          href={`tel:${contact.phone}`}
                          className="text-primary-600 hover:text-primary-700 transition-colors"
                        >
                          {contact.phone}
                        </a>
                      </div>
                    </div>
                  )}

                  {contact.address && (
                    <div className="flex items-start space-x-3">
                      <ApperIcon name="MapPin" className="w-5 h-5 text-neutral-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm text-neutral-500">Address</p>
                        <p className="text-neutral-900">{contact.address}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-neutral-900">Professional Details</h3>
                
                <div className="space-y-3">
                  {contact.company && (
                    <div className="flex items-center space-x-3">
                      <ApperIcon name="Building" className="w-5 h-5 text-neutral-400 flex-shrink-0" />
                      <div>
                        <p className="text-sm text-neutral-500">Company</p>
                        <p className="text-neutral-900">{contact.company}</p>
                      </div>
                    </div>
                  )}

                  {contact.jobTitle && (
                    <div className="flex items-center space-x-3">
                      <ApperIcon name="Briefcase" className="w-5 h-5 text-neutral-400 flex-shrink-0" />
                      <div>
                        <p className="text-sm text-neutral-500">Job Title</p>
                        <p className="text-neutral-900">{contact.jobTitle}</p>
                      </div>
                    </div>
                  )}

                  {contact.tags && contact.tags.length > 0 && (
                    <div className="flex items-start space-x-3">
                      <ApperIcon name="Tag" className="w-5 h-5 text-neutral-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm text-neutral-500 mb-2">Tags</p>
                        <div className="flex flex-wrap gap-1">
                          {contact.tags.map((tag, index) => (
                            <Badge key={index} variant="primary" size="sm">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Notes */}
            {contact.notes && (
              <div className="space-y-2">
                <h3 className="font-semibold text-neutral-900">Notes</h3>
                <div className="bg-neutral-50 rounded-lg p-4">
                  <p className="text-neutral-700 whitespace-pre-wrap">{contact.notes}</p>
                </div>
              </div>
            )}

            {/* Metadata */}
            <div className="pt-4 border-t border-neutral-100">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-neutral-500">
                <div>
                  <p>Created: {formatDate(contact.createdAt)}</p>
                </div>
                <div>
                  <p>Last Updated: {formatDate(contact.updatedAt)}</p>
                </div>
</div>
            </div>

            {/* Task Interactions Timeline */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-neutral-900">Task Interactions</h3>
                <Badge variant="neutral" size="sm">
                  {contactTasks.length} task{contactTasks.length !== 1 ? 's' : ''}
                </Badge>
              </div>
              
              {loadingTasks ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600"></div>
                  <span className="ml-2 text-sm text-neutral-600">Loading tasks...</span>
                </div>
              ) : contactTasks.length === 0 ? (
                <div className="text-center py-8">
                  <ApperIcon name="CheckSquare" className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
                  <p className="text-neutral-500">No tasks associated with this contact</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {contactTasks.map((task) => (
                    <div key={task.Id} className="bg-neutral-50 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <h4 className={cn(
                              "text-sm font-medium",
                              task.completed ? "line-through text-neutral-500" : "text-neutral-900"
                            )}>
                              {task.title}
                            </h4>
                            <Badge size="sm" variant={getTaskStatusColor(task)}>
                              {getTaskStatusText(task)}
                            </Badge>
                          </div>
                          <p className="text-xs text-neutral-600 mb-2 line-clamp-2">
                            {task.description}
                          </p>
                          <div className="flex items-center space-x-4 text-xs text-neutral-500">
                            <span className="flex items-center">
                              <ApperIcon name="Calendar" className="w-3 h-3 mr-1" />
                              {formatDate(task.dueDate)}
                            </span>
                            <span className="flex items-center">
                              <ApperIcon name="Tag" className="w-3 h-3 mr-1" />
                              {task.type}
                            </span>
                            <Badge size="sm" variant="neutral">
                              {task.priority}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between p-6 bg-neutral-50 rounded-b-2xl">
            <div>
              {!showDeleteConfirm ? (
                <Button
                  onClick={() => setShowDeleteConfirm(true)}
                  variant="ghost"
                  size="sm"
                  disabled={isDeleting}
                  className="text-error-600 hover:text-error-700 hover:bg-error-50"
                >
                  <ApperIcon name="Trash2" className="w-4 h-4 mr-1" />
                  Delete Contact
                </Button>
              ) : (
                <div className="flex items-center space-x-2">
                  <p className="text-sm text-neutral-600">Are you sure?</p>
                  <Button
                    onClick={handleDelete}
                    variant="danger"
                    size="sm"
                    disabled={isDeleting}
                  >
                    {isDeleting ? (
                      <>
                        <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin mr-1" />
                        Deleting...
                      </>
                    ) : (
                      "Yes, Delete"
                    )}
                  </Button>
                  <Button
                    onClick={() => setShowDeleteConfirm(false)}
                    variant="ghost"
                    size="sm"
                    disabled={isDeleting}
                  >
                    Cancel
                  </Button>
                </div>
              )}
            </div>

            <div className="flex items-center space-x-3">
              <Button
                onClick={handleClose}
                variant="secondary"
                disabled={isDeleting}
              >
                Close
              </Button>
              <Button
                onClick={handleEdit}
                variant="primary"
                disabled={isDeleting}
              >
                <ApperIcon name="Edit" className="w-4 h-4 mr-2" />
                Edit Contact
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default ContactDetailModal;