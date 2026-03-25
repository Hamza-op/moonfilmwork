
import { useState, useEffect } from 'react';

import { useSupabaseAuth, useSupabaseServices, useSupabaseReceipts, useSupabaseSettings } from './hooks/useSupabase';
import { applyTheme } from './data/themes';
import { Receipt } from './types';
import { CustomerLanding } from './components/CustomerLanding';
import { AdminDashboard } from './components/AdminDashboard';

type View = 'customer' | 'admin';

export function App() {
  // Supabase Hooks
  const { services, addService, updateService, deleteService } = useSupabaseServices();
  const { settings, updateSettings } = useSupabaseSettings();
  const { receipts, addReceipt, updateReceipt, deleteReceipt } = useSupabaseReceipts();
  const { user, loading: authLoading, login, logout } = useSupabaseAuth();

  // Local State
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [currentView, setCurrentView] = useState<View>('customer');

  // Login State
  const [showPasswordPrompt, setShowPasswordPrompt] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Check URL hash for admin access - wait for auth to load first
  useEffect(() => {
    // Don't check hash until auth is loaded
    if (authLoading) return;

    const checkHash = () => {
      if (window.location.hash === '#admin') {
        if (user) {
          setCurrentView('admin');
          setShowPasswordPrompt(false);
        } else {
          setShowPasswordPrompt(true);
        }
      } else {
        setCurrentView('customer');
        setShowPasswordPrompt(false);
      }
    };

    checkHash();
    window.addEventListener('hashchange', checkHash);
    return () => window.removeEventListener('hashchange', checkHash);
  }, [user, authLoading]);

  // Apply dark mode class to document
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Sync theme with DB settings
  useEffect(() => {
    if (settings.themePreference) {
      applyTheme(settings.themePreference, settings.darkMode || false);
    }
    // Also sync local dark mode state to match DB (for the toggle to reflect correctly)
    if (settings.darkMode !== undefined) {
      setDarkMode(settings.darkMode);
    }
  }, [settings.themePreference, settings.darkMode]);

  // Apply dark mode class (keep this for immediate feedback on toggle)
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    // Re-apply theme colors when dark mode changes locally (to ensure variables flip)
    // process: get current applied theme or fallback
    const currentTheme = settings.themePreference || 'default';
    applyTheme(currentTheme, darkMode);
  }, [darkMode, settings.themePreference]);

  const generateAdminMessage = (receipt: Receipt) => {
    const servicesText = receipt.items
      .map(item => `• ${item.serviceName} (${item.quantity}x) - ${settings.currency}${item.total.toLocaleString()}`)
      .join('\n');

    // Message format for admin - includes customer details as a quote request
    const message = `
🎬 *NEW QUOTE REQUEST*
━━━━━━━━━━━━━━━━
📋 *Quote #${receipt.receiptNumber}*
━━━━━━━━━━━━━━━━

👤 *Customer Details:*
• Name: ${receipt.customerName}
• Phone: ${receipt.customerPhone}
• Email: ${receipt.customerEmail || 'Not provided'}

📅 *Event Details:*
• Date: ${receipt.eventDate ? new Date(receipt.eventDate).toLocaleDateString() : 'TBD'}
• Type: ${receipt.eventType}

📦 *Requested Services:*
${servicesText}

━━━━━━━━━━━━━━━━
💰 *QUOTED AMOUNT:* ${settings.currency}${receipt.total.toLocaleString()}
━━━━━━━━━━━━━━━━
${receipt.notes ? `\n📝 *Customer Notes:* ${receipt.notes}\n` : ''}
⏰ *Received:* ${new Date().toLocaleString()}

_Please follow up with the customer to confirm booking._
`.trim();

    return message;
  };

  const handleSendWhatsApp = async (receipt: Receipt) => {
    try {
      // Send admin notification with admin's WhatsApp number from database
      const adminNumber = settings.whatsappNumber.replace(/[^0-9]/g, '');
      if (adminNumber) {
        const adminMessage = encodeURIComponent(generateAdminMessage(receipt));
        window.open(`https://wa.me/${adminNumber}?text=${adminMessage}`, '_blank');
      }

      // Try to save receipt to Supabase (but don't block WhatsApp if it fails)
      try {
        await addReceipt(receipt);
      } catch (dbError) {
        console.warn('Could not save to database, but WhatsApp message sent:', dbError);
      }
    } catch (error) {
      console.error('Error sending WhatsApp:', error);
      alert('Failed to send WhatsApp message. Please try again.');
    }
  };

  const handleLoginSubmit = async () => {
    if (!email || !password) {
      setLoginError('Please enter both email and password');
      return;
    }

    setIsLoggingIn(true);
    setLoginError('');

    try {
      await login(email, password);
      // Login successful - useEffect will switch view
      setShowPasswordPrompt(false);
      setEmail('');
      setPassword('');
    } catch (error: any) {
      console.error('Login error:', error);
      setLoginError(error.message || 'Invalid login credentials');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    setCurrentView('customer');
    window.location.hash = '';
  };

  // Render customer or admin view based on current view
  if (currentView === 'admin' && user) {
    return (
      <AdminDashboard
        services={services}
        onAddService={addService}
        onUpdateService={updateService}
        onDeleteService={deleteService}

        settings={settings}
        onUpdateSettings={updateSettings}

        receipts={receipts}
        onUpdateReceipt={updateReceipt}
        onDeleteReceipt={deleteReceipt}

        onLogout={handleLogout}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
      />
    );
  }

  return (
    <>
      <CustomerLanding
        services={services}
        settings={settings}
        onSendWhatsApp={handleSendWhatsApp}
        receiptCount={receipts.length}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
      />

      {/* Login Modal */}
      {showPasswordPrompt && !user && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="glass-card bg-card text-card-foreground rounded-2xl shadow-2xl p-7 w-full max-w-sm border border-border/40">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-primary/10 border border-primary/15">
                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl" style={{ fontFamily: 'var(--font-display)' }}>Admin Login</h3>
                <p className="text-sm text-muted-foreground">Sign in to manage your studio</p>
              </div>
            </div>

            {loginError && (
              <div className="mb-5 p-3 bg-red-500/10 text-red-600 dark:text-red-400 text-sm rounded-xl border border-red-500/15 flex items-center gap-2">
                <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L8.732 4.5c-.77-.833-2.694-.833-3.464 0L1.34 16.5c-.77.833.192 2.5 1.732 2.5z" /></svg>
                {loginError}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label htmlFor="login-email" className="text-xs font-semibold mb-1.5 block uppercase tracking-wider text-muted-foreground">Email</label>
                <input
                  id="login-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-input border border-border rounded-xl focus:ring-2 focus:ring-ring focus:border-transparent text-sm placeholder:text-muted-foreground"
                  placeholder="admin@example.com"
                  autoFocus
                />
              </div>

              <div>
                <label htmlFor="login-password" className="text-xs font-semibold mb-1.5 block uppercase tracking-wider text-muted-foreground">Password</label>
                <input
                  id="login-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleLoginSubmit()}
                  className="w-full px-4 py-3 bg-input border border-border rounded-xl focus:ring-2 focus:ring-ring focus:border-transparent text-sm placeholder:text-muted-foreground"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-7">
              <button
                onClick={handleLoginSubmit}
                disabled={isLoggingIn}
                className="flex-1 py-3 bg-primary text-primary-foreground rounded-xl hover:opacity-90 font-semibold disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary/20 transition-all text-sm"
              >
                {isLoggingIn ? 'Signing in...' : 'Sign In'}
              </button>
              <button
                onClick={() => {
                  setShowPasswordPrompt(false);
                  setEmail('');
                  setPassword('');
                  setLoginError('');
                  window.location.hash = '';
                }}
                className="flex-1 py-3 bg-muted text-muted-foreground rounded-xl hover:opacity-80 font-medium border border-border/50 transition-all text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
