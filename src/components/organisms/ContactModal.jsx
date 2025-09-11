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
    first_name_c: "",
    last_name_c: "",
    email_c: "",
    phone_c: "",
    company_c: "",
    job_title_c: "",
    address_c: "",
    notes_c: ""
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEditing = Boolean(contact);

  useEffect(() => {
    if (isOpen && contact) {
setFormData({
        first_name_c: contact.first_name_c || "",
        last_name_c: contact.last_name_c || "",
        email_c: contact.email_c || "",
        phone_c: contact.phone_c || "",
        company_c: contact.company_c || "",
        job_title_c: contact.job_title_c || "",
        address_c: contact.address_c || "",
        notes_c: contact.notes_c || ""
      });
    } else if (isOpen && !contact) {
      setFormData({
first_name_c: "",
        last_name_c: "",
        email_c: "",
        phone_c: "",
        company_c: "",
        job_title_c: "",
        address_c: "",
        notes_c: ""
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

if (!formData.first_name_c.trim()) {
      newErrors.first_name_c = "First name is required";
    }

if (!formData.last_name_c.trim()) {
      newErrors.last_name_c = "Last name is required";
    }

if (!formData.email_c.trim()) {
      newErrors.email_c = "Email is required";
    } else {
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email_c)) {
        newErrors.email_c = "Please enter a valid email address";
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
name="first_name_c"
                value={formData.first_name_c}
                onChange={handleInputChange}
                error={errors.first_name_c}
                required
                placeholder="Enter first name"
              />
              <FormField
label="Last Name"
                name="last_name_c"
                value={formData.last_name_c}
                onChange={handleInputChange}
                error={errors.last_name_c}
                required
                placeholder="Enter last name"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                label="Email"
name="email_c"
                type="email"
                value={formData.email_c}
                onChange={handleInputChange}
                error={errors.email_c}
                required
                placeholder="Enter email address"
              />
              <FormField
label="Phone"
                name="phone_c"
                type="tel"
                value={formData.phone_c}
                onChange={handleInputChange}
                error={errors.phone}
                placeholder="Enter phone number"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                label="Company"
name="company_c"
                value={formData.company_c}
                onChange={handleInputChange}
                error={errors.company_c}
                placeholder="Enter company name"
              />
              <FormField
                label="Job Title"
name="job_title_c"
                value={formData.job_title_c}
                onChange={handleInputChange}
                error={errors.job_title_c}
                placeholder="Enter job title"
              />
            </div>

            <FormField
              label="Address"
name="address_c"
              value={formData.address_c}
              onChange={handleInputChange}
              error={errors.address_c}
              placeholder="Enter address"
            />

            <div className="space-y-2">
              <label className="text-sm font-medium text-neutral-700">
                Notes
              </label>
              <textarea
name="notes_c"
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