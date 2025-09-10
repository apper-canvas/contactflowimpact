import { NavLink } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const NavigationItem = ({ to, icon, children, badge, onClick }) => {
  const content = (
    <>
      <ApperIcon name={icon} className="w-5 h-5 flex-shrink-0" />
      <span className="flex-1">{children}</span>
      {badge && (
        <span className="bg-primary-100 text-primary-700 text-xs font-medium px-2 py-0.5 rounded-full">
          {badge}
        </span>
      )}
    </>
  );

  const baseClasses = "flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-primary-50 group";

  if (!to) {
    return (
      <button
        onClick={onClick}
        className={cn(baseClasses, "w-full text-left text-neutral-600 hover:text-primary-600")}
      >
        {content}
      </button>
    );
  }

  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        cn(
          baseClasses,
          isActive
            ? "bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-md"
            : "text-neutral-600 hover:text-primary-600"
        )
      }
    >
      {content}
    </NavLink>
  );
};

export default NavigationItem;