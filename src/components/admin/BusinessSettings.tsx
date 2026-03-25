import { useState, useEffect } from 'react';
import { BusinessSettings } from '../../types';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';

interface BusinessSettingsProps {
    settings: BusinessSettings;
    onUpdateSettings: (settings: BusinessSettings) => Promise<void>;
}

export function BusinessSettingsManager({ settings, onUpdateSettings }: BusinessSettingsProps) {
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
                <h3 className="text-3xl" style={{ fontFamily: 'var(--font-display)' }}>Settings</h3>
                <p className="text-muted-foreground mt-1">Manage your business profile and contact information</p>
            </div>

            <div className="bg-card rounded-2xl p-6 sm:p-8 shadow-sm border border-border/40">
                <h4 className="font-semibold text-sm uppercase tracking-[0.15em] text-muted-foreground mb-6 flex items-center gap-2">
                    <span className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center text-sm border border-primary/15">🏢</span>
                    Business Information
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                        <label htmlFor="biz-name" className="block text-xs font-semibold mb-1.5 uppercase tracking-wider text-muted-foreground">Business Name</label>
                        <input id="biz-name" type="text" value={localSettings.businessName} onChange={(e) => handleLocalSettingChange('businessName', e.target.value)} className={inputClass} />
                    </div>
                    <div>
                        <label htmlFor="biz-tagline" className="block text-xs font-semibold mb-1.5 uppercase tracking-wider text-muted-foreground">Tagline</label>
                        <input id="biz-tagline" type="text" value={localSettings.tagline} onChange={(e) => handleLocalSettingChange('tagline', e.target.value)} className={inputClass} />
                    </div>
                    <div>
                        <label htmlFor="biz-currency" className="block text-xs font-semibold mb-1.5 uppercase tracking-wider text-muted-foreground">Currency Symbol</label>
                        <input id="biz-currency" type="text" value={localSettings.currency} onChange={(e) => handleLocalSettingChange('currency', e.target.value)} className={inputClass} />
                    </div>
                    <div>
                        <label htmlFor="biz-ig" className="block text-xs font-semibold mb-1.5 uppercase tracking-wider text-muted-foreground">Instagram Handle</label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground">@</span>
                            <input id="biz-ig" type="text" value={localSettings.instagram} onChange={(e) => handleLocalSettingChange('instagram', e.target.value)} className={cn(inputClass, "pl-8")} />
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-card rounded-2xl p-6 sm:p-8 shadow-sm border border-border/40">
                <h4 className="font-semibold text-sm uppercase tracking-[0.15em] text-muted-foreground mb-6 flex items-center gap-2">
                    <span className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center text-sm border border-primary/15">📞</span>
                    Contact Details
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                        <label htmlFor="biz-phone" className="block text-xs font-semibold mb-1.5 uppercase tracking-wider text-muted-foreground">Phone Number</label>
                        <input id="biz-phone" type="text" value={localSettings.phone} onChange={(e) => handleLocalSettingChange('phone', e.target.value)} className={inputClass} />
                    </div>
                    <div>
                        <label htmlFor="biz-wa" className="block text-xs font-semibold mb-1.5 uppercase tracking-wider text-muted-foreground">WhatsApp Number</label>
                        <input id="biz-wa" type="text" value={localSettings.whatsappNumber} onChange={(e) => handleLocalSettingChange('whatsappNumber', e.target.value)} className={inputClass} placeholder="+92..." />
                    </div>
                    <div className="sm:col-span-2">
                        <label htmlFor="biz-email" className="block text-xs font-semibold mb-1.5 uppercase tracking-wider text-muted-foreground">Email</label>
                        <input id="biz-email" type="email" value={localSettings.email} onChange={(e) => handleLocalSettingChange('email', e.target.value)} className={inputClass} />
                    </div>
                    <div className="sm:col-span-2">
                        <label htmlFor="biz-address" className="block text-xs font-semibold mb-1.5 uppercase tracking-wider text-muted-foreground">Address</label>
                        <textarea id="biz-address" value={localSettings.address} onChange={(e) => handleLocalSettingChange('address', e.target.value)} rows={3} className={cn(inputClass, "resize-none")} />
                    </div>
                </div>
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
                    className="px-6 py-2.5 rounded-xl font-semibold bg-primary text-primary-foreground hover:opacity-90 shadow-lg shadow-primary/20 transition-all disabled:opacity-60 text-sm"
                >
                    {isSaving ? 'Saving...' : 'Save Changes'}
                </motion.button>
            </div>
        </div>
    );
}
