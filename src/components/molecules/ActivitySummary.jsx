import { useState, useEffect } from "react";
import Card from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import dashboardService from "@/services/api/dashboardService";

const ActivitySummary = () => {
  const [activities, setActivities] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadActivities = async () => {
      try {
        const data = await dashboardService.getActivitySummary();
        setActivities(data);
      } catch (error) {
        console.error('Error loading activity summary:', error);
      } finally {
        setLoading(false);
      }
    };

    loadActivities();
  }, []);

  if (loading) {
    return (
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-neutral-900 mb-4">Weekly Activity</h3>
        <Loading />
      </Card>
    );
  }

  const activityItems = [
    {
      label: "Tasks Completed",
      value: activities?.tasksCompleted || 0,
      icon: "CheckCircle2",
      color: "text-success-600"
    },
    {
      label: "Calls Made", 
      value: activities?.callsMade || 0,
      icon: "Phone",
      color: "text-primary-600"
    },
    {
      label: "Emails Sent",
      value: activities?.emailsSent || 0,
      icon: "Mail",
      color: "text-accent-600"
    }
  ];

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold text-neutral-900 mb-4">Weekly Activity</h3>
      <div className="space-y-4">
        {activityItems.map((item, index) => (
          <div key={index} className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-lg bg-neutral-100 ${item.color}`}>
                <ApperIcon name={item.icon} size={16} />
              </div>
              <span className="text-sm font-medium text-neutral-700">
                {item.label}
              </span>
            </div>
            <span className="text-2xl font-bold text-neutral-900">
              {item.value}
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default ActivitySummary;