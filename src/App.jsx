import React, { useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { NotificationProvider } from "@/contexts/NotificationContext";
import { AchievementProvider } from "@/contexts/AchievementContext";
import { PointsProvider } from "@/contexts/PointsContext";
import Day0Assessment from "@/components/pages/Day0Assessment";
import ProgressCharts from "@/components/pages/ProgressCharts";
import Dashboard from "@/components/pages/Dashboard";
import MiReto from "@/components/pages/MiReto";
import Habitos from "@/components/pages/Habitos";
import Perfil from "@/components/pages/Perfil";
import Header from "@/components/organisms/Header";
import Sidebar from "@/components/organisms/Sidebar";
const App = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleMenuToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

const handleSidebarClose = () => {
    setSidebarOpen(false);
  };

  return (
    <BrowserRouter>
      <div className="flex h-screen bg-gray-100">
        <NotificationProvider>
          <AchievementProvider>
            <PointsProvider>
              <Sidebar isOpen={sidebarOpen} onClose={handleSidebarClose} />
              
              <div className="flex-1 flex flex-col overflow-hidden">
                <Header onMenuToggle={handleMenuToggle} />
                
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">
                  <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/dia-0" element={<Day0Assessment />} />
                    <Route path="/mi-reto" element={<MiReto />} />
                    <Route path="/habitos" element={<Habitos />} />
                    <Route path="/progreso" element={<ProgressCharts />} />
                    <Route path="/perfil" element={<Perfil />} />
                  </Routes>
                </main>
              </div>
            </PointsProvider>
          </AchievementProvider>
        </NotificationProvider>
      </div>
      <ToastContainer 
        position="top-right"
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light" 
      />
    </BrowserRouter>
  );
};

export default App;