import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { toast } from "react-toastify";
import Button from "@/components/atoms/Button";
import FormField from "@/components/molecules/FormField";
import ApperIcon from "@/components/ApperIcon";
import contactService from "@/services/api/contactService";
import { cn } from "@/utils/cn";

const ContactModal = ({ isOpen, onClose, contact = null, onContactSaved }) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    company: "",
    jobTitle: "",
    address: "",
    notes: ""
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEditing = Boolean(contact);

  useEffect(() => {
    if (isOpen && contact) {
      setFormData({
        firstName: contact.firstName || "",
        lastName: contact.lastName || "",
        email: contact.email || "",
        phone: contact.phone || "",
        company: contact.company || "",
        jobTitle: contact.jobTitle || "",
        address: contact.address || "",
        notes: contact.notes || ""
      });
    } else if (isOpen && !contact) {
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        company: "",
        jobTitle: "",
        address: "",
        notes: ""
      });
    }
    
    setErrors({});
  }, [isOpen, contact]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        newErrors.email = "Please enter a valid email address";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      let savedContact;
      
      if (isEditing) {
        savedContact = await contactService.update(contact.Id, formData);
        toast.success("Contact updated successfully!");
      } else {
        savedContact = await contactService.create(formData);
        toast.success("Contact created successfully!");
      }
      
      onContactSaved?.(savedContact);
      onClose();
    } catch (error) {
      if (error.message.includes("email already exists")) {
        setErrors({ email: error.message });
      } else {
        toast.error(error.message || "Failed to save contact");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (isSubmitting) return;
    onClose();
  };

  if (!isOpen) return null;

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
          "relative w-full max-w-lg bg-white rounded-2xl shadow-modal transform transition-all",
          "animate-scale-in"
        )}>
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-neutral-100">
            <h2 className="text-xl font-semibold text-neutral-900">
              {isEditing ? "Edit Contact" : "Add New Contact"}
            </h2>
            <button
              onClick={handleClose}
              disabled={isSubmitting}
              className="p-2 hover:bg-neutral-100 rounded-lg transition-colors duration-200 disabled:opacity-50"
            >
              <ApperIcon name="X" className="w-5 h-5 text-neutral-500" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                label="First Name"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                error={errors.firstName}
                required
                placeholder="Enter first name"
              />
              <FormField
                label="Last Name"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                error={errors.lastName}
                required
                placeholder="Enter last name"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                error={errors.email}
                required
                placeholder="Enter email address"
              />
              <FormField
                label="Phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleInputChange}
                error={errors.phone}
                placeholder="Enter phone number"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                label="Company"
                name="company"
                value={formData.company}
                onChange={handleInputChange}
                error={errors.company}
                placeholder="Enter company name"
              />
              <FormField
                label="Job Title"
                name="jobTitle"
                value={formData.jobTitle}
                onChange={handleInputChange}
                error={errors.jobTitle}
                placeholder="Enter job title"
              />
            </div>

            <FormField
              label="Address"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              error={errors.address}
              placeholder="Enter address"
            />

            <div className="space-y-2">
              <label className="text-sm font-medium text-neutral-700">
                Notes
              </label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                placeholder="Add any additional notes..."
                rows={3}
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 resize-none"
              />
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end space-x-3 pt-4 border-t border-neutral-100">
              <Button
                type="button"
                variant="secondary"
                onClick={handleClose}
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
                    {isEditing ? "Updating..." : "Creating..."}
                  </>
                ) : (
                  <>
                    <ApperIcon name={isEditing ? "Save" : "Plus"} className="w-4 h-4 mr-2" />
                    {isEditing ? "Update Contact" : "Create Contact"}
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default ContactModal;