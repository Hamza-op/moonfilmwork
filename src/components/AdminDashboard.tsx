import { useState } from 'react';
import { Service, BusinessSettings, Receipt } from '../types';
import { AdminSidebar } from './admin/AdminSidebar';
import type { AdminTab } from './admin/AdminSidebar';
import { AdminHeader } from './admin/AdminHeader';
import { DashboardOverview } from './admin/DashboardOverview';
import { ServicesManager } from './admin/ServicesManager';
import { ReceiptHistory } from './admin/ReceiptHistory';
import { BusinessSettingsManager } from './admin/BusinessSettings';
import { PaymentSettingsManager } from './admin/PaymentSettings';
import { ThemeManager } from './admin/ThemeManager';
import { motion, AnimatePresence } from 'framer-motion';

interface AdminDashboardProps {
  services: Service[];
  onAddService: (service: Service) => Promise<void>;
  onUpdateService: (service: Service) => Promise<void>;
  onDeleteService: (id: string) => Promise<void>;
  settings: BusinessSettings;
  onUpdateSettings: (settings: BusinessSettings) => Promise<void>;
  onLogout: () => void;
  receipts: Receipt[];
  onUpdateReceipt: (receipt: Receipt) => Promise<void>;
  onDeleteReceipt: (id: string) => Promise<void>;
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
}

export function AdminDashboard({
  services,
  onAddService,
  onUpdateService,
  onDeleteService,
  settings,
  onUpdateSettings,
  onLogout,
  receipts,
  onUpdateReceipt,
  onDeleteReceipt,
  darkMode,
  setDarkMode,
}: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <AdminHeader
        settings={settings}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        onLogout={onLogout}
      />

      <div className="flex flex-1 flex-col md:flex-row max-w-7xl mx-auto w-full">
        <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0">
          <div className="max-w-4xl mx-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              >
                {activeTab === 'dashboard' && (
                  <DashboardOverview
                    receipts={receipts}
                    settings={settings}
                    services={services}
                    setActiveTab={setActiveTab}
                  />
                )}

                {activeTab === 'services' && (
                  <ServicesManager
                    services={services}
                    settings={settings}
                    onAddService={onAddService}
                    onUpdateService={onUpdateService}
                    onDeleteService={onDeleteService}
                  />
                )}

                {activeTab === 'receipts' && (
                  <ReceiptHistory
                    receipts={receipts}
                    settings={settings}
                    onUpdateReceipt={onUpdateReceipt}
                    onDeleteReceipt={onDeleteReceipt}
                  />
                )}

                {activeTab === 'settings' && (
                  <BusinessSettingsManager
                    settings={settings}
                    onUpdateSettings={onUpdateSettings}
                  />
                )}

                {activeTab === 'payments' && (
                  <PaymentSettingsManager
                    settings={settings}
                    onUpdateSettings={onUpdateSettings}
                  />
                )}

                {activeTab === 'themes' && (
                  <ThemeManager
                    settings={settings}
                    onUpdateSettings={onUpdateSettings}
                    darkMode={darkMode}
                    setDarkMode={setDarkMode}
                    currentTheme={settings.themePreference || 'default'}
                    setCurrentTheme={(themeId) => onUpdateSettings({ ...settings, themePreference: themeId })}
                  />
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>
    </div>
  );
}
