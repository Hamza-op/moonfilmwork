# Backup And Recovery Runbook

This project stores business data in Supabase (`services`, `receipts`, `settings`).  
GitHub Pages only serves frontend assets; data durability depends on Supabase backups.

## Backup Policy

1. Keep Supabase project backups enabled.
2. Export critical tables weekly:
   - `public.services`
   - `public.receipts`
   - `public.settings`
3. Store exports in two locations:
   - local encrypted archive
   - cloud storage bucket with versioning
4. Keep at least 30 days of backup history.

## Weekly Backup Steps

1. Open Supabase dashboard for the production project.
2. Export data for the tables above (CSV or SQL dump).
3. Name files with UTC date, for example:
   - `moonfilmwork-services-2026-03-26.csv`
4. Upload to backup storage.
5. Record backup completion in your ops log.

## Recovery Drill (Monthly)

1. Create a temporary Supabase project for testing recovery.
2. Import the latest backup files.
3. Validate:
   - services list loads
   - receipt history renders
   - settings values are intact
4. Document any import errors and fix the runbook.

## Production Recovery (If Data Is Lost)

1. Freeze admin writes (communicate maintenance window).
2. Restore from latest known-good backup.
3. Verify row counts for `services`, `receipts`, `settings`.
4. Run manual smoke checks on the website:
   - create quote
   - submit WhatsApp quote
   - view receipts in admin
5. Announce service restored.

## RPO / RTO Targets

- Target RPO: <= 24 hours
- Target RTO: <= 2 hours

## Ownership

- Primary owner: project maintainer
- Backup reviewer: secondary team member (if available)
