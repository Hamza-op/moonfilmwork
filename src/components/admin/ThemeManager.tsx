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
        setCurrentTheme(themeId);
        await onUpdateSettings({ ...settings, themePreference: themeId });
    };

    const handleDarkModeToggle = async () => {
        const newMode = !darkMode;
        setDarkMode(newMode);
        await onUpdateSettings({ ...settings, darkMode: newMode });
    };

    return (
        <div className="space-y-8">
            <div>
                <h3 className="text-3xl" style={{ fontFamily: 'var(--font-display)' }}>Appearance</h3>
                <p className="text-muted-foreground mt-1">Customize the look and feel of your studio</p>
            </div>

            {/* Dark Mode Toggle */}
            <div className="bg-card rounded-2xl p-6 shadow-sm border border-border/40 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className={cn(
                        "w-12 h-12 rounded-xl flex items-center justify-center transition-colors border",
                        darkMode ? "bg-slate-800/60 text-amber-400 border-amber-500/15" : "bg-amber-50 text-amber-600 dark:bg-amber-500/10 border-amber-500/15"
                    )}>
                        {darkMode ? (
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
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
                    aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
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
            <div className="space-y-5">
                <h4 className="font-semibold text-sm uppercase tracking-[0.15em] text-muted-foreground flex items-center gap-2">
                    <span className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center text-sm border border-primary/15">🎨</span>
                    Color Theme
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {themes.map((theme, i) => (
                        <motion.button
                            key={theme.id}
                            onClick={() => handleThemeChange(theme.id)}
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.04, duration: 0.35 }}
                            whileHover={{ scale: 1.02, y: -2 }}
                            whileTap={{ scale: 0.98 }}
                            className={cn(
                                "relative p-5 rounded-2xl border-2 text-left transition-all overflow-hidden group",
                                currentTheme === theme.id
                                    ? "border-primary bg-primary/5 shadow-lg ring-1 ring-primary/10"
                                    : "border-border/60 hover:border-border bg-card hover:shadow-md"
                            )}
                        >
                            <div className="flex items-center gap-3 mb-4">
                                <div
                                    className="w-11 h-11 rounded-xl shadow-sm flex items-center justify-center text-white border border-white/10"
                                    style={{ backgroundColor: theme.preview.primary }}
                                >
                                    {currentTheme === theme.id && (
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                        </svg>
                                    )}
                                </div>
                                <div>
                                    <h5 className="font-bold text-sm">{theme.name}</h5>
                                    <p className="text-xs text-muted-foreground line-clamp-1">{theme.description}</p>
                                </div>
                            </div>

                            {/* Color preview bars */}
                            <div className="flex gap-2">
                                <div className="h-2.5 flex-1 rounded-full" style={{ backgroundColor: theme.preview.primary }} />
                                <div className="h-2.5 flex-1 rounded-full" style={{ backgroundColor: theme.preview.secondary }} />
                                <div className="h-2.5 w-1/4 rounded-full" style={{ backgroundColor: theme.preview.accent }} />
                            </div>
                        </motion.button>
                    ))}
                </div>
            </div>
        </div>
    );
}
