import { Receipt, BusinessSettings } from '../../types';
import { cn } from '../../utils/cn';

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
            <div className="flex justify-between items-center">
                <div>
                    <h3 className="text-2xl font-bold">Receipt History</h3>
                    <p className="text-muted-foreground mt-1">View and manage all generated receipts</p>
                </div>
                <div className="bg-card px-4 py-2 rounded-lg border border-border text-sm font-medium">
                    Total Receipts: {receipts.length}
                </div>
            </div>

            {receipts.length === 0 ? (
                <div className="text-center py-16 text-muted-foreground bg-card rounded-2xl border border-dashed border-border/60">
                    <div className="w-20 h-20 bg-muted/30 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-10 h-10 text-muted-foreground/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                    </div>
                    <p className="text-lg font-semibold">No receipts generated yet</p>
                    <p className="text-sm mt-1">Create a receipt from the main page to see it here.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {[...receipts].reverse().map((receipt) => (
                        <div key={receipt.id} className="bg-card border border-border rounded-xl p-5 hover:shadow-md transition-shadow group">
                            <div className="flex flex-col lg:flex-row justify-between gap-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 flex-wrap mb-2">
                                        <span className="font-mono text-xs font-bold bg-primary/10 text-primary px-2 py-1 rounded">
                                            #{receipt.receiptNumber}
                                        </span>
                                        <select
                                            value={receipt.status}
                                            onChange={(e) => handleUpdateReceiptStatus(receipt.id, e.target.value as Receipt['status'])}
                                            className={cn(
                                                'text-xs px-2.5 py-1 rounded-full border-0 cursor-pointer font-medium transition-colors focus:ring-2 focus:ring-offset-1',
                                                receipt.status === 'paid' ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300' :
                                                    receipt.status === 'partial' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300' :
                                                        'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300'
                                            )}
                                        >
                                            <option value="pending">Pending</option>
                                            <option value="partial">Partial</option>
                                            <option value="paid">Paid</option>
                                        </select>
                                    </div>
                                    <h4 className="font-bold text-lg">{receipt.customerName}</h4>
                                    <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1 text-sm text-muted-foreground">
                                        <span className="flex items-center gap-1">
                                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                                            {receipt.customerPhone}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                            {receipt.eventType} • {new Date(receipt.eventDate).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <div className="mt-3 text-sm bg-muted/30 p-2 rounded-lg inline-block">
                                        <span className="text-muted-foreground">Items: </span>
                                        <span className="font-medium">
                                            {receipt.items.map(i => `${i.serviceName} (${i.quantity})`).join(', ')}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-6">
                                    <div className="text-right">
                                        <p className="text-2xl font-bold tracking-tight">
                                            {settings.currency}{receipt.total.toLocaleString()}
                                        </p>
                                        {receipt.balanceDue > 0 && (
                                            <p className="text-sm text-red-600 dark:text-red-400 font-medium">
                                                Due: {settings.currency}{receipt.balanceDue.toLocaleString()}
                                            </p>
                                        )}
                                        <p className="text-xs text-muted-foreground mt-1">
                                            Created: {new Date(receipt.createdAt).toLocaleString()}
                                        </p>
                                    </div>
                                    <div className="pl-6 border-l border-border h-full flex flex-col justify-center">
                                        <button
                                            onClick={() => handleDeleteReceipt(receipt.id)}
                                            className="p-2 text-muted-foreground hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                            title="Delete Receipt"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
