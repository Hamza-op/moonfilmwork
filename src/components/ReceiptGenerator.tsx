import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Service, Receipt, ReceiptItem, BusinessSettings } from '../types';

interface ReceiptGeneratorProps {
  services: Service[];
  settings: BusinessSettings;
  onSendWhatsApp: (receipt: Receipt) => void;
  receiptCount: number;
}

export function ReceiptGenerator({
  services,
  settings,
  onSendWhatsApp,
  receiptCount,
}: ReceiptGeneratorProps) {
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [eventType, setEventType] = useState('Wedding');
  const [selectedItems, setSelectedItems] = useState<ReceiptItem[]>([]);
  const [notes, setNotes] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');

  // Get today's date in YYYY-MM-DD format for min date validation
  const today = new Date().toISOString().split('T')[0];

  const categories = ['all', 'photography', 'videography', 'package', 'addon'];

  // Load from localStorage on mount
  useEffect(() => {
    const savedData = localStorage.getItem('receiptData');
    if (savedData) {
      try {
        const data = JSON.parse(savedData);
        setCustomerName(data.customerName || '');
        setCustomerPhone(data.customerPhone || '');
        setCustomerEmail(data.customerEmail || '');
        setEventDate(data.eventDate || '');
        setEventType(data.eventType || 'Wedding');
        setSelectedItems(data.selectedItems || []);
        setNotes(data.notes || '');
      } catch (error) {
        console.error('Error loading saved data:', error);
      }
    }
  }, []);

  // Save to localStorage whenever data changes
  useEffect(() => {
    const dataToSave = {
      customerName,
      customerPhone,
      customerEmail,
      eventDate,
      eventType,
      selectedItems,
      notes,
    };
    localStorage.setItem('receiptData', JSON.stringify(dataToSave));
  }, [customerName, customerPhone, customerEmail, eventDate, eventType, selectedItems, notes]);

  // Only show active services
  const activeServices = services.filter(s => s.isActive);

  const filteredServices =
    activeCategory === 'all'
      ? activeServices
      : activeServices.filter((s) => s.category === activeCategory);

  const addService = (service: Service) => {
    const existing = selectedItems.find((item) => item.serviceId === service.id);
    if (existing) {
      setSelectedItems(
        selectedItems.map((item) =>
          item.serviceId === service.id
            ? { ...item, quantity: item.quantity + 1, total: (item.quantity + 1) * item.price }
            : item
        )
      );
    } else {
      setSelectedItems([
        ...selectedItems,
        {
          serviceId: service.id,
          serviceName: service.name,
          quantity: 1,
          price: service.price,
          total: service.price,
        },
      ]);
    }
  };

  const updateQuantity = (serviceId: string, quantity: number) => {
    if (quantity <= 0) {
      setSelectedItems(selectedItems.filter((item) => item.serviceId !== serviceId));
    } else {
      setSelectedItems(
        selectedItems.map((item) =>
          item.serviceId === serviceId
            ? { ...item, quantity, total: quantity * item.price }
            : item
        )
      );
    }
  };

  const removeItem = (serviceId: string) => {
    setSelectedItems(selectedItems.filter((item) => item.serviceId !== serviceId));
  };

  const total = selectedItems.reduce((sum, item) => sum + item.total, 0);

  const handleSendWhatsApp = () => {
    if (selectedItems.length === 0) {
      alert('Please add at least one service');
      return;
    }

    const subtotal = selectedItems.reduce((sum, item) => sum + item.total, 0);
    const discountAmount = 0; // Default no discount
    const taxAmount = subtotal * (settings.taxRate / 100);
    const total = subtotal - discountAmount + taxAmount;

    const receipt: Receipt = {
      id: Date.now().toString(),
      receiptNumber: `MFW${String(receiptCount + 1).padStart(4, '0')}`,
      customerName: customerName || 'Walk-in Customer',
      customerPhone: customerPhone || '',
      customerEmail,
      eventDate,
      eventType,
      items: selectedItems,
      subtotal,
      discount: discountAmount,
      discountType: 'fixed',
      tax: taxAmount,
      total,
      notes,
      createdAt: new Date().toISOString(),
      status: 'pending',
      amountPaid: 0,
      balanceDue: total,
      advancePayment: 0,
    };

    onSendWhatsApp(receipt);

    // Reset form and clear localStorage
    setCustomerName('');
    setCustomerPhone('');
    setCustomerEmail('');
    setEventDate('');
    setEventType('Wedding');
    setSelectedItems([]);
    setNotes('');
    localStorage.removeItem('receiptData');
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'photography': return '📷';
      case 'videography': return '🎬';
      case 'package': return '📦';
      case 'addon': return '➕';
      default: return '🎯';
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'photography': return 'Photo';
      case 'videography': return 'Video';
      case 'package': return 'Packages';
      case 'addon': return 'Add-ons';
      default: return 'All';
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Section - Service Selection */}
      <div className="rounded-2xl shadow-lg p-4 md:p-6 bg-card text-card-foreground">
        <h2 className="text-lg md:text-xl font-bold mb-4 flex items-center gap-2">
          <span className="w-8 h-8 rounded-lg flex items-center justify-center bg-accent text-accent-foreground">📋</span>
          Select Services
        </h2>

        {/* Category Tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          {categories.map((cat) => (
            <motion.button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`group relative px-4 py-2.5 rounded-full text-xs md:text-sm font-semibold capitalize transition-all duration-300 ${activeCategory === cat
                ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/30 scale-105'
                : 'bg-muted/50 text-muted-foreground hover:bg-muted hover:shadow-md hover:scale-105'
                }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <span className="flex items-center gap-1.5">
                <span className={`transition-transform duration-300 ${activeCategory === cat ? 'scale-110' : 'group-hover:scale-110'}`}>
                  {getCategoryIcon(cat)}
                </span>
                {getCategoryLabel(cat)}
              </span>
              {activeCategory === cat && (
                <div className="absolute inset-0 rounded-full bg-primary/10 animate-pulse" />
              )}
            </motion.button>
          ))}
        </div>

        {/* Services Grid - responsive: 1 col mobile, 2 tablet, 3 desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 overflow-visible">
          {filteredServices.map((service) => {
            const selectedItem = selectedItems.find((item) => item.serviceId === service.id);
            const isSelected = !!selectedItem;
            return (
              <div
                key={service.id}
                className={`p-3 md:p-4 rounded-xl border-2 transition-all ${isSelected
                  ? 'border-primary bg-accent'
                  : 'border-border hover:border-primary/50 bg-card'
                  }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="font-medium text-sm md:text-base leading-tight">{service.name}</span>
                </div>
                <p className="text-xs md:text-sm text-muted-foreground mb-3 line-clamp-2">{service.description}</p>
                <div className="flex items-center justify-between mt-auto">
                  <p className="text-base md:text-lg font-bold text-primary">
                    {settings.currency}{service.price.toLocaleString()}
                  </p>
                  {isSelected ? (
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => updateQuantity(service.id, (selectedItem?.quantity || 1) - 1)}
                        className="w-7 h-7 md:w-6 md:h-6 rounded-full flex items-center justify-center text-sm font-bold bg-muted hover:opacity-80"
                      >
                        −
                      </button>
                      <span className="w-6 text-center text-sm font-medium">{selectedItem?.quantity}</span>
                      <button
                        onClick={() => updateQuantity(service.id, (selectedItem?.quantity || 0) + 1)}
                        className="w-7 h-7 md:w-6 md:h-6 rounded-full flex items-center justify-center text-sm font-bold bg-muted hover:opacity-80"
                      >
                        +
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => addService(service)}
                      className="px-3 py-1.5 bg-primary text-primary-foreground text-xs rounded-full hover:opacity-90 font-medium"
                    >
                      Add
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Section - 2 Columns (Info & Summary) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">

        {/* Left: Customer Info (Now Optional) */}
        <div className="rounded-2xl shadow-lg p-4 md:p-6 bg-card text-card-foreground">
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
            <span className="w-7 h-7 rounded-lg flex items-center justify-center bg-accent text-accent-foreground">👤</span>
            Customer Info <span className="text-xs font-normal text-muted-foreground ml-auto">(Optional)</span>
          </h2>
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium mb-1 text-muted-foreground">Name</label>
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full px-3 py-2.5 bg-input border border-border rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent text-sm placeholder:text-muted-foreground"
                placeholder="Walk-in Customer"
              />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1 text-muted-foreground">Phone</label>
              <input
                type="tel"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                className="w-full px-3 py-2.5 bg-input border border-border rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent text-sm placeholder:text-muted-foreground"
                placeholder="03xx xxxxxxx"
              />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1 text-muted-foreground">Email</label>
              <input
                type="email"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                className="w-full px-3 py-2.5 bg-input border border-border rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent text-sm placeholder:text-muted-foreground"
                placeholder="email@example.com"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium mb-1 text-muted-foreground">Event Date</label>
                <input
                  type="date"
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                  min={today}
                  className="w-full px-3 py-2.5 bg-input border border-border rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1 text-muted-foreground">Event Type</label>
                <select
                  value={eventType}
                  onChange={(e) => setEventType(e.target.value)}
                  className="w-full px-3 py-2.5 bg-input border border-border rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent text-sm"
                >
                  <option>Wedding</option>
                  <option>Pre-Wedding</option>
                  <option>Birthday</option>
                  <option>Corporate</option>
                  <option>Product</option>
                  <option>Portrait</option>
                  <option>Maternity</option>
                  <option>Other</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Summary & Selected Services */}
        <div className="rounded-2xl shadow-lg p-4 md:p-6 bg-card text-card-foreground flex flex-col h-full">
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
            <span className="w-7 h-7 rounded-lg flex items-center justify-center bg-accent text-accent-foreground">💰</span>
            Summary
          </h2>

          {/* Selected Services List (Scrollable if long) */}
          <div className="flex-1 mb-4 min-h-[100px] max-h-[300px] overflow-y-auto pr-1">
            {selectedItems.length > 0 ? (
              <div className="space-y-2">
                {selectedItems.map((item) => (
                  <div
                    key={item.serviceId}
                    className="flex items-center justify-between rounded-lg p-3 bg-muted"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{item.serviceName}</p>
                      <p className="text-xs text-muted-foreground">
                        {settings.currency}{item.price.toLocaleString()} × {item.quantity} = {settings.currency}{item.total.toLocaleString()}
                      </p>
                    </div>
                    <button
                      onClick={() => removeItem(item.serviceId)}
                      className="p-1.5 text-destructive hover:bg-destructive/10 rounded-lg ml-2 flex-shrink-0"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-muted-foreground text-sm border-2 border-dashed border-border rounded-lg p-4">
                <p>No services selected yet</p>
                <p className="text-xs mt-1">Select services from above to add them here</p>
              </div>
            )}
          </div>

          {/* Notes */}
          <div className="mb-4">
            <label className="block text-xs font-medium mb-1 text-muted-foreground">Notes</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              className="w-full px-3 py-2 bg-input border border-border rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent text-sm placeholder:text-muted-foreground"
              placeholder="Additional notes..."
            />
          </div>

          {/* Total */}
          <div className="rounded-xl p-4 mb-4 bg-accent">
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold">Total:</span>
              <span className="text-2xl font-bold text-primary">{settings.currency}{total.toLocaleString()}</span>
            </div>
          </div>

          {/* Send on WhatsApp Button */}
          <motion.button
            onClick={handleSendWhatsApp}
            disabled={selectedItems.length === 0}
            className="btn-uiverse w-full flex items-center justify-center gap-2 text-base disabled:opacity-50 disabled:cursor-not-allowed"
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            Send Receipt on WhatsApp
          </motion.button>
        </div>
      </div>
    </div>
  );
}
