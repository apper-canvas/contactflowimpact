import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import Input from "@/components/atoms/Input";
import Label from "@/components/atoms/Label";
import FormField from "@/components/molecules/FormField";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import contactService from "@/services/api/contactService";
import taskService from "@/services/api/taskService";
import { cn } from "@/utils/cn";
import { format } from "date-fns";

const ContactProfilePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // Contact data state
  const [contact, setContact] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  // Tab state
  const [activeTab, setActiveTab] = useState("details");
  
  // Edit state for details tab
  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState({});
  const [saveLoading, setSaveLoading] = useState(false);
  const [editErrors, setEditErrors] = useState({});
  
  // Task data for activity tab
  const [contactTasks, setContactTasks] = useState([]);
  const [loadingTasks, setLoadingTasks] = useState(false);

  useEffect(() => {
    if (id) {
      loadContact();
    }
  }, [id]);

  const loadContact = async () => {
    try {
      setLoading(true);
      setError("");
      const contactData = await contactService.getById(parseInt(id));
      setContact(contactData);
      setEditFormData({
        firstName: contactData.firstName || "",
        lastName: contactData.lastName || "",
        email: contactData.email || "",
        phone: contactData.phone || "",
        company: contactData.company || "",
        jobTitle: contactData.jobTitle || "",
        address: contactData.address || "",
        notes: contactData.notes || ""
      });
    } catch (err) {
      setError(err.message || "Failed to load contact");
    } finally {
      setLoading(false);
    }
  };

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

  useEffect(() => {
    if (activeTab === "activity" && contact) {
      loadContactTasks();
    }
  }, [activeTab, contact]);

  const getInitials = (firstName, lastName) => {
    return `${firstName?.charAt(0) || ""}${lastName?.charAt(0) || ""}`.toUpperCase();
  };

  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), "MMMM d, yyyy 'at' h:mm a");
    } catch (error) {
      return "Invalid date";
    }
  };

  const handleEditToggle = () => {
    if (isEditing) {
      setIsEditing(false);
      setEditErrors({});
      // Reset form data to original contact data
      setEditFormData({
        firstName: contact.firstName || "",
        lastName: contact.lastName || "",
        email: contact.email || "",
        phone: contact.phone || "",
        company: contact.company || "",
        jobTitle: contact.jobTitle || "",
        address: contact.address || "",
        notes: contact.notes || ""
      });
    } else {
      setIsEditing(true);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field
    if (editErrors[name]) {
      setEditErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const validateEditForm = () => {
    const errors = {};
    
    if (!editFormData.firstName?.trim()) {
      errors.firstName = "First name is required";
    }
    if (!editFormData.lastName?.trim()) {
      errors.lastName = "Last name is required";
    }
    if (!editFormData.email?.trim()) {
      errors.email = "Email is required";
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(editFormData.email)) {
        errors.email = "Please enter a valid email address";
      }
    }
    
    return errors;
  };

  const handleSaveContact = async () => {
    const errors = validateEditForm();
    if (Object.keys(errors).length > 0) {
      setEditErrors(errors);
      return;
    }

    try {
      setSaveLoading(true);
      const updatedContact = await contactService.update(contact.Id, editFormData);
      setContact(updatedContact);
      setIsEditing(false);
      setEditErrors({});
      toast.success("Contact updated successfully!");
    } catch (error) {
      toast.error(error.message || "Failed to update contact");
      setEditErrors({ general: error.message });
    } finally {
      setSaveLoading(false);
    }
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

  const tabs = [
    { id: "details", label: "Details", icon: "User" },
    { id: "activity", label: "Activity History", icon: "Activity" },
    { id: "deals", label: "Associated Deals", icon: "DollarSign" },
    { id: "notes", label: "Notes", icon: "FileText" }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50">
        <Loading />
      </div>
    );
  }

  if (error || !contact) {
    return (
      <div className="min-h-screen bg-neutral-50">
        <Error message={error || "Contact not found"} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <div className="bg-white border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <div className="flex items-center py-4 text-sm">
            <button
              onClick={() => navigate("/contacts")}
              className="flex items-center text-primary-600 hover:text-primary-700 transition-colors"
            >
              <ApperIcon name="ArrowLeft" className="w-4 h-4 mr-1" />
              Contacts
            </button>
            <ApperIcon name="ChevronRight" className="w-4 h-4 mx-2 text-neutral-400" />
            <span className="text-neutral-600">{contact.firstName} {contact.lastName}</span>
          </div>

          {/* Contact Header */}
          <div className="py-6">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-6">
                {/* Avatar */}
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white font-bold text-2xl flex-shrink-0">
                  {getInitials(contact.firstName, contact.lastName)}
                </div>
                
                {/* Contact Info */}
                <div>
                  <h1 className="text-3xl font-bold text-neutral-900 mb-2">
                    {contact.firstName} {contact.lastName}
                  </h1>
                  {contact.jobTitle && contact.company && (
                    <p className="text-lg text-neutral-600 mb-3">
                      {contact.jobTitle} at {contact.company}
                    </p>
                  )}
                  
                  {/* Contact Methods */}
                  <div className="flex items-center space-x-6">
                    <a 
                      href={`mailto:${contact.email}`}
                      className="flex items-center text-primary-600 hover:text-primary-700 transition-colors"
                    >
                      <ApperIcon name="Mail" className="w-5 h-5 mr-2" />
                      {contact.email}
                    </a>
                    {contact.phone && (
                      <a 
                        href={`tel:${contact.phone}`}
                        className="flex items-center text-primary-600 hover:text-primary-700 transition-colors"
                      >
                        <ApperIcon name="Phone" className="w-5 h-5 mr-2" />
                        {contact.phone}
                      </a>
                    )}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center space-x-3">
                {activeTab === "details" && (
                  <>
                    {isEditing ? (
                      <div className="flex items-center space-x-2">
                        <Button
                          onClick={handleSaveContact}
                          variant="primary"
                          disabled={saveLoading}
                        >
                          {saveLoading ? (
                            <>
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                              Saving...
                            </>
                          ) : (
                            <>
                              <ApperIcon name="Save" className="w-4 h-4 mr-2" />
                              Save
                            </>
                          )}
                        </Button>
                        <Button
                          onClick={handleEditToggle}
                          variant="outline"
                          disabled={saveLoading}
                        >
                          Cancel
                        </Button>
                      </div>
                    ) : (
                      <Button
                        onClick={handleEditToggle}
                        variant="outline"
                      >
                        <ApperIcon name="Edit" className="w-4 h-4 mr-2" />
                        Edit Contact
                      </Button>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-neutral-200">
            <nav className="-mb-px flex space-x-8">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-colors",
                    activeTab === tab.id
                      ? "border-primary-500 text-primary-600"
                      : "border-transparent text-neutral-500 hover:text-neutral-700 hover:border-neutral-300"
                  )}
                >
                  <ApperIcon name={tab.icon} className="w-4 h-4 mr-2" />
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Details Tab */}
        {activeTab === "details" && (
          <div className="bg-white rounded-lg shadow-card">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-neutral-900 mb-6">Contact Details</h2>
              
              {editErrors.general && (
                <div className="mb-6 p-4 bg-error-50 border border-error-200 rounded-lg">
                  <p className="text-error-700">{editErrors.general}</p>
                </div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Personal Information */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-neutral-900 pb-2 border-b border-neutral-200">
                    Personal Information
                  </h3>
                  
                  {isEditing ? (
                    <div className="space-y-4">
                      <FormField
                        label="First Name"
                        name="firstName"
                        value={editFormData.firstName}
                        onChange={handleInputChange}
                        error={editErrors.firstName}
                        required
                      />
                      <FormField
                        label="Last Name"
                        name="lastName"
                        value={editFormData.lastName}
                        onChange={handleInputChange}
                        error={editErrors.lastName}
                        required
                      />
                      <FormField
                        label="Email"
                        name="email"
                        type="email"
                        value={editFormData.email}
                        onChange={handleInputChange}
                        error={editErrors.email}
                        required
                      />
                      <FormField
                        label="Phone"
                        name="phone"
                        value={editFormData.phone}
                        onChange={handleInputChange}
                        error={editErrors.phone}
                      />
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div>
                        <Label className="text-sm text-neutral-500">First Name</Label>
                        <p className="text-neutral-900 mt-1">{contact.firstName}</p>
                      </div>
                      <div>
                        <Label className="text-sm text-neutral-500">Last Name</Label>
                        <p className="text-neutral-900 mt-1">{contact.lastName}</p>
                      </div>
                      <div>
                        <Label className="text-sm text-neutral-500">Email</Label>
                        <p className="text-neutral-900 mt-1">{contact.email}</p>
                      </div>
                      {contact.phone && (
                        <div>
                          <Label className="text-sm text-neutral-500">Phone</Label>
                          <p className="text-neutral-900 mt-1">{contact.phone}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Professional Information */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-neutral-900 pb-2 border-b border-neutral-200">
                    Professional Information
                  </h3>
                  
                  {isEditing ? (
                    <div className="space-y-4">
                      <FormField
                        label="Company"
                        name="company"
                        value={editFormData.company}
                        onChange={handleInputChange}
                        error={editErrors.company}
                      />
                      <FormField
                        label="Job Title"
                        name="jobTitle"
                        value={editFormData.jobTitle}
                        onChange={handleInputChange}
                        error={editErrors.jobTitle}
                      />
                      <FormField
                        label="Address"
                        name="address"
                        value={editFormData.address}
                        onChange={handleInputChange}
                        error={editErrors.address}
                      />
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {contact.company && (
                        <div>
                          <Label className="text-sm text-neutral-500">Company</Label>
                          <p className="text-neutral-900 mt-1">{contact.company}</p>
                        </div>
                      )}
                      {contact.jobTitle && (
                        <div>
                          <Label className="text-sm text-neutral-500">Job Title</Label>
                          <p className="text-neutral-900 mt-1">{contact.jobTitle}</p>
                        </div>
                      )}
                      {contact.address && (
                        <div>
                          <Label className="text-sm text-neutral-500">Address</Label>
                          <p className="text-neutral-900 mt-1">{contact.address}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Notes Section */}
              <div className="mt-6 pt-6 border-t border-neutral-200">
                <h3 className="font-semibold text-neutral-900 mb-4">Notes</h3>
                {isEditing ? (
                  <FormField
                    label=""
                    name="notes"
                    type="textarea"
                    rows={4}
                    value={editFormData.notes}
                    onChange={handleInputChange}
                    error={editErrors.notes}
                    placeholder="Add any additional notes about this contact..."
                  />
                ) : contact.notes ? (
                  <div className="bg-neutral-50 rounded-lg p-4">
                    <p className="text-neutral-700 whitespace-pre-wrap">{contact.notes}</p>
                  </div>
                ) : (
                  <p className="text-neutral-500 italic">No notes added</p>
                )}
              </div>

              {/* Tags Section */}
              {contact.tags && contact.tags.length > 0 && !isEditing && (
                <div className="mt-6 pt-6 border-t border-neutral-200">
                  <h3 className="font-semibold text-neutral-900 mb-4">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {contact.tags.map((tag, index) => (
                      <Badge key={index} variant="primary" size="sm">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Metadata */}
              {!isEditing && (
                <div className="mt-6 pt-6 border-t border-neutral-200">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-neutral-500">
                    <div>
                      <p>Created: {formatDate(contact.createdAt)}</p>
                    </div>
                    <div>
                      <p>Last Updated: {formatDate(contact.updatedAt)}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Activity History Tab */}
        {activeTab === "activity" && (
          <div className="bg-white rounded-lg shadow-card">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-neutral-900">Activity History</h2>
                <Badge variant="neutral" size="sm">
                  {contactTasks.length} task{contactTasks.length !== 1 ? 's' : ''}
                </Badge>
              </div>
              
              {loadingTasks ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600"></div>
                  <span className="ml-2 text-sm text-neutral-600">Loading tasks...</span>
                </div>
              ) : contactTasks.length === 0 ? (
                <div className="text-center py-12">
                  <ApperIcon name="Activity" className="w-12 h-12 text-neutral-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-neutral-900 mb-2">No Activity Yet</h3>
                  <p className="text-neutral-500">Tasks and interactions with this contact will appear here.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {contactTasks.map((task) => (
                    <div key={task.Id} className="border border-neutral-200 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <h4 className={cn(
                              "font-medium",
                              task.completed ? "line-through text-neutral-500" : "text-neutral-900"
                            )}>
                              {task.title}
                            </h4>
                            <Badge size="sm" variant={getTaskStatusColor(task)}>
                              {getTaskStatusText(task)}
                            </Badge>
                          </div>
                          <p className="text-sm text-neutral-600 mb-3">
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
        )}

        {/* Associated Deals Tab */}
        {activeTab === "deals" && (
          <div className="bg-white rounded-lg shadow-card">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-neutral-900 mb-6">Associated Deals</h2>
              <div className="text-center py-12">
                <ApperIcon name="DollarSign" className="w-12 h-12 text-neutral-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-neutral-900 mb-2">No Deals Yet</h3>
                <p className="text-neutral-500">Deals associated with this contact will appear here.</p>
              </div>
            </div>
          </div>
        )}

        {/* Notes Tab */}
        {activeTab === "notes" && (
          <div className="bg-white rounded-lg shadow-card">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-neutral-900 mb-6">Notes</h2>
              <div className="text-center py-12">
                <ApperIcon name="FileText" className="w-12 h-12 text-neutral-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-neutral-900 mb-2">No Notes Yet</h3>
                <p className="text-neutral-500">Additional notes and communications will be tracked here.</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContactProfilePage;