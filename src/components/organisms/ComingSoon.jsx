import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const ComingSoon = ({ 
  title, 
  description, 
  icon = "Clock",
  features = [],
  expectedDate = "Q2 2024"
}) => {
  return (
    <div className="flex-1 flex items-center justify-center min-h-[500px]">
      <div className="max-w-2xl mx-auto text-center space-y-8 p-8">
        {/* Icon */}
        <div className="w-20 h-20 mx-auto bg-gradient-to-br from-primary-100 to-accent-100 rounded-2xl flex items-center justify-center">
          <ApperIcon name={icon} className="w-10 h-10 text-primary-600" />
        </div>

        {/* Content */}
        <div className="space-y-4">
          <h1 className="text-3xl font-bold text-neutral-900">{title}</h1>
          <p className="text-lg text-neutral-600 max-w-lg mx-auto">{description}</p>
        </div>

        {/* Features Preview */}
        {features.length > 0 && (
          <div className="bg-gradient-to-br from-neutral-50 to-primary-50 rounded-2xl p-6 space-y-4">
            <h3 className="text-lg font-semibold text-neutral-900">Coming Features</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center space-x-3 text-sm text-neutral-700">
                  <div className="w-2 h-2 bg-primary-500 rounded-full flex-shrink-0"></div>
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Timeline */}
        <div className="flex items-center justify-center space-x-2 text-sm text-neutral-500">
          <ApperIcon name="Calendar" className="w-4 h-4" />
          <span>Expected release: {expectedDate}</span>
        </div>

        {/* CTA */}
        <div className="flex flex-col sm:flex-row items-center justify-center space-y-3 sm:space-y-0 sm:space-x-4">
          <Button variant="primary" onClick={() => window.history.back()}>
            <ApperIcon name="ArrowLeft" className="w-4 h-4 mr-2" />
            Back to Contacts
          </Button>
          <Button variant="outline">
            <ApperIcon name="Bell" className="w-4 h-4 mr-2" />
            Notify Me When Ready
          </Button>
        </div>

        {/* Decorative Elements */}
        <div className="relative">
          <div className="absolute -top-4 -left-4 w-8 h-8 bg-primary-200 rounded-full opacity-20 animate-pulse"></div>
          <div className="absolute -top-2 -right-6 w-6 h-6 bg-accent-300 rounded-full opacity-30 animate-pulse" style={{ animationDelay: "1s" }}></div>
          <div className="absolute -bottom-3 left-8 w-4 h-4 bg-primary-300 rounded-full opacity-25 animate-pulse" style={{ animationDelay: "2s" }}></div>
        </div>
      </div>
    </div>
  );
};

export default ComingSoon;