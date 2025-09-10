import ComingSoon from "@/components/organisms/ComingSoon";

const TasksPage = () => {
  const features = [
    "Task scheduling and reminders",
    "Contact-linked activities",
    "Priority management",
    "Team task assignment",
    "Calendar integration",
    "Progress tracking",
    "Recurring tasks",
    "Activity reporting"
  ];

  return (
    <div className="flex-1 overflow-auto">
      <div className="max-w-7xl mx-auto p-6">
        <ComingSoon
          title="Task & Activity Management"
          description="Stay organized and never miss important follow-ups. Schedule tasks, set reminders, and track all your customer interactions in one place."
          icon="CheckSquare"
          features={features}
          expectedDate="Q3 2024"
        />
      </div>
    </div>
  );
};

export default TasksPage;