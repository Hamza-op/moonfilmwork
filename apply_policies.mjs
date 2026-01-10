import dotenv from 'dotenv';
dotenv.config();

const PROJECT_REF = process.env.SUPABASE_PROJECT_REF;
const ACCESS_TOKEN = process.env.SUPABASE_ACCESS_TOKEN;

if (!PROJECT_REF || !ACCESS_TOKEN) {
  console.error('Missing required environment variables: SUPABASE_PROJECT_REF, SUPABASE_ACCESS_TOKEN');
  process.exit(1);
}

const sql = `
-- Services Policies
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admin Manage Services') THEN
        CREATE POLICY "Admin Manage Services" ON public.services FOR ALL TO authenticated USING (true) WITH CHECK (true);
    END IF;
END $$;

-- Receipts Policies
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admin Manage Receipts') THEN
        CREATE POLICY "Admin Manage Receipts" ON public.receipts FOR ALL TO authenticated USING (true) WITH CHECK (true);
    END IF;
END $$;

-- Settings Policies
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admin Manage Settings') THEN
        CREATE POLICY "Admin Manage Settings" ON public.settings FOR ALL TO authenticated USING (true) WITH CHECK (true);
    END IF;
END $$;
`;

async function runSql() {
    console.log('Applying RLS policies...');
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
        console.error('❌ Failed:', response.status, text);
        return;
    }

    const result = await response.json();
    console.log('✅ Policies applied successfully:', result);
}

runSql();
