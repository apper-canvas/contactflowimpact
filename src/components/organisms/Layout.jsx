import { Outlet } from "react-router-dom";
import Sidebar from "@/components/organisms/Sidebar";
import MobileSidebar from "@/components/organisms/MobileSidebar";

const Layout = () => {
  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="flex h-screen">
        {/* Desktop Sidebar */}
        <Sidebar className="hidden lg:flex" />
        
        {/* Mobile Sidebar */}
        <MobileSidebar />
        
        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden lg:ml-0">
          {/* Mobile Padding for Menu Button */}
          <div className="lg:hidden h-16 flex-shrink-0"></div>
          
          {/* Page Content */}
          <div className="flex-1 overflow-auto bg-white">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Layout;