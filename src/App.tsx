import React, { useState } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { SimulationProvider } from './context/SimulationContext';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { PresentationOverlay } from './components/presentation/PresentationOverlay';

// Pages
import { Dashboard } from './pages/Dashboard';
import { EnergyMonitoring } from './pages/EnergyMonitoring';
import { HarvestingUnits } from './pages/HarvestingUnits';
import { HarvestingUnitDetail } from './pages/HarvestingUnitDetail';
import { IoTDevices } from './pages/IoTDevices';
import { IoTDeviceDetail } from './pages/IoTDeviceDetail';
import { Analytics } from './pages/Analytics';
import { SmartManagement } from './pages/SmartManagement';
import { EnergyWallet } from './pages/EnergyWallet';
import { Rewards } from './pages/Rewards';
import { FacilityView } from './pages/FacilityView';
import { Architecture } from './pages/Architecture';
import { ActivityLog } from './pages/ActivityLog';
import { Settings } from './pages/Settings';
import { FutureExchange } from './pages/FutureExchange';

const AppContent: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-navy-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-navy-950">
      {/* Pitch Presentation Mode Fullscreen Overlay */}
      <PresentationOverlay />

      {/* Global Navigation Header */}
      <Header onMobileMenuToggle={() => setMobileOpen(!mobileOpen)} />

      <div className="flex-1 flex">
        {/* Responsive Desktop & Mobile Sidebar Navigation */}
        <Sidebar mobileOpen={mobileOpen} onMobileClose={() => setMobileOpen(false)} />

        {/* Main Application Content Area */}
        <main className="flex-1 p-4 lg:p-6 max-w-7xl mx-auto w-full overflow-x-hidden">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/energy" element={<EnergyMonitoring />} />
            <Route path="/harvesting" element={<HarvestingUnits />} />
            <Route path="/harvesting/:id" element={<HarvestingUnitDetail />} />
            <Route path="/devices" element={<IoTDevices />} />
            <Route path="/devices/:id" element={<IoTDeviceDetail />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/smart-management" element={<SmartManagement />} />
            <Route path="/wallet" element={<EnergyWallet />} />
            <Route path="/rewards" element={<Rewards />} />
            <Route path="/facility" element={<FacilityView />} />
            <Route path="/architecture" element={<Architecture />} />
            <Route path="/activity" element={<ActivityLog />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/future-exchange" element={<FutureExchange />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export function App() {
  return (
    <Router>
      <SimulationProvider>
        <AppContent />
      </SimulationProvider>
    </Router>
  );
}

export default App;
