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

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-start">
                <div>
                    <h3 className="text-2xl font-bold">Business Settings</h3>
                    <p className="text-muted-foreground mt-1">Manage your business profile and contact information</p>
                </div>
            </div>

            <div className="bg-card rounded-2xl p-6 shadow-sm border border-border">
                <h4 className="font-semibold text-lg mb-6 flex items-center gap-2">
                    <span className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">🏢</span>
                    Business Information
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium mb-1.5">Business Name</label>
                        <input
                            type="text"
                            value={localSettings.businessName}
                            onChange={(e) => handleLocalSettingChange('businessName', e.target.value)}
                            className="w-full px-4 py-2.5 border border-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary bg-input transition-all"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1.5">Tagline</label>
                        <input
                            type="text"
                            value={localSettings.tagline}
                            onChange={(e) => handleLocalSettingChange('tagline', e.target.value)}
                            className="w-full px-4 py-2.5 border border-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary bg-input transition-all"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1.5">Currency Symbol</label>
                        <input
                            type="text"
                            value={localSettings.currency}
                            onChange={(e) => handleLocalSettingChange('currency', e.target.value)}
                            className="w-full px-4 py-2.5 border border-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary bg-input transition-all"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1.5">Instagram Handle</label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground">@</span>
                            <input
                                type="text"
                                value={localSettings.instagram}
                                onChange={(e) => handleLocalSettingChange('instagram', e.target.value)}
                                className="w-full pl-8 pr-4 py-2.5 border border-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary bg-input transition-all"
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-card rounded-2xl p-6 shadow-sm border border-border">
                <h4 className="font-semibold text-lg mb-6 flex items-center gap-2">
                    <span className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">📞</span>
                    Contact Details
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium mb-1.5">Phone Number</label>
                        <input
                            type="text"
                            value={localSettings.phone}
                            onChange={(e) => handleLocalSettingChange('phone', e.target.value)}
                            className="w-full px-4 py-2.5 border border-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary bg-input transition-all"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1.5">WhatsApp Number <span className="text-xs text-muted-foreground">(with country code)</span></label>
                        <input
                            type="text"
                            value={localSettings.whatsappNumber}
                            onChange={(e) => handleLocalSettingChange('whatsappNumber', e.target.value)}
                            className="w-full px-4 py-2.5 border border-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary bg-input transition-all"
                            placeholder="+91..."
                        />
                    </div>
                    <div className="sm:col-span-2">
                        <label className="block text-sm font-medium mb-1.5">Email</label>
                        <input
                            type="email"
                            value={localSettings.email}
                            onChange={(e) => handleLocalSettingChange('email', e.target.value)}
                            className="w-full px-4 py-2.5 border border-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary bg-input transition-all"
                        />
                    </div>
                    <div className="sm:col-span-2">
                        <label className="block text-sm font-medium mb-1.5">Address</label>
                        <textarea
                            value={localSettings.address}
                            onChange={(e) => handleLocalSettingChange('address', e.target.value)}
                            rows={3}
                            className="w-full px-4 py-2.5 border border-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary bg-input transition-all resize-none"
                        />
                    </div>
                </div>
            </div>

            {/* Save Action Bar */}
            <div className={cn(
                "sticky bottom-6 p-4 border rounded-2xl flex items-center justify-between transition-all duration-300 shadow-xl backdrop-blur-md",
                hasChanges
                    ? "bg-card/90 border-primary/20 ring-1 ring-primary/10 translate-y-0 opacity-100"
                    : "bg-muted/50 border-transparent translate-y-10 opacity-0 pointer-events-none"
            )}>
                <div className="flex items-center gap-3">
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-500 animate-pulse" />
                    <p className="font-medium text-foreground">
                        You have unsaved changes
                    </p>
                </div>
                <motion.button
                    onClick={handleSaveChanges}
                    disabled={isSaving}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-6 py-2.5 rounded-xl font-medium bg-primary text-primary-foreground hover:opacity-90 shadow-lg shadow-primary/25 transition-all disabled:opacity-70"
                >
                    {isSaving ? 'Saving...' : 'Save Changes'}
                </motion.button>
            </div>
        </div>
    );
}
