import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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

  const today = new Date().toISOString().split('T')[0];
  const categories = ['all', 'photography', 'videography', 'package', 'addon'];

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
    const discountAmount = 0;
    const taxAmount = subtotal * (settings.taxRate / 100);
    const finalTotal = subtotal - discountAmount + taxAmount;

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
      total: finalTotal,
      notes,
      createdAt: new Date().toISOString(),
      status: 'pending',
      amountPaid: 0,
      balanceDue: finalTotal,
      advancePayment: 0,
    };

    onSendWhatsApp(receipt);

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
    <div className="space-y-8">
      {/* ═══ Service Selection ═══ */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="rounded-[var(--radius-lg)] shadow-lg p-5 md:p-8 bg-card text-card-foreground border border-border/40"
      >
        <h2 className="text-xl md:text-2xl mb-6 flex items-center gap-3" style={{ fontFamily: 'var(--font-display)' }}>
          <span className="w-9 h-9 rounded-xl flex items-center justify-center bg-primary/10 text-lg border border-primary/15">📋</span>
          Select Services
        </h2>

        {/* Category Tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map((cat) => (
            <motion.button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`group relative px-4 py-2.5 rounded-full text-xs md:text-sm font-semibold capitalize transition-all duration-300 ${activeCategory === cat
                ? 'bg-primary text-primary-foreground shadow-lg scale-105'
                : 'bg-muted/60 text-muted-foreground hover:bg-muted hover:shadow-sm hover:scale-[1.03]'
                }`}
              whileHover={{ scale: activeCategory === cat ? 1.05 : 1.04 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              aria-pressed={activeCategory === cat}
              aria-label={`Filter by ${getCategoryLabel(cat)}`}
            >
              <span className="flex items-center gap-1.5">
                <span className={`transition-transform duration-300 ${activeCategory === cat ? 'scale-110' : 'group-hover:scale-110'}`}>
                  {getCategoryIcon(cat)}
                </span>
                {getCategoryLabel(cat)}
              </span>
            </motion.button>
          ))}
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
          <AnimatePresence mode="popLayout">
            {filteredServices.map((service, i) => {
              const selectedItem = selectedItems.find((item) => item.serviceId === service.id);
              const isSelected = !!selectedItem;
              return (
                <motion.div
                  key={service.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3, delay: i * 0.03 }}
                  className={`group p-4 md:p-5 rounded-xl border-2 transition-all cursor-default ${isSelected
                    ? 'border-primary bg-primary/5 dark:bg-primary/10 shadow-md ring-1 ring-primary/10'
                    : 'border-border/60 hover:border-primary/40 bg-card hover:shadow-md'
                    }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-semibold text-sm md:text-base leading-tight">{service.name}</span>
                    {isSelected && (
                      <span className="flex h-5 w-5 rounded-full bg-primary items-center justify-center flex-shrink-0 ml-2">
                        <svg className="w-3 h-3 text-primary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </span>
                    )}
                  </div>
                  <p className="text-xs md:text-sm text-muted-foreground mb-4 line-clamp-2 leading-relaxed">{service.description}</p>
                  <div className="flex items-center justify-between mt-auto">
                    <p className="text-base md:text-lg font-bold text-primary" style={{ fontFamily: 'var(--font-mono)' }}>
                      {settings.currency}{service.price.toLocaleString()}
                    </p>
                    {isSelected ? (
                      <div className="flex items-center gap-1.5 bg-muted/80 rounded-full p-1 border border-border/50">
                        <button
                          onClick={() => updateQuantity(service.id, (selectedItem?.quantity || 1) - 1)}
                          className="w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold bg-card hover:bg-destructive/10 hover:text-destructive transition-colors border border-border/30"
                          aria-label={`Decrease quantity of ${service.name}`}
                        >
                          −
                        </button>
                        <span className="w-7 text-center text-sm font-semibold tabular-nums">{selectedItem?.quantity}</span>
                        <button
                          onClick={() => updateQuantity(service.id, (selectedItem?.quantity || 0) + 1)}
                          className="w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold bg-card hover:bg-primary/10 hover:text-primary transition-colors border border-border/30"
                          aria-label={`Increase quantity of ${service.name}`}
                        >
                          +
                        </button>
                      </div>
                    ) : (
                      <motion.button
                        onClick={() => addService(service)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-4 py-1.5 bg-primary text-primary-foreground text-xs rounded-full hover:opacity-90 font-semibold shadow-sm"
                      >
                        Add
                      </motion.button>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* ═══ Bottom Section — 2 Columns ═══ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 lg:gap-8">

        {/* Customer Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="rounded-[var(--radius-lg)] shadow-lg p-5 md:p-8 bg-card text-card-foreground border border-border/40"
        >
          <h2 className="text-lg md:text-xl mb-5 flex items-center gap-3" style={{ fontFamily: 'var(--font-display)' }}>
            <span className="w-8 h-8 rounded-lg flex items-center justify-center bg-primary/10 text-base border border-primary/15">👤</span>
            Customer Info
            <span className="text-xs font-normal text-muted-foreground ml-auto font-sans">(Optional)</span>
          </h2>
          <div className="space-y-4">
            <div>
              <label htmlFor="customer-name" className="block text-xs font-semibold mb-1.5 text-muted-foreground uppercase tracking-wider">Name</label>
              <input
                id="customer-name"
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full px-4 py-3 bg-input border border-border rounded-xl focus:ring-2 focus:ring-ring focus:border-transparent text-sm placeholder:text-muted-foreground"
                placeholder="Walk-in Customer"
              />
            </div>
            <div>
              <label htmlFor="customer-phone" className="block text-xs font-semibold mb-1.5 text-muted-foreground uppercase tracking-wider">Phone</label>
              <input
                id="customer-phone"
                type="tel"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                className="w-full px-4 py-3 bg-input border border-border rounded-xl focus:ring-2 focus:ring-ring focus:border-transparent text-sm placeholder:text-muted-foreground"
                placeholder="03xx xxxxxxx"
              />
            </div>
            <div>
              <label htmlFor="customer-email" className="block text-xs font-semibold mb-1.5 text-muted-foreground uppercase tracking-wider">Email</label>
              <input
                id="customer-email"
                type="email"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                className="w-full px-4 py-3 bg-input border border-border rounded-xl focus:ring-2 focus:ring-ring focus:border-transparent text-sm placeholder:text-muted-foreground"
                placeholder="email@example.com"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="event-date" className="block text-xs font-semibold mb-1.5 text-muted-foreground uppercase tracking-wider">Event Date</label>
                <input
                  id="event-date"
                  type="date"
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                  min={today}
                  className="w-full px-4 py-3 bg-input border border-border rounded-xl focus:ring-2 focus:ring-ring focus:border-transparent text-sm"
                />
              </div>
              <div>
                <label htmlFor="event-type" className="block text-xs font-semibold mb-1.5 text-muted-foreground uppercase tracking-wider">Event Type</label>
                <select
                  id="event-type"
                  value={eventType}
                  onChange={(e) => setEventType(e.target.value)}
                  className="w-full px-4 py-3 bg-input border border-border rounded-xl focus:ring-2 focus:ring-ring focus:border-transparent text-sm"
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
        </motion.div>

        {/* Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="rounded-[var(--radius-lg)] shadow-lg p-5 md:p-8 bg-card text-card-foreground flex flex-col h-full border border-border/40"
        >
          <h2 className="text-lg md:text-xl mb-5 flex items-center gap-3" style={{ fontFamily: 'var(--font-display)' }}>
            <span className="w-8 h-8 rounded-lg flex items-center justify-center bg-primary/10 text-base border border-primary/15">💰</span>
            Summary
          </h2>

          {/* Selected Items */}
          <div className="flex-1 mb-5 min-h-[120px] max-h-[320px] overflow-y-auto pr-1">
            {selectedItems.length > 0 ? (
              <div className="space-y-2">
                <AnimatePresence>
                  {selectedItems.map((item) => (
                    <motion.div
                      key={item.serviceId}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10, height: 0, marginBottom: 0 }}
                      transition={{ duration: 0.25 }}
                      className="flex items-center justify-between rounded-xl p-3.5 bg-muted/60 border border-border/30 group hover:bg-muted/80 transition-colors"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm truncate">{item.serviceName}</p>
                        <p className="text-xs text-muted-foreground" style={{ fontFamily: 'var(--font-mono)' }}>
                          {settings.currency}{item.price.toLocaleString()} × {item.quantity} = {settings.currency}{item.total.toLocaleString()}
                        </p>
                      </div>
                      <button
                        onClick={() => removeItem(item.serviceId)}
                        className="p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg ml-2 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-all"
                        aria-label={`Remove ${item.serviceName}`}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-muted-foreground/70 text-sm border-2 border-dashed border-border/60 rounded-xl p-6">
                <svg className="w-10 h-10 mb-3 text-muted-foreground/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                <p className="font-medium">No services selected</p>
                <p className="text-xs mt-1">Select services above to build your quote</p>
              </div>
            )}
          </div>

          {/* Notes */}
          <div className="mb-5">
            <label htmlFor="receipt-notes" className="block text-xs font-semibold mb-1.5 text-muted-foreground uppercase tracking-wider">Notes</label>
            <textarea
              id="receipt-notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              className="w-full px-4 py-3 bg-input border border-border rounded-xl focus:ring-2 focus:ring-ring focus:border-transparent text-sm placeholder:text-muted-foreground resize-none"
              placeholder="Additional notes or special requests..."
            />
          </div>

          {/* Total */}
          <div className="rounded-xl p-5 mb-5 bg-gradient-to-r from-primary/8 to-accent/40 border border-primary/10">
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold">Estimated Total</span>
              <span className="text-2xl sm:text-3xl font-bold text-primary" style={{ fontFamily: 'var(--font-mono)' }}>
                {settings.currency}{total.toLocaleString()}
              </span>
            </div>
            {settings.taxRate > 0 && (
              <p className="text-xs text-muted-foreground mt-1.5">
                + {settings.taxRate}% tax applied at checkout
              </p>
            )}
          </div>

          {/* Send WhatsApp */}
          <motion.button
            onClick={handleSendWhatsApp}
            disabled={selectedItems.length === 0}
            className="btn-uiverse w-full flex items-center justify-center gap-2.5 text-base disabled:opacity-45 disabled:cursor-not-allowed"
            whileHover={selectedItems.length > 0 ? { scale: 1.02, y: -2 } : {}}
            whileTap={selectedItems.length > 0 ? { scale: 0.98 } : {}}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            Send Receipt on WhatsApp
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}
