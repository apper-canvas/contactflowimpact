import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const Empty = ({ 
  title = "No data found",
  message = "Get started by creating your first item.",
  actionLabel = "Get Started",
  onAction,
  icon = "Inbox"
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 space-y-6">
      <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center">
        <ApperIcon name={icon} className="w-8 h-8 text-neutral-400" />
      </div>
      
      <div className="text-center space-y-2">
        <h3 className="text-lg font-semibold text-neutral-900">{title}</h3>
        <p className="text-neutral-600 max-w-md">{message}</p>
      </div>
      
      {onAction && (
        <Button onClick={onAction} variant="primary">
          <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
          {actionLabel}
        </Button>
      )}
    </div>
  );
};

export default Empty;