import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const Error = ({ 
  message = "Something went wrong", 
  onRetry,
  showRetry = true 
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 space-y-6">
      <div className="w-16 h-16 bg-error-100 rounded-full flex items-center justify-center">
        <ApperIcon name="AlertCircle" className="w-8 h-8 text-error-500" />
      </div>
      
      <div className="text-center space-y-2">
        <h3 className="text-lg font-semibold text-neutral-900">Oops!</h3>
        <p className="text-neutral-600 max-w-md">{message}</p>
      </div>
      
      {showRetry && onRetry && (
        <Button onClick={onRetry} variant="outline">
          <ApperIcon name="RefreshCw" className="w-4 h-4 mr-2" />
          Try Again
        </Button>
      )}
    </div>
  );
};

export default Error;