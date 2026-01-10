
import dotenv from 'dotenv';
dotenv.config();

// Use built-in fetch
const PROJECT_REF = process.env.SUPABASE_PROJECT_REF;
const ACCESS_TOKEN = process.env.SUPABASE_ACCESS_TOKEN;

if (!PROJECT_REF || !ACCESS_TOKEN) {
  console.error('Missing required environment variables: SUPABASE_PROJECT_REF, SUPABASE_ACCESS_TOKEN');
  process.exit(1);
}

const sql = `
ALTER TABLE public.receipts ADD COLUMN IF NOT EXISTS "amountPaid" numeric default 0;
ALTER TABLE public.receipts ADD COLUMN IF NOT EXISTS "advancePayment" numeric default 0;
ALTER TABLE public.settings ADD COLUMN IF NOT EXISTS "themePreference" text default 'default';
ALTER TABLE public.settings ADD COLUMN IF NOT EXISTS "darkMode" boolean default false;
`;

async function runSql() {
    console.log('Executing SQL update...');
    const response = await fetch(`https://api.supabase.com/v1/projects/${PROJECT_REF}/database/query`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${ACCESS_TOKEN}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ query: sql })
    });

    if (!response.ok) {
        const text = await response.text();
        console.error('❌ SQL Execution Failed:', response.status, text);
        return;
    }

    const result = await response.json();
    console.log('✅ SQL Update Success:', result);
}

runSql();
