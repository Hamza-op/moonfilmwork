import { useState, useEffect } from 'react';
import { BusinessSettings } from '../../types';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';

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

    const inputClass = "w-full px-4 py-3 border border-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary bg-input transition-all text-sm";

    return (
        <div className="space-y-8">
            <div>
                <h3 className="text-3xl" style={{ fontFamily: 'var(--font-display)' }}>Payment & Terms</h3>
                <p className="text-muted-foreground mt-1">Configure banking details, taxes, and terms of service</p>
            </div>

            <div className="bg-card rounded-2xl p-6 sm:p-8 shadow-sm border border-border/40">
                <h4 className="font-semibold text-sm uppercase tracking-[0.15em] text-muted-foreground mb-5 flex items-center gap-2">
                    <span className="w-7 h-7 bg-blue-500/10 rounded-lg flex items-center justify-center text-sm border border-blue-500/15">🏦</span>
                    Bank Details
                </h4>
                <div>
                    <label htmlFor="bank-details" className="block text-xs font-semibold mb-1.5 uppercase tracking-wider text-muted-foreground">Bank Account Info</label>
                    <textarea
                        id="bank-details"
                        value={localSettings.bankDetails}
                        onChange={(e) => handleLocalSettingChange('bankDetails', e.target.value)}
                        rows={4}
                        className={cn(inputClass, "font-mono resize-none")}
                        placeholder="Bank Name, Account Number, IBAN..."
                    />
                    <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1.5">
                        <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        This information will be included on all receipt PDFs.
                    </p>
                </div>
            </div>

            <div className="bg-card rounded-2xl p-6 sm:p-8 shadow-sm border border-border/40">
                <h4 className="font-semibold text-sm uppercase tracking-[0.15em] text-muted-foreground mb-5 flex items-center gap-2">
                    <span className="w-7 h-7 bg-emerald-500/10 rounded-lg flex items-center justify-center text-sm border border-emerald-500/15">💰</span>
                    Tax Configuration
                </h4>
                <div className="max-w-xs">
                    <label htmlFor="tax-rate" className="block text-xs font-semibold mb-1.5 uppercase tracking-wider text-muted-foreground">Tax Rate (%)</label>
                    <div className="relative">
                        <input
                            id="tax-rate"
                            type="number"
                            value={localSettings.taxRate}
                            onChange={(e) => handleLocalSettingChange('taxRate', Number(e.target.value))}
                            className={cn(inputClass, "pr-10")}
                            min="0"
                            max="100"
                        />
                        <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-muted-foreground font-medium">%</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">Set to 0 if not applicable.</p>
                </div>
            </div>

            <div className="bg-card rounded-2xl p-6 sm:p-8 shadow-sm border border-border/40">
                <h4 className="font-semibold text-sm uppercase tracking-[0.15em] text-muted-foreground mb-5 flex items-center gap-2">
                    <span className="w-7 h-7 bg-amber-500/10 rounded-lg flex items-center justify-center text-sm border border-amber-500/15">📜</span>
                    Terms & Conditions
                </h4>
                <textarea
                    value={localSettings.termsAndConditions}
                    onChange={(e) => handleLocalSettingChange('termsAndConditions', e.target.value)}
                    rows={6}
                    className={cn(inputClass, "resize-none")}
                    placeholder="Enter your terms and conditions..."
                    aria-label="Terms and Conditions"
                />
            </div>

            {/* Save Bar */}
            <div className={cn(
                "sticky bottom-6 p-4 border rounded-2xl flex items-center justify-between transition-all duration-500 shadow-xl glass-card",
                hasChanges
                    ? "border-primary/20 ring-1 ring-primary/10 translate-y-0 opacity-100"
                    : "border-transparent translate-y-10 opacity-0 pointer-events-none"
            )}>
                <div className="flex items-center gap-3">
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
                    <p className="font-semibold text-foreground text-sm">Unsaved changes</p>
                </div>
                <motion.button
                    onClick={handleSaveChanges}
                    disabled={isSaving}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-6 py-2.5 rounded-xl font-semibold bg-primary text-primary-foreground hover:opacity-90 shadow-lg shadow-primary/20 transition-all disabled:opacity-60 flex items-center gap-2 text-sm"
                >
                    {isSaving ? (
                        <>
                            <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                            Saving...
                        </>
                    ) : (
                        'Save Changes'
                    )}
                </motion.button>
            </div>
        </div>
    );
}
