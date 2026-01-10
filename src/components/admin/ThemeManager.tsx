import { BusinessSettings } from '../../types';
import { themes } from '../../data/themes';
import { cn } from '../../utils/cn';
import { motion } from 'framer-motion';

interface ThemeManagerProps {
    settings: BusinessSettings;
    onUpdateSettings: (settings: BusinessSettings) => Promise<void>;
    darkMode: boolean;
    setDarkMode: (value: boolean) => void;
    currentTheme: string;
    setCurrentTheme: (theme: string) => void;
}

export function ThemeManager({
    settings,
    onUpdateSettings,
    darkMode,
    setDarkMode,
    currentTheme,
    setCurrentTheme
}: ThemeManagerProps) {

    const handleThemeChange = async (themeId: string) => {
        setCurrentTheme(themeId); // Instant local update
        await onUpdateSettings({ ...settings, themePreference: themeId });
    };

    const handleDarkModeToggle = async () => {
        const newMode = !darkMode;
        setDarkMode(newMode); // Instant local update
        await onUpdateSettings({ ...settings, darkMode: newMode });
    };

    return (
        <div className="space-y-8">
            <div>
                <h3 className="text-2xl font-bold">Appearance</h3>
                <p className="text-muted-foreground mt-1">Customize the look and feel of your admin panel</p>
            </div>

            {/* Dark Mode Toggle */}
            <div className="bg-card rounded-2xl p-6 shadow-sm border border-border flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className={cn(
                        "w-12 h-12 rounded-xl flex items-center justify-center transition-colors",
                        darkMode ? "bg-slate-800 text-yellow-400" : "bg-orange-100 text-orange-500"
                    )}>
                        {darkMode ? (
                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                        ) : (
                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
                        )}
                    </div>
                    <div>
                        <h4 className="font-semibold text-lg">Dark Mode</h4>
                        <p className="text-sm text-muted-foreground">{darkMode ? 'Switch to light mode' : 'Switch to dark mode'}</p>
                    </div>
                </div>

                <button
                    onClick={handleDarkModeToggle}
                    className={cn(
                        "relative inline-flex h-8 w-14 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary",
                        darkMode ? "bg-primary" : "bg-muted"
                    )}
                >
                    <span
                        className={cn(
                            "inline-block h-6 w-6 transform rounded-full bg-white shadow-lg transition-transform",
                            darkMode ? "translate-x-7" : "translate-x-1"
                        )}
                    />
                </button>
            </div>

            {/* Theme Selection */}
            <div className="space-y-4">
                <h4 className="font-semibold text-lg">Color Theme</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {themes.map((theme) => (
                        <motion.button
                            key={theme.id}
                            onClick={() => handleThemeChange(theme.id)}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className={cn(
                                "relative p-4 rounded-2xl border-2 text-left transition-all overflow-hidden group",
                                currentTheme === theme.id
                                    ? "border-primary bg-primary/5 shadow-md"
                                    : "border-border hover:border-border/80 bg-card"
                            )}
                        >
                            <div className="flex items-center gap-3 mb-3">
                                <div
                                    className="w-10 h-10 rounded-full shadow-sm flex items-center justify-center text-white"
                                    style={{ backgroundColor: theme.preview.primary }}
                                >
                                    {currentTheme === theme.id && (
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                        </svg>
                                    )}
                                </div>
                                <div>
                                    <h5 className="font-bold">{theme.name}</h5>
                                    <p className="text-xs text-muted-foreground line-clamp-1">{theme.description}</p>
                                </div>
                            </div>

                            <div className="flex gap-2">
                                <div className="h-2 flex-1 rounded-full" style={{ backgroundColor: theme.preview.secondary }} />
                                <div className="h-2 w-1/3 rounded-full" style={{ backgroundColor: theme.preview.accent }} />
                            </div>
                        </motion.button>
                    ))}
                </div>
            </div>
        </div>
    );
}
