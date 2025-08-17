import React, { useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { PointsProvider } from "@/contexts/PointsContext";
import Dashboard from "@/components/pages/Dashboard";
import Day0Assessment from "@/components/pages/Day0Assessment";
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
    <PointsProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-background">
          <Header onMenuToggle={handleMenuToggle} />
          
          <div className="flex h-[calc(100vh-80px)]">
            <Sidebar 
              isOpen={sidebarOpen} 
              onClose={handleSidebarClose}
            />
            
<main className="flex-1 overflow-auto">
              <div className="p-4 lg:p-6 max-w-7xl mx-auto">
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/dia-0" element={<Day0Assessment />} />
                  <Route path="/mi-reto" element={<MiReto />} />
                  <Route path="/habitos" element={<Habitos />} />
                  <Route path="/perfil" element={<Perfil />} />
                </Routes>
              </div>
            </main>
          </div>
          
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
          />
        </div>
      </BrowserRouter>
    </PointsProvider>
  );
};

export default App;