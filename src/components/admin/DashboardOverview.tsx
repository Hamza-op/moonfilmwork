import { Receipt, BusinessSettings, Service } from '../../types';
import { cn } from '../../utils/cn';

interface DashboardOverviewProps {
    receipts: Receipt[];
    settings: BusinessSettings;
    services: Service[];
    setActiveTab: (tab: any) => void;
}

export function DashboardOverview({ receipts, settings, services, setActiveTab }: DashboardOverviewProps) {
    const totalRevenue = receipts.reduce((sum, r) => sum + r.total, 0);
    const totalPending = receipts.reduce((sum, r) => sum + r.balanceDue, 0);
    const paidReceipts = receipts.filter(r => r.status === 'paid').length;
    const partialReceipts = receipts.filter(r => r.status === 'partial').length;
    const pendingReceipts = receipts.filter(r => r.status === 'pending').length;

    return (
        <div className="space-y-6">
            <h3 className="text-2xl font-bold">Dashboard Overview</h3>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-card rounded-2xl p-5 shadow-sm border border-border/50 hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center text-blue-600 dark:text-blue-400">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-2xl font-bold">{receipts.length}</p>
                            <p className="text-sm text-muted-foreground">Total Receipts</p>
                        </div>
                    </div>
                </div>

                <div className="bg-card rounded-2xl p-5 shadow-sm border border-border/50 hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center text-green-600 dark:text-green-400">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-2xl font-bold">{settings.currency}{totalRevenue.toLocaleString()}</p>
                            <p className="text-sm text-muted-foreground">Total Revenue</p>
                        </div>
                    </div>
                </div>

                <div className="bg-card rounded-2xl p-5 shadow-sm border border-border/50 hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-xl flex items-center justify-center text-orange-600 dark:text-orange-400">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-2xl font-bold">{settings.currency}{totalPending.toLocaleString()}</p>
                            <p className="text-sm text-muted-foreground">Pending Amount</p>
                        </div>
                    </div>
                </div>

                <div className="bg-card rounded-2xl p-5 shadow-sm border border-border/50 hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center text-purple-600 dark:text-purple-400">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-2xl font-bold">{services.filter(s => s.isActive).length}</p>
                            <p className="text-sm text-muted-foreground">Active Services</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Receipt Status */}
                <div className="bg-card rounded-2xl p-6 shadow-sm border border-border/50">
                    <h4 className="font-semibold mb-6 flex items-center justify-between">
                        <span>Status Distribution</span>
                    </h4>
                    <div className="grid grid-cols-3 gap-4">
                        <div className="text-center p-4 bg-green-500/10 rounded-xl border border-green-500/20">
                            <p className="text-3xl font-bold text-green-600 dark:text-green-400">{paidReceipts}</p>
                            <p className="text-sm font-medium text-green-700 dark:text-green-300">Fully Paid</p>
                        </div>
                        <div className="text-center p-4 bg-yellow-500/10 rounded-xl border border-yellow-500/20">
                            <p className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">{partialReceipts}</p>
                            <p className="text-sm font-medium text-yellow-700 dark:text-yellow-300">Partial</p>
                        </div>
                        <div className="text-center p-4 bg-red-500/10 rounded-xl border border-red-500/20">
                            <p className="text-3xl font-bold text-red-600 dark:text-red-400">{pendingReceipts}</p>
                            <p className="text-sm font-medium text-red-700 dark:text-red-300">Pending</p>
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-card rounded-2xl p-6 shadow-sm border border-border/50">
                    <h4 className="font-semibold mb-6">Quick Actions</h4>
                    <div className="grid grid-cols-2 gap-4">
                        <button
                            onClick={() => setActiveTab('services')}
                            className="p-4 bg-accent hover:bg-accent/80 rounded-xl text-left transition-colors group"
                        >
                            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                                <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                            </div>
                            <p className="font-semibold">Add New Service</p>
                            <p className="text-xs text-muted-foreground">Create a new offering</p>
                        </button>
                        <button
                            onClick={() => setActiveTab('settings')}
                            className="p-4 bg-accent hover:bg-accent/80 rounded-xl text-left transition-colors group"
                        >
                            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                                <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                            </div>
                            <p className="font-semibold">Update Settings</p>
                            <p className="text-xs text-muted-foreground">Manage details</p>
                        </button>
                    </div>
                </div>
            </div>

            {/* Recent Receipts List */}
            <div className="bg-card rounded-2xl p-6 shadow-sm border border-border/50">
                <h4 className="font-semibold mb-4 text-lg">Recent Invoice Activity</h4>
                {receipts.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">No receipts yet</p>
                ) : (
                    <div className="space-y-3">
                        {[...receipts].reverse().slice(0, 5).map((receipt) => (
                            <div key={receipt.id} className="flex items-center justify-between p-4 bg-accent/50 hover:bg-accent rounded-xl transition-colors border border-transparent hover:border-border">
                                <div className="flex items-center gap-4">
                                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                                        {receipt.customerName.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="font-medium">{receipt.customerName}</p>
                                        <p className="text-xs text-muted-foreground">#{receipt.receiptNumber} • {new Date(receipt.createdAt).toLocaleDateString()}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold">{settings.currency}{receipt.total.toLocaleString()}</p>
                                    <span className={cn(
                                        'text-xs px-2.5 py-0.5 rounded-full font-medium inline-block mt-1',
                                        receipt.status === 'paid' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' :
                                            receipt.status === 'partial' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300' :
                                                'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
                                    )}>
                                        {receipt.status}
                                    </span>
                                </div>
                            </div>
                        ))}
                        <button
                            onClick={() => setActiveTab('receipts')}
                            className="w-full py-3 text-center text-primary text-sm font-medium hover:underline mt-2"
                        >
                            View All Receipts
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
