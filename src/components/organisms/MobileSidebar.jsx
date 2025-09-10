import { useState } from "react";
import { useLocation } from "react-router-dom";
import NavigationItem from "@/components/molecules/NavigationItem";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const MobileSidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

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
      label: "Deals",
      badge: "Soon"
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

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const closeSidebar = () => {
    setIsOpen(false);
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={toggleSidebar}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-lg border border-neutral-200 hover:bg-neutral-50 transition-colors duration-200"
      >
        <ApperIcon name={isOpen ? "X" : "Menu"} className="w-5 h-5 text-neutral-600" />
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300"
          onClick={closeSidebar}
        />
      )}

      {/* Mobile Sidebar */}
      <div className={cn(
        "lg:hidden fixed top-0 left-0 h-full w-64 bg-white border-r border-neutral-200 z-50 transition-transform duration-300 transform",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-neutral-100">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-accent-500 rounded-lg flex items-center justify-center">
              <ApperIcon name="Users" className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-neutral-900">ContactFlow</h1>
              <p className="text-xs text-neutral-500">CRM System</p>
            </div>
          </div>
          <button
            onClick={closeSidebar}
            className="p-2 hover:bg-neutral-100 rounded-lg transition-colors duration-200"
          >
            <ApperIcon name="X" className="w-4 h-4 text-neutral-500" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {navigationItems.map((item) => (
            <NavigationItem
              key={item.to}
              to={item.to}
              icon={item.icon}
              badge={item.badge}
              onClick={closeSidebar}
            >
              {item.label}
            </NavigationItem>
          ))}
        </nav>

        {/* User Section */}
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
      </div>
    </>
  );
};

export default MobileSidebar;