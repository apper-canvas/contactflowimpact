import Card from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const MetricCard = ({ 
  title, 
  value, 
  growth, 
  icon, 
  iconColor = "text-primary-600", 
  formatValue = (v) => v,
  onClick 
}) => {
  const isPositiveGrowth = growth >= 0;
  
  return (
    <Card 
      hover={!!onClick} 
      onClick={onClick}
      className="p-6 cursor-pointer"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-neutral-600 mb-1">{title}</p>
          <p className="text-3xl font-bold text-neutral-900 mb-2">
            {formatValue(value)}
          </p>
          {typeof growth === 'number' && (
            <div className={cn(
              "flex items-center text-sm font-medium",
              isPositiveGrowth ? "text-success-600" : "text-error-600"
            )}>
              <ApperIcon 
                name={isPositiveGrowth ? "TrendingUp" : "TrendingDown"} 
                size={16} 
                className="mr-1" 
              />
              {Math.abs(growth).toFixed(1)}%
            </div>
          )}
        </div>
        <div className={cn("p-3 rounded-xl bg-neutral-100", iconColor)}>
          <ApperIcon name={icon} size={24} />
        </div>
      </div>
    </Card>
  );
};

export default MetricCard;