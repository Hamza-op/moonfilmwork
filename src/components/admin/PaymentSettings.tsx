import { useState, useEffect } from 'react';
import { BusinessSettings } from '../../types';
import { motion } from 'framer-motion';

interface PaymentSettingsProps {
    settings: BusinessSettings;
    onUpdateSettings: (settings: BusinessSettings) => Promise<void>;
}

export function PaymentSettingsManager({ settings, onUpdateSettings }: PaymentSettingsProps) {
    const [localSettings, setLocalSettings] = useState<BusinessSettings>(settings);
    const [hasChanges, setHasChanges] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        setLocalSettings(settings);
        setHasChanges(false);
    }, [settings]);

    const handleLocalSettingChange = (key: keyof BusinessSettings, value: any) => {
        setLocalSettings(prev => ({ ...prev, [key]: value }));
        setHasChanges(true);
    };

    const handleSaveChanges = async () => {
        setIsSaving(true);
        try {
            await onUpdateSettings(localSettings);
            setHasChanges(false);
        } catch (error) {
            console.error('Failed to save settings:', error);
            alert('Failed to save changes.');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-2xl font-bold">Payment & Terms</h3>
                <p className="text-muted-foreground mt-1">Configure banking details, taxes, and terms of service</p>
            </div>

            <div className="bg-card rounded-2xl p-6 shadow-sm border border-border">
                <h4 className="font-semibold text-lg mb-4 flex items-center gap-2">
                    <span className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center text-blue-600 dark:text-blue-400">🏦</span>
                    Bank Details
                </h4>
                <div>
                    <label className="block text-sm font-medium mb-1.5">Bank Account Info</label>
                    <textarea
                        value={localSettings.bankDetails}
                        onChange={(e) => handleLocalSettingChange('bankDetails', e.target.value)}
                        rows={4}
                        className="w-full px-4 py-2.5 border border-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary bg-input transition-all font-mono text-sm"
                        placeholder="Bank Name, Account Number, IBAN..."
                    />
                    <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1.5">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        This information will be included on all receipt PDFs.
                    </p>
                </div>
            </div>

            <div className="bg-card rounded-2xl p-6 shadow-sm border border-border">
                <h4 className="font-semibold text-lg mb-4 flex items-center gap-2">
                    <span className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center text-green-600 dark:text-green-400">💰</span>
                    Tax Configuration
                </h4>
                <div className="max-w-xs">
                    <label className="block text-sm font-medium mb-1.5">Tax Rate (%)</label>
                    <div className="relative">
                        <input
                            type="number"
                            value={localSettings.taxRate}
                            onChange={(e) => handleLocalSettingChange('taxRate', Number(e.target.value))}
                            className="w-full px-4 py-2.5 border border-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary bg-input transition-all pr-8"
                            min="0"
                            max="100"
                        />
                        <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">%</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1.5">Set to 0 if not applicable.</p>
                </div>
            </div>

            <div className="bg-card rounded-2xl p-6 shadow-sm border border-border">
                <h4 className="font-semibold text-lg mb-4 flex items-center gap-2">
                    <span className="w-8 h-8 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center text-orange-600 dark:text-orange-400">📜</span>
                    Terms & Conditions
                </h4>
                <textarea
                    value={localSettings.termsAndConditions}
                    onChange={(e) => handleLocalSettingChange('termsAndConditions', e.target.value)}
                    rows={6}
                    className="w-full px-4 py-2.5 border border-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary bg-input transition-all"
                    placeholder="Enter your terms and conditions..."
                />
            </div>

            {/* Save Button */}
            {hasChanges && (
                <div className="sticky bottom-6 flex justify-end animate-in slide-in-from-bottom-5 fade-in">
                    <motion.button
                        onClick={handleSaveChanges}
                        disabled={isSaving}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-8 py-3 rounded-xl font-bold bg-primary text-primary-foreground shadow-xl shadow-primary/30 hover:opacity-90 transition-all flex items-center gap-2"
                    >
                        {isSaving ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Saving...
                            </>
                        ) : (
                            'Save Changes'
                        )}
                    </motion.button>
                </div>
            )}
        </div>
    );
}
