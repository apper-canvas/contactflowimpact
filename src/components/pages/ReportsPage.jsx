import ComingSoon from "@/components/organisms/ComingSoon";

const ReportsPage = () => {
  const features = [
    "Contact growth analytics",
    "Sales performance metrics",
    "Activity tracking reports",
    "Pipeline conversion rates",
    "Team productivity insights",
    "Custom report builder",
    "Data export options",
    "Scheduled report delivery"
  ];

  return (
    <div className="flex-1 overflow-auto">
      <div className="max-w-7xl mx-auto p-6">
        <ComingSoon
          title="Analytics & Reporting"
          description="Get insights into your customer relationships and sales performance with comprehensive reports and analytics dashboards."
          icon="BarChart3"
          features={features}
          expectedDate="Q4 2024"
        />
      </div>
    </div>
  );
};

export default ReportsPage;