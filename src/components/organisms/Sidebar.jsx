import { useState } from "react";
import { useLocation } from "react-router-dom";
import NavigationItem from "@/components/molecules/NavigationItem";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const Sidebar = ({ className }) => {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const navigationItems = [
    { 
      to: "/contacts", 
      icon: "Users", 
      label: "Contacts",
      badge: null
    },
    { 
to: "/deals", 
      icon: "TrendingUp", 
      label: "Deals"
    },
    { 
      to: "/tasks", 
      icon: "CheckSquare", 
      label: "Tasks",
      badge: "Soon"
    },
    { 
      to: "/reports", 
      icon: "BarChart3", 
      label: "Reports",
      badge: "Soon"
    },
    { 
      to: "/settings", 
      icon: "Settings", 
      label: "Settings",
      badge: "Soon"
    }
  ];

  return (
    <div className={cn(
      "flex flex-col bg-white border-r border-neutral-200 transition-all duration-300",
      isCollapsed ? "w-16" : "w-64",
      className
    )}>
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-neutral-100">
        {!isCollapsed && (
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-accent-500 rounded-lg flex items-center justify-center">
              <ApperIcon name="Users" className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-neutral-900">ContactFlow</h1>
              <p className="text-xs text-neutral-500">CRM System</p>
            </div>
          </div>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 hover:bg-neutral-100 rounded-lg transition-colors duration-200"
        >
          <ApperIcon 
            name={isCollapsed ? "ChevronRight" : "ChevronLeft"} 
            className="w-4 h-4 text-neutral-500" 
          />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navigationItems.map((item) => (
          <div key={item.to} className="relative">
            <NavigationItem
              to={item.to}
              icon={item.icon}
              badge={item.badge}
            >
              {!isCollapsed && item.label}
            </NavigationItem>
            {isCollapsed && (
              <div className="absolute left-12 top-1/2 transform -translate-y-1/2 bg-neutral-900 text-white px-2 py-1 rounded text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50">
                {item.label}
              </div>
            )}
          </div>
        ))}
      </nav>

      {/* User Section */}
      {!isCollapsed && (
        <div className="p-4 border-t border-neutral-100">
          <div className="flex items-center space-x-3 p-3 rounded-lg bg-neutral-50">
            <div className="w-8 h-8 bg-gradient-to-br from-neutral-400 to-neutral-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
              U
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-neutral-900 truncate">Demo User</p>
              <p className="text-xs text-neutral-500 truncate">demo@contactflow.com</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;