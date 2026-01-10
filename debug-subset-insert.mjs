import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

// Supabase credentials (Anon key)
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing required environment variables: VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testInsert() {
    console.log('Attempting to insert receipt WITHOUT extra columns...');

    const receipt = {
        id: Date.now().toString(),
        receiptNumber: 'TEST002',
        customerName: 'Walk-in Customer',
        customerPhone: '',
        customerEmail: '',
        eventType: 'Wedding',
        eventDate: '2024-01-01',
        items: [],
        // Removed amountPaid and advancePayment
        total: 100,
        subtotal: 100,
        balanceDue: 100,
        discount: 0,
        tax: 0,
        discountType: 'fixed',
        notes: 'Test note without extra cols',
        status: 'pending',
    };

    const { data, error } = await supabase
        .from('receipts')
        .insert([receipt]);

    if (error) {
        console.error('❌ Insert failed:', error);
    } else {
        console.log('✅ Insert successful!');
    }
}

testInsert();
