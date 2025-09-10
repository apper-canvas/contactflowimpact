import ComingSoon from "@/components/organisms/ComingSoon";

const SettingsPage = () => {
  const features = [
    "User profile management",
    "Team member permissions",
    "Custom field configuration",
    "Email template setup",
    "Integration settings",
    "Data import/export",
    "Notification preferences",
    "Security settings"
  ];

  return (
    <div className="flex-1 overflow-auto">
      <div className="max-w-7xl mx-auto p-6">
        <ComingSoon
          title="System Settings"
          description="Customize your CRM experience with user preferences, team management, custom fields, and system integrations to fit your workflow."
          icon="Settings"
          features={features}
          expectedDate="Q4 2024"
        />
      </div>
    </div>
  );
};

export default SettingsPage;