import dotenv from 'dotenv';
dotenv.config();

const PROJECT_REF = process.env.SUPABASE_PROJECT_REF;
const ACCESS_TOKEN = process.env.SUPABASE_ACCESS_TOKEN;

if (!PROJECT_REF || !ACCESS_TOKEN) {
  console.error('Missing required environment variables: SUPABASE_PROJECT_REF, SUPABASE_ACCESS_TOKEN');
  process.exit(1);
}

const sql = `
NOTIFY pgrst, 'reload schema';
`;

async function runSql() {
    console.log('Reloading Schema Cache...');
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
    console.log('✅ Success:', result);
}

runSql();
