import React, { useState } from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const Header = ({ onMenuToggle, className }) => {
  return (
    <header className={cn("bg-gradient-purple-blue text-white shadow-lg", className)}>
      <div className="flex items-center justify-between px-4 py-4 lg:px-6">
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuToggle}
            className="lg:hidden p-2 rounded-lg hover:bg-white/10 transition-colors"
          >
            <ApperIcon name="Menu" size={24} />
          </button>
          <div>
            <h1 className="text-xl lg:text-2xl font-bold font-display">Reto 21D</h1>
            <p className="text-sm text-white/80 hidden sm:block">Transformación Personal 80/20</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 bg-white/10 px-3 py-2 rounded-lg">
            <ApperIcon name="Calendar" size={16} />
            <span className="text-sm font-medium">
              {new Date().toLocaleDateString("es-MX", { 
                day: "numeric", 
                month: "short" 
              })}
            </span>
          </div>
          <button className="p-2 rounded-lg hover:bg-white/10 transition-colors">
            <ApperIcon name="Bell" size={20} />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;