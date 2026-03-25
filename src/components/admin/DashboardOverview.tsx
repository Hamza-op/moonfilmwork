import { Receipt, BusinessSettings, Service } from '../../types';
import { cn } from '../../utils/cn';
import { motion } from 'framer-motion';
import type { AdminTab } from './AdminSidebar';

interface DashboardOverviewProps {
    receipts: Receipt[];
    settings: BusinessSettings;
    services: Service[];
    setActiveTab: (tab: AdminTab) => void;
}

const cardVariants = {
    hidden: { opacity: 0, y: 16 },
    visible: (i: number) => ({
        opacity: 1,
        y: 0,
        transition: { delay: i * 0.06, duration: 0.45, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
    }),
};

export function DashboardOverview({ receipts, settings, services, setActiveTab }: DashboardOverviewProps) {
    const totalRevenue = receipts.reduce((sum, r) => sum + r.total, 0);
    const totalPending = receipts.reduce((sum, r) => sum + r.balanceDue, 0);
    const paidReceipts = receipts.filter(r => r.status === 'paid').length;
    const partialReceipts = receipts.filter(r => r.status === 'partial').length;
    const pendingReceipts = receipts.filter(r => r.status === 'pending').length;

    const stats = [
        {
            label: 'Total Receipts',
            value: receipts.length,
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
            ),
            color: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/15',
        },
        {
            label: 'Total Revenue',
            value: `${settings.currency}${totalRevenue.toLocaleString()}`,
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
            color: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/15',
        },
        {
            label: 'Pending Amount',
            value: `${settings.currency}${totalPending.toLocaleString()}`,
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
            color: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/15',
        },
        {
            label: 'Active Services',
            value: services.filter(s => s.isActive).length,
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
            ),
            color: 'bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-500/15',
        },
    ];

    return (
        <div className="space-y-8">
            <div>
                <h3 className="text-3xl" style={{ fontFamily: 'var(--font-display)' }}>Dashboard</h3>
                <p className="text-muted-foreground mt-1">Welcome back. Here's your studio overview.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat, i) => (
                    <motion.div
                        key={stat.label}
                        custom={i}
                        initial="hidden"
                        animate="visible"
                        variants={cardVariants}
                        className="bg-card rounded-2xl p-5 shadow-sm border border-border/40 hover:shadow-md transition-all group"
                    >
                        <div className="flex items-center gap-3">
                            <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center border', stat.color)}>
                                {stat.icon}
                            </div>
                            <div>
                                <p className="text-xl sm:text-2xl font-bold tracking-tight" style={{ fontFamily: 'var(--font-mono)' }}>{stat.value}</p>
                                <p className="text-xs sm:text-sm text-muted-foreground">{stat.label}</p>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Status Distribution */}
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.45 }}
                    className="bg-card rounded-2xl p-6 shadow-sm border border-border/40"
                >
                    <h4 className="font-semibold mb-6 text-muted-foreground text-sm uppercase tracking-[0.15em]">Status Distribution</h4>
                    <div className="grid grid-cols-3 gap-3">
                        <div className="text-center p-4 bg-emerald-500/8 rounded-xl border border-emerald-500/15">
                            <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400" style={{ fontFamily: 'var(--font-mono)' }}>{paidReceipts}</p>
                            <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-300 mt-1">Fully Paid</p>
                        </div>
                        <div className="text-center p-4 bg-amber-500/8 rounded-xl border border-amber-500/15">
                            <p className="text-3xl font-bold text-amber-600 dark:text-amber-400" style={{ fontFamily: 'var(--font-mono)' }}>{partialReceipts}</p>
                            <p className="text-xs font-semibold text-amber-700 dark:text-amber-300 mt-1">Partial</p>
                        </div>
                        <div className="text-center p-4 bg-red-500/8 rounded-xl border border-red-500/15">
                            <p className="text-3xl font-bold text-red-600 dark:text-red-400" style={{ fontFamily: 'var(--font-mono)' }}>{pendingReceipts}</p>
                            <p className="text-xs font-semibold text-red-700 dark:text-red-300 mt-1">Pending</p>
                        </div>
                    </div>
                </motion.div>

                {/* Quick Actions */}
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.35, duration: 0.45 }}
                    className="bg-card rounded-2xl p-6 shadow-sm border border-border/40"
                >
                    <h4 className="font-semibold mb-6 text-muted-foreground text-sm uppercase tracking-[0.15em]">Quick Actions</h4>
                    <div className="grid grid-cols-2 gap-4">
                        <button
                            onClick={() => setActiveTab('services')}
                            className="p-5 bg-accent/60 hover:bg-accent rounded-xl text-left transition-all group border border-border/30 hover:border-border/60 hover:shadow-sm"
                        >
                            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform border border-primary/10">
                                <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                            </div>
                            <p className="font-semibold text-sm">Add New Service</p>
                            <p className="text-xs text-muted-foreground mt-0.5">Create a new offering</p>
                        </button>
                        <button
                            onClick={() => setActiveTab('settings')}
                            className="p-5 bg-accent/60 hover:bg-accent rounded-xl text-left transition-all group border border-border/30 hover:border-border/60 hover:shadow-sm"
                        >
                            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform border border-primary/10">
                                <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                            </div>
                            <p className="font-semibold text-sm">Update Settings</p>
                            <p className="text-xs text-muted-foreground mt-0.5">Manage details</p>
                        </button>
                    </div>
                </motion.div>
            </div>

            {/* Recent Receipts */}
            <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.45 }}
                className="bg-card rounded-2xl p-6 shadow-sm border border-border/40"
            >
                <h4 className="font-semibold mb-5 text-muted-foreground text-sm uppercase tracking-[0.15em]">Recent Activity</h4>
                {receipts.length === 0 ? (
                    <div className="text-center py-12">
                        <div className="w-16 h-16 bg-muted/30 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-muted-foreground/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </div>
                        <p className="text-muted-foreground font-medium">No receipts yet</p>
                        <p className="text-sm text-muted-foreground/70 mt-1">Receipts will appear here once customers submit quotes.</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {[...receipts].reverse().slice(0, 5).map((receipt) => (
                            <div key={receipt.id} className="flex items-center justify-between p-4 bg-accent/40 hover:bg-accent/70 rounded-xl transition-all border border-transparent hover:border-border/40 group">
                                <div className="flex items-center gap-4">
                                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm border border-primary/10">
                                        {receipt.customerName.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <p className="font-semibold text-sm">{receipt.customerName}</p>
                                        <p className="text-xs text-muted-foreground" style={{ fontFamily: 'var(--font-mono)' }}>
                                            #{receipt.receiptNumber} · {new Date(receipt.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-sm" style={{ fontFamily: 'var(--font-mono)' }}>
                                        {settings.currency}{receipt.total.toLocaleString()}
                                    </p>
                                    <span className={cn(
                                        'text-xs px-2.5 py-0.5 rounded-full font-semibold inline-block mt-1 border',
                                        receipt.status === 'paid' ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/15' :
                                            receipt.status === 'partial' ? 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/15' :
                                                'bg-red-500/10 text-red-700 dark:text-red-300 border-red-500/15'
                                    )}>
                                        {receipt.status}
                                    </span>
                                </div>
                            </div>
                        ))}
                        <button
                            onClick={() => setActiveTab('receipts')}
                            className="w-full py-3 text-center text-primary text-sm font-semibold hover:bg-primary/5 rounded-xl transition-colors mt-2"
                        >
                            View All Receipts →
                        </button>
                    </div>
                )}
            </motion.div>
        </div>
    );
}
