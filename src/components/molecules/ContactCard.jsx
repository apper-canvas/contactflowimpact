import { format } from "date-fns";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";

const ContactCard = ({ contact, onClick }) => {
  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), "MMM d, yyyy");
    } catch (error) {
      return "Invalid date";
    }
  };

  const getInitials = (firstName, lastName) => {
    return `${firstName?.charAt(0) || ""}${lastName?.charAt(0) || ""}`.toUpperCase();
  };

  return (
    <Card hover onClick={onClick} className="p-6">
      <div className="flex items-start space-x-4">
        {/* Avatar */}
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white font-semibold text-lg flex-shrink-0">
          {getInitials(contact.firstName, contact.lastName)}
        </div>

        {/* Contact Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold text-neutral-900 truncate">
              {contact.firstName} {contact.lastName}
            </h3>
            {contact.tags?.length > 0 && (
              <div className="flex space-x-1 ml-2">
                {contact.tags.slice(0, 2).map((tag, index) => (
                  <Badge key={index} variant="primary" size="sm">
                    {tag}
                  </Badge>
                ))}
                {contact.tags.length > 2 && (
                  <Badge variant="default" size="sm">
                    +{contact.tags.length - 2}
                  </Badge>
                )}
              </div>
            )}
          </div>

          <div className="space-y-2">
            {contact.company && (
              <div className="flex items-center text-sm text-neutral-600">
                <ApperIcon name="Building" className="w-4 h-4 mr-2 flex-shrink-0" />
                <span className="truncate">{contact.company}</span>
                {contact.jobTitle && (
                  <span className="text-neutral-400 mx-2">•</span>
                )}
                {contact.jobTitle && (
                  <span className="truncate">{contact.jobTitle}</span>
                )}
              </div>
            )}

            <div className="flex items-center text-sm text-neutral-600">
              <ApperIcon name="Mail" className="w-4 h-4 mr-2 flex-shrink-0" />
              <span className="truncate">{contact.email}</span>
            </div>

            {contact.phone && (
              <div className="flex items-center text-sm text-neutral-600">
                <ApperIcon name="Phone" className="w-4 h-4 mr-2 flex-shrink-0" />
                <span>{contact.phone}</span>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between mt-4 pt-3 border-t border-neutral-100">
            <span className="text-xs text-neutral-500">
              Updated {formatDate(contact.updatedAt)}
            </span>
            <ApperIcon name="ChevronRight" className="w-4 h-4 text-neutral-400" />
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ContactCard;