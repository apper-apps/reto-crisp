import React from 'react';
import { useLocation } from 'react-router-dom';
import ApperIcon from '@/components/ApperIcon';
import NavItem from '@/components/molecules/NavItem';

const navigationItems = [
  {
    path: '/',
    label: 'Dashboard',
    icon: 'Home'
  },
  {
    path: '/mi-reto',
    label: 'Mi Reto',
    icon: 'Target'
  },
  {
    path: '/habitos',
    label: 'Hábitos',
    icon: 'CheckCircle'
  },
  {
    path: '/progreso',
    label: 'Progreso',
    icon: 'BarChart3'
  },
  {
    path: '/perfil',
    label: 'Perfil',
    icon: 'User'
  }
];

function Sidebar({ isOpen, onClose }) {
  const location = useLocation();

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <aside className={`
        fixed lg:relative top-0 left-0 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-50
        ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0
      `}>
        <div className="p-6">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-bold font-display text-gray-900">
              Reto 21 Días
            </h2>
            <button
              onClick={onClose}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ApperIcon name="X" size={20} />
            </button>
          </div>

          <nav className="space-y-2">
            {navigationItems.map((item) => (
              <NavItem
                key={item.path}
                to={item.path}
                icon={item.icon}
                label={item.label}
                isActive={location.pathname === item.path}
                onClick={() => {
                  if (window.innerWidth < 1024) {
                    onClose();
                  }
                }}
              />
            ))}
          </nav>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;