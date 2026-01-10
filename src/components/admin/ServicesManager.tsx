import { useState } from 'react';
import { Service, BusinessSettings } from '../../types';
import { cn } from '../../utils/cn';

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
            case 'photography': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300';
            case 'videography': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300';
            case 'package': return 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300';
            case 'addon': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-300';
            default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h3 className="text-2xl font-bold">Manage Services</h3>
                    <p className="text-muted-foreground mt-1">Add, edit, or remove services offered by your studio</p>
                </div>
                <button
                    onClick={() => setIsAddingService(true)}
                    className="px-4 py-2 bg-primary text-primary-foreground rounded-xl hover:opacity-90 transition-all shadow-lg hover:shadow-primary/25 flex items-center gap-2"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Add New Service
                </button>
            </div>

            {/* Search and Filter */}
            <div className="flex flex-col sm:flex-row gap-3 bg-card p-4 rounded-xl shadow-sm border border-border">
                <div className="flex-1 relative">
                    <svg className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input
                        type="text"
                        placeholder="Search services..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary bg-input transition-all"
                    />
                </div>
                <select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className="px-4 py-2 border border-border rounded-lg bg-input focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                >
                    <option value="all">All Categories</option>
                    <option value="photography">Photography</option>
                    <option value="videography">Videography</option>
                    <option value="package">Packages</option>
                    <option value="addon">Add-ons</option>
                </select>
            </div>

            {/* Add Service Form */}
            {isAddingService && (
                <div className="bg-card rounded-xl p-6 border-2 border-dashed border-primary/20 shadow-sm animate-in fade-in slide-in-from-top-4">
                    <h4 className="font-bold text-lg mb-4 text-primary">Add New Service</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <input
                            type="text"
                            placeholder="Service Name"
                            value={newService.name}
                            onChange={(e) => setNewService({ ...newService, name: e.target.value })}
                            className="px-4 py-2 border border-border rounded-lg bg-input focus:ring-2 focus:ring-primary/20 focus:border-primary"
                        />
                        <select
                            value={newService.category}
                            onChange={(e) => setNewService({ ...newService, category: e.target.value as Service['category'] })}
                            className="px-4 py-2 border border-border rounded-lg bg-input focus:ring-2 focus:ring-primary/20 focus:border-primary"
                        >
                            <option value="photography">Photography</option>
                            <option value="videography">Videography</option>
                            <option value="package">Package</option>
                            <option value="addon">Add-on</option>
                        </select>
                        <input
                            type="number"
                            placeholder="Price"
                            value={newService.price || ''}
                            onChange={(e) => setNewService({ ...newService, price: Number(e.target.value) })}
                            className="px-4 py-2 border border-border rounded-lg bg-input focus:ring-2 focus:ring-primary/20 focus:border-primary"
                        />
                        <input
                            type="text"
                            placeholder="Description"
                            value={newService.description}
                            onChange={(e) => setNewService({ ...newService, description: e.target.value })}
                            className="px-4 py-2 border border-border rounded-lg bg-input focus:ring-2 focus:ring-primary/20 focus:border-primary"
                        />
                    </div>
                    <div className="flex gap-2 mt-4 justify-end">
                        <button
                            onClick={() => setIsAddingService(false)}
                            className="px-4 py-2 bg-muted text-muted-foreground rounded-lg hover:opacity-80 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleAddService}
                            disabled={!newService.name || newService.price <= 0}
                            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md shadow-primary/20"
                        >
                            Save Service
                        </button>
                    </div>
                </div>
            )}

            {/* Services List */}
            <div className="space-y-3">
                {filteredServices.map((service) => (
                    <div
                        key={service.id}
                        className={cn(
                            "bg-card border rounded-xl p-4 transition-all hover:shadow-md",
                            service.isActive ? "border-border" : "border-border opacity-60 bg-muted/20"
                        )}
                    >
                        {editingService?.id === service.id ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 animate-in fade-in">
                                <input
                                    type="text"
                                    value={editingService.name}
                                    onChange={(e) => setEditingService({ ...editingService, name: e.target.value })}
                                    className="px-3 py-2 border border-border rounded-lg bg-input focus:ring-2 focus:ring-blue-500/20"
                                />
                                <select
                                    value={editingService.category}
                                    onChange={(e) => setEditingService({ ...editingService, category: e.target.value as Service['category'] })}
                                    className="px-3 py-2 border border-border rounded-lg bg-input"
                                >
                                    <option value="photography">Photography</option>
                                    <option value="videography">Videography</option>
                                    <option value="package">Package</option>
                                    <option value="addon">Add-on</option>
                                </select>
                                <input
                                    type="number"
                                    value={editingService.price}
                                    onChange={(e) => setEditingService({ ...editingService, price: Number(e.target.value) })}
                                    className="px-3 py-2 border border-border rounded-lg bg-input"
                                />
                                <input
                                    type="text"
                                    value={editingService.description}
                                    onChange={(e) => setEditingService({ ...editingService, description: e.target.value })}
                                    className="px-3 py-2 border border-border rounded-lg bg-input"
                                />
                                <div className="sm:col-span-2 flex gap-2 justify-end mt-2">
                                    <button
                                        onClick={() => setEditingService(null)}
                                        className="px-4 py-2 bg-muted text-muted-foreground rounded-lg hover:opacity-80 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleUpdateService}
                                        className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-colors"
                                    >
                                        Update Service
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 flex-wrap mb-1">
                                        <h4 className="font-bold text-lg">{service.name}</h4>
                                        <span className={cn('text-xs px-2.5 py-0.5 rounded-full font-medium', getCategoryColor(service.category))}>
                                            {service.category}
                                        </span>
                                        {!service.isActive && (
                                            <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground border border-border">Inactive</span>
                                        )}
                                    </div>
                                    <p className="text-sm text-foreground/70">{service.description}</p>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className="text-xl font-bold text-primary">
                                        {settings.currency}{service.price.toLocaleString()}
                                    </span>
                                    <div className="flex items-center gap-1 bg-muted/50 p-1 rounded-lg border border-border/50">
                                        <button
                                            onClick={() => handleToggleService(service.id)}
                                            className={cn(
                                                "p-2 rounded-md transition-colors",
                                                service.isActive ? "text-green-600 hover:bg-green-100 dark:hover:bg-green-900/30" : "text-muted-foreground hover:bg-muted"
                                            )}
                                            title={service.isActive ? "Deactivate" : "Activate"}
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={service.isActive ? "M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" : "M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"} />
                                            </svg>
                                        </button>
                                        <button
                                            onClick={() => setEditingService(service)}
                                            className="p-2 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-md transition-colors"
                                            title="Edit"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                            </svg>
                                        </button>
                                        <button
                                            onClick={() => handleDeleteService(service.id)}
                                            className="p-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-md transition-colors"
                                            title="Delete"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
