import React from "react";
import { cn } from "@/utils/cn";
import NavItem from "@/components/molecules/NavItem";
import ApperIcon from "@/components/ApperIcon";

const Sidebar = ({ isOpen, onClose, className }) => {
const navItems = [
    { to: "/", icon: "Home", label: "Dashboard" },
    { to: "/dia-0", icon: "Target", label: "Día 0" },
    { to: "/mi-reto", icon: "Calendar", label: "Mi Reto" },
    { to: "/habitos", icon: "CheckSquare", label: "Hábitos" },
    { to: "/perfil", icon: "User", label: "Perfil" },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-64 bg-white border-r border-gray-200 h-full">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-gradient-purple-blue rounded-lg flex items-center justify-center">
              <ApperIcon name="Zap" size={20} className="text-white" />
            </div>
            <div>
              <h2 className="font-bold font-display text-gray-900">Reto 21D</h2>
              <p className="text-xs text-gray-500">Tu transformación</p>
            </div>
          </div>
          
          <nav className="space-y-2">
            {navItems.map((item) => (
              <NavItem key={item.to} to={item.to} icon={item.icon}>
                {item.label}
              </NavItem>
            ))}
          </nav>
        </div>
      </aside>

      {/* Mobile Sidebar */}
      <aside className={cn(
        "fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-200 z-50 lg:hidden",
        "transform transition-transform duration-300",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="p-6">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-purple-blue rounded-lg flex items-center justify-center">
                <ApperIcon name="Zap" size={20} className="text-white" />
              </div>
              <div>
                <h2 className="font-bold font-display text-gray-900">Reto 21D</h2>
                <p className="text-xs text-gray-500">Tu transformación</p>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <ApperIcon name="X" size={20} />
            </button>
          </div>
          
          <nav className="space-y-2">
            {navItems.map((item) => (
              <NavItem 
                key={item.to} 
                to={item.to} 
                icon={item.icon}
                onClick={onClose}
              >
                {item.label}
              </NavItem>
            ))}
          </nav>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;