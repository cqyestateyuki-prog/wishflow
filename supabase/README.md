# Supabase Setup (Wishflow)

## 1. Create project
- Create a new Supabase project.
- Copy the project URL and anon key into `.env.local`.

## 2. Auth providers
Enable:
- Email + Password
- Google OAuth

For Google OAuth, set the redirect URL to:
- `http://localhost:3000/overview` (local)
- `https://your-domain.com/overview` (production)

## 3. Database schema
Run the SQL in `supabase/schema.sql` in the Supabase SQL editor.

## 4. Environment variables
Create `.env.local` from `.env.local.example`:

```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

## 5. Run app
```
npm install
npm run dev
```
