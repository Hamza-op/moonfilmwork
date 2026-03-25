import { Receipt, BusinessSettings } from '../../types';
import { cn } from '../../utils/cn';
import { motion } from 'framer-motion';

interface ReceiptHistoryProps {
    receipts: Receipt[];
    settings: BusinessSettings;
    onUpdateReceipt: (receipt: Receipt) => Promise<void>;
    onDeleteReceipt: (id: string) => Promise<void>;
}

export function ReceiptHistory({ receipts, settings, onUpdateReceipt, onDeleteReceipt }: ReceiptHistoryProps) {

    const handleDeleteReceipt = async (id: string) => {
        if (confirm('Are you sure you want to delete this receipt?')) {
            await onDeleteReceipt(id);
        }
    };

    const handleUpdateReceiptStatus = async (id: string, status: Receipt['status']) => {
        const receipt = receipts.find(r => r.id === id);
        if (receipt) {
            await onUpdateReceipt({ ...receipt, status });
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div>
                    <h3 className="text-3xl" style={{ fontFamily: 'var(--font-display)' }}>Receipts</h3>
                    <p className="text-muted-foreground mt-1">View and manage all generated receipts</p>
                </div>
                <div className="bg-card px-4 py-2 rounded-xl border border-border/40 text-sm font-semibold shadow-sm" style={{ fontFamily: 'var(--font-mono)' }}>
                    {receipts.length} total
                </div>
            </div>

            {receipts.length === 0 ? (
                <div className="text-center py-20 text-muted-foreground bg-card rounded-2xl border border-dashed border-border/40">
                    <div className="w-20 h-20 bg-muted/20 rounded-full flex items-center justify-center mx-auto mb-5">
                        <svg className="w-10 h-10 text-muted-foreground/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                    </div>
                    <p className="text-lg font-semibold">No receipts generated yet</p>
                    <p className="text-sm mt-1.5 text-muted-foreground/70">Create a receipt from the main page to see it here.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {[...receipts].reverse().map((receipt, i) => (
                        <motion.div
                            key={receipt.id}
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.04, duration: 0.35 }}
                            className="bg-card border border-border/40 rounded-xl p-5 hover:shadow-md transition-all group"
                        >
                            <div className="flex flex-col lg:flex-row justify-between gap-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 flex-wrap mb-2">
                                        <span className="font-mono text-xs font-bold bg-primary/10 text-primary px-2.5 py-1 rounded-lg border border-primary/10">
                                            #{receipt.receiptNumber}
                                        </span>
                                        <select
                                            value={receipt.status}
                                            onChange={(e) => handleUpdateReceiptStatus(receipt.id, e.target.value as Receipt['status'])}
                                            aria-label={`Status of receipt ${receipt.receiptNumber}`}
                                            className={cn(
                                                'text-xs px-2.5 py-1 rounded-full cursor-pointer font-semibold transition-colors focus:ring-2 focus:ring-offset-1 border',
                                                receipt.status === 'paid' ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/15' :
                                                    receipt.status === 'partial' ? 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/15' :
                                                        'bg-red-500/10 text-red-700 dark:text-red-300 border-red-500/15'
                                            )}
                                        >
                                            <option value="pending">Pending</option>
                                            <option value="partial">Partial</option>
                                            <option value="paid">Paid</option>
                                        </select>
                                    </div>
                                    <h4 className="font-bold text-lg">{receipt.customerName}</h4>
                                    <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1.5 text-sm text-muted-foreground">
                                        <span className="flex items-center gap-1.5">
                                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                                            {receipt.customerPhone || '—'}
                                        </span>
                                        <span className="flex items-center gap-1.5">
                                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                            {receipt.eventType} · {receipt.eventDate ? new Date(receipt.eventDate).toLocaleDateString() : 'TBD'}
                                        </span>
                                    </div>
                                    <div className="mt-3 text-sm bg-muted/30 p-2.5 rounded-lg inline-block border border-border/20">
                                        <span className="text-muted-foreground">Items: </span>
                                        <span className="font-medium">
                                            {receipt.items.map(i => `${i.serviceName} (${i.quantity})`).join(', ')}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
                                    <div className="text-left sm:text-right">
                                        <p className="text-2xl font-bold tracking-tight" style={{ fontFamily: 'var(--font-mono)' }}>
                                            {settings.currency}{receipt.total.toLocaleString()}
                                        </p>
                                        {receipt.balanceDue > 0 && (
                                            <p className="text-sm text-red-600 dark:text-red-400 font-semibold mt-0.5">
                                                Due: {settings.currency}{receipt.balanceDue.toLocaleString()}
                                            </p>
                                        )}
                                        <p className="text-xs text-muted-foreground mt-1.5" style={{ fontFamily: 'var(--font-mono)' }}>
                                            {new Date(receipt.createdAt).toLocaleString()}
                                        </p>
                                    </div>
                                    <div className="pt-3 sm:pt-0 sm:pl-6 border-t sm:border-t-0 sm:border-l border-border/40 flex flex-col justify-center">
                                        <button
                                            onClick={() => handleDeleteReceipt(receipt.id)}
                                            className="p-2.5 text-muted-foreground hover:text-red-600 hover:bg-red-500/10 rounded-xl transition-colors opacity-100 sm:opacity-0 sm:group-hover:opacity-100"
                                            title="Delete Receipt"
                                            aria-label={`Delete receipt ${receipt.receiptNumber}`}
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
}
