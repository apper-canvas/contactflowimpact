import ComingSoon from "@/components/organisms/ComingSoon";

const DealsPage = () => {
  const features = [
    "Visual sales pipeline",
    "Deal tracking and stages",
    "Revenue forecasting",
    "Win/loss analysis",
    "Custom deal fields",
    "Activity timeline",
    "Team collaboration",
    "Automated follow-ups"
  ];

  return (
    <div className="flex-1 overflow-auto">
      <div className="max-w-7xl mx-auto p-6">
        <ComingSoon
          title="Sales Pipeline & Deals"
          description="Track your sales opportunities from lead to close with our comprehensive deal management system. Visualize your pipeline, forecast revenue, and never miss a follow-up."
          icon="TrendingUp"
          features={features}
          expectedDate="Q2 2024"
        />
      </div>
    </div>
  );
};

export default DealsPage;