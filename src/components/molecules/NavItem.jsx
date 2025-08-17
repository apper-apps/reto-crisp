import React from "react";
import { NavLink } from "react-router-dom";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const NavItem = ({ to, icon, children, className }) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        cn(
          "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200",
          "text-gray-700 hover:bg-gray-100 hover:text-primary",
          "focus:outline-none focus:ring-2 focus:ring-primary/20",
          isActive && "bg-gradient-light text-white shadow-md hover:bg-gradient-light hover:text-white",
          className
        )
      }
    >
      <ApperIcon name={icon} size={20} />
      <span className="font-medium">{children}</span>
    </NavLink>
  );
};

export default NavItem;