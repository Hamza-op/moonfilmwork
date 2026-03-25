import { useState } from 'react';
import { Service, BusinessSettings } from '../../types';
import { cn } from '../../utils/cn';
import { motion, AnimatePresence } from 'framer-motion';

interface ServicesManagerProps {
    services: Service[];
    settings: BusinessSettings;
    onAddService: (service: Service) => Promise<void>;
    onUpdateService: (service: Service) => Promise<void>;
    onDeleteService: (id: string) => Promise<void>;
}

export function ServicesManager({
    services,
    settings,
    onAddService,
    onUpdateService,
    onDeleteService
}: ServicesManagerProps) {
    const [editingService, setEditingService] = useState<Service | null>(null);
    const [isAddingService, setIsAddingService] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCategory, setFilterCategory] = useState<string>('all');

    const [newService, setNewService] = useState<Omit<Service, 'id'>>({
        name: '',
        category: 'photography',
        price: 0,
        description: '',
        isActive: true,
    });

    const filteredServices = services.filter((s) => {
        const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            s.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = filterCategory === 'all' || s.category === filterCategory;
        return matchesSearch && matchesCategory;
    });

    const handleAddService = async () => {
        if (!newService.name || newService.price <= 0) return;
        const service: Service = {
            ...newService,
            id: Date.now().toString(),
        };
        await onAddService(service);
        setNewService({ name: '', category: 'photography', price: 0, description: '', isActive: true });
        setIsAddingService(false);
    };

    const handleUpdateService = async () => {
        if (!editingService) return;
        await onUpdateService(editingService);
        setEditingService(null);
    };

    const handleDeleteService = async (id: string) => {
        if (confirm('Are you sure you want to delete this service?')) {
            await onDeleteService(id);
        }
    };

    const handleToggleService = async (id: string) => {
        const service = services.find(s => s.id === id);
        if (service) {
            await onUpdateService({ ...service, isActive: !service.isActive });
        }
    };

    const getCategoryColor = (category: string) => {
        switch (category) {
            case 'photography': return 'bg-blue-500/10 text-blue-700 dark:text-blue-300 border border-blue-500/15';
            case 'videography': return 'bg-violet-500/10 text-violet-700 dark:text-violet-300 border border-violet-500/15';
            case 'package': return 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/15';
            case 'addon': return 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/15';
            default: return 'bg-muted text-muted-foreground border border-border';
        }
    };

    const inputClass = "px-4 py-2.5 border border-border rounded-xl bg-input focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm";

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h3 className="text-3xl" style={{ fontFamily: 'var(--font-display)' }}>Services</h3>
                    <p className="text-muted-foreground mt-1">Add, edit, or remove services offered by your studio</p>
                </div>
                <motion.button
                    onClick={() => setIsAddingService(true)}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="px-5 py-2.5 bg-primary text-primary-foreground rounded-xl hover:opacity-90 transition-all shadow-lg shadow-primary/20 flex items-center gap-2 font-semibold text-sm"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Add Service
                </motion.button>
            </div>

            {/* Search / Filter */}
            <div className="flex flex-col sm:flex-row gap-3 bg-card p-4 rounded-xl shadow-sm border border-border/40">
                <div className="flex-1 relative">
                    <svg className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input
                        type="text"
                        placeholder="Search services..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className={cn("w-full pl-10 pr-4", inputClass)}
                        aria-label="Search services"
                    />
                </div>
                <select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className={inputClass}
                    aria-label="Filter by category"
                >
                    <option value="all">All Categories</option>
                    <option value="photography">Photography</option>
                    <option value="videography">Videography</option>
                    <option value="package">Packages</option>
                    <option value="addon">Add-ons</option>
                </select>
            </div>

            {/* Add Service Form */}
            <AnimatePresence>
                {isAddingService && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                    >
                        <div className="bg-card rounded-xl p-6 border-2 border-dashed border-primary/20 shadow-sm">
                            <h4 className="font-bold text-lg mb-5 text-primary flex items-center gap-2">
                                <span className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center text-sm border border-primary/15">✨</span>
                                New Service
                            </h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <input type="text" placeholder="Service Name" value={newService.name} onChange={(e) => setNewService({ ...newService, name: e.target.value })} className={inputClass} />
                                <select value={newService.category} onChange={(e) => setNewService({ ...newService, category: e.target.value as Service['category'] })} className={inputClass}>
                                    <option value="photography">Photography</option>
                                    <option value="videography">Videography</option>
                                    <option value="package">Package</option>
                                    <option value="addon">Add-on</option>
                                </select>
                                <input type="number" placeholder="Price" value={newService.price || ''} onChange={(e) => setNewService({ ...newService, price: Number(e.target.value) })} className={inputClass} />
                                <input type="text" placeholder="Description" value={newService.description} onChange={(e) => setNewService({ ...newService, description: e.target.value })} className={inputClass} />
                            </div>
                            <div className="flex gap-3 mt-5 justify-end">
                                <button onClick={() => setIsAddingService(false)} className="px-5 py-2.5 bg-muted text-muted-foreground rounded-xl hover:opacity-80 transition-colors font-medium text-sm">
                                    Cancel
                                </button>
                                <button onClick={handleAddService} disabled={!newService.name || newService.price <= 0} className="px-5 py-2.5 bg-primary text-primary-foreground rounded-xl hover:opacity-90 disabled:opacity-45 disabled:cursor-not-allowed transition-all shadow-md shadow-primary/15 font-semibold text-sm">
                                    Save Service
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Services List */}
            <div className="space-y-3">
                {filteredServices.map((service) => (
                    <motion.div
                        key={service.id}
                        layout
                        className={cn(
                            "bg-card border rounded-xl p-5 transition-all hover:shadow-md",
                            service.isActive ? "border-border/40" : "border-border/30 opacity-55"
                        )}
                    >
                        {editingService?.id === service.id ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <input type="text" value={editingService.name} onChange={(e) => setEditingService({ ...editingService, name: e.target.value })} className={inputClass} />
                                <select value={editingService.category} onChange={(e) => setEditingService({ ...editingService, category: e.target.value as Service['category'] })} className={inputClass}>
                                    <option value="photography">Photography</option>
                                    <option value="videography">Videography</option>
                                    <option value="package">Package</option>
                                    <option value="addon">Add-on</option>
                                </select>
                                <input type="number" value={editingService.price} onChange={(e) => setEditingService({ ...editingService, price: Number(e.target.value) })} className={inputClass} />
                                <input type="text" value={editingService.description} onChange={(e) => setEditingService({ ...editingService, description: e.target.value })} className={inputClass} />
                                <div className="sm:col-span-2 flex gap-3 justify-end mt-2">
                                    <button onClick={() => setEditingService(null)} className="px-5 py-2.5 bg-muted text-muted-foreground rounded-xl hover:opacity-80 transition-colors font-medium text-sm">
                                        Cancel
                                    </button>
                                    <button onClick={handleUpdateService} className="px-5 py-2.5 bg-primary text-primary-foreground rounded-xl hover:opacity-90 transition-colors font-semibold text-sm shadow-sm">
                                        Update
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 flex-wrap mb-1">
                                        <h4 className="font-bold text-base">{service.name}</h4>
                                        <span className={cn('text-xs px-2.5 py-0.5 rounded-full font-semibold', getCategoryColor(service.category))}>
                                            {service.category}
                                        </span>
                                        {!service.isActive && (
                                            <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground border border-border/50 font-medium">Inactive</span>
                                        )}
                                    </div>
                                    <p className="text-sm text-muted-foreground leading-relaxed">{service.description}</p>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className="text-lg font-bold text-primary" style={{ fontFamily: 'var(--font-mono)' }}>
                                        {settings.currency}{service.price.toLocaleString()}
                                    </span>
                                    <div className="flex items-center gap-1 bg-muted/40 p-1 rounded-xl border border-border/30">
                                        <button
                                            onClick={() => handleToggleService(service.id)}
                                            className={cn(
                                                "p-2 rounded-lg transition-colors",
                                                service.isActive ? "text-emerald-600 hover:bg-emerald-500/10" : "text-muted-foreground hover:bg-muted"
                                            )}
                                            title={service.isActive ? "Deactivate" : "Activate"}
                                            aria-label={service.isActive ? `Deactivate ${service.name}` : `Activate ${service.name}`}
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={service.isActive ? "M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" : "M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"} />
                                            </svg>
                                        </button>
                                        <button
                                            onClick={() => setEditingService(service)}
                                            className="p-2 text-blue-600 hover:bg-blue-500/10 rounded-lg transition-colors"
                                            title="Edit"
                                            aria-label={`Edit ${service.name}`}
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                            </svg>
                                        </button>
                                        <button
                                            onClick={() => handleDeleteService(service.id)}
                                            className="p-2 text-red-600 hover:bg-red-500/10 rounded-lg transition-colors"
                                            title="Delete"
                                            aria-label={`Delete ${service.name}`}
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </motion.div>
                ))}

                {filteredServices.length === 0 && (
                    <div className="text-center py-16 text-muted-foreground bg-card rounded-2xl border border-dashed border-border/40">
                        <p className="font-medium">No services found</p>
                        <p className="text-sm mt-1">Try adjusting your search or filter.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
