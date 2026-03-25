
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { User } from '@supabase/supabase-js';
import { Service, Receipt, BusinessSettings } from '../types';
import { defaultServices, defaultBusinessSettings } from '../data/defaultData';

export function useSupabaseAuth() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUser(session?.user ?? null);
            setLoading(false);
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
            setLoading(false);
        });

        return () => subscription.unsubscribe();
    }, []);

    const login = async (email: string, password: string) => {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
    };

    const logout = async () => {
        await supabase.auth.signOut();
    };

    return { user, loading, login, logout };
}

export function useSupabaseServices() {
    const [services, setServices] = useState<Service[]>(defaultServices);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchServices();

        const channel = supabase
            .channel('services_changes')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'services' }, () => {
                fetchServices();
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    const fetchServices = async () => {
        const { data, error } = await supabase
            .from('services')
            .select('*')
            .order('created_at', { ascending: true });

        if (error) {
            console.error('Error fetching services:', error);
        } else if (data) {
            // Always set services, even if empty array, to avoid showing stale default data
            setServices(data as Service[]);
        }
        setLoading(false);
    };

    const addService = async (service: Service) => {
        const { error } = await supabase.from('services').insert([service]).select();
        if (error) {
            console.error('Error adding service:', error);
            throw error;
        }
    };

    const updateService = async (service: Service) => {
        const { error } = await supabase
            .from('services')
            .update(service)
            .eq('id', service.id)
            .select();
        if (error) {
            console.error('Error updating service:', error);
            throw error;
        }
    };

    const deleteService = async (id: string) => {
        const { error } = await supabase.from('services').delete().eq('id', id);
        if (error) {
            console.error('Error deleting service:', error);
            throw error;
        }
    };

    return { services, loading, addService, updateService, deleteService };
}

export function useSupabaseReceipts() {
    const [receipts, setReceipts] = useState<Receipt[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchReceipts();

        const channel = supabase
            .channel('receipts_changes')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'receipts' }, () => {
                fetchReceipts();
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    const fetchReceipts = async () => {
        const { data, error } = await supabase
            .from('receipts')
            .select('*')
            .order('created_at', { ascending: true });

        if (error) {
            console.error('Error fetching receipts:', error);
        } else if (data) {
            setReceipts(data as Receipt[]);
        }
        setLoading(false);
    };

    const addReceipt = async (receipt: Receipt) => {
        const { error } = await supabase.from('receipts').insert([receipt]).select();
        if (error) {
            console.error('Error adding receipt:', error);
            throw error;
        }
    };

    const updateReceipt = async (receipt: Receipt) => {
        const { error } = await supabase
            .from('receipts')
            .update(receipt)
            .eq('id', receipt.id)
            .select();
        if (error) {
            console.error('Error updating receipt:', error);
            throw error;
        }
    };

    const deleteReceipt = async (id: string) => {
        const { error } = await supabase.from('receipts').delete().eq('id', id);
        if (error) {
            console.error('Error deleting receipt:', error);
            throw error;
        }
    };

    return { receipts, loading, addReceipt, updateReceipt, deleteReceipt };
}

export function useSupabaseSettings() {
    const [settings, setSettings] = useState<BusinessSettings>(defaultBusinessSettings);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchSettings();

        const channel = supabase
            .channel('settings_changes')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'settings' }, () => {
                fetchSettings();
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    const fetchSettings = async () => {
        const { data, error } = await supabase
            .from('settings')
            .select('*')
            .eq('id', 'default_settings')
            .single();

        if (error) {
            // If no settings found, try to insert default
            if (error.code === 'PGRST116') {
                // Row not found
                await supabase.from('settings').insert([{ ...defaultBusinessSettings, id: 'default_settings' }]);
                // Fetch again? or just use default
            } else {
                console.error('Error fetching settings:', error);
            }
        } else if (data) {
            const { id, created_at, ...rest } = data;
            // Merge with defaults, ensuring no null values override defaults (or are left as null)
            const cleanedRest = Object.fromEntries(
                Object.entries(rest).filter(([_, v]) => v !== null)
            );

            setSettings({
                ...defaultBusinessSettings,
                ...cleanedRest
            } as BusinessSettings);
        }
        setLoading(false);
    };

    const updateSettings = async (newSettings: BusinessSettings) => {
        // Ensure id is set for the update query
        const settingsToUpdate = { ...newSettings, id: 'default_settings' };

        const { error } = await supabase
            .from('settings')
            .update(settingsToUpdate)
            .eq('id', 'default_settings')
            .select();

        if (error) {
            console.error('Settings update error:', error);
            throw error;
        }
        // Optimistic update
        setSettings(newSettings);
    };

    return { settings, loading, updateSettings };
}
