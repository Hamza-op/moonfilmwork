import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing required environment variables: VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testInsertService() {
    console.log('Attempting to insert service...');

    const service = {
        id: 'test-' + Date.now(),
        name: 'Test Service',
        category: 'photography',
        price: 100,
        description: 'Test description',
        isActive: true
    };

    const { data, error } = await supabase
        .from('services')
        .insert([service])
        .select();

    if (error) {
        console.error('❌ Insert failed:', JSON.stringify(error, null, 2));
    } else {
        console.log('✅ Insert successful:', JSON.stringify(data, null, 2));
    }
}

testInsertService();
