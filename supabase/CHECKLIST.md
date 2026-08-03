# Checklist Supabase (Forux)

## 1. Proyecto
- Crear proyecto en https://supabase.com (plan Free)

## 2. SQL
- Abrir **SQL Editor**
- Pegar y ejecutar todo el contenido de `supabase/schema.sql`

## 3. Auth
- **Authentication → Providers → Email**: enabled
- **Authentication → Settings**:
  - Desactivar **Confirm email** (más fácil para pruebas) *o* dejarlo y revisar correo
  - **Site URL**: `http://localhost:3000` (local) y luego `https://TU_APP.vercel.app`
  - **Redirect URLs**: añadir `http://localhost:3000/**` y `https://TU_APP.vercel.app/**`

## 4. Keys (Settings → API)
- `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
- `anon public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## 5. Database URLs (Settings → Database → Connection string)
- **Transaction pooler** (puerto 6543) → `DATABASE_URL` (añade `?pgbouncer=true`)
- **Session / Direct** (puerto 5432) → `DIRECT_URL`
- Sustituye la password de la base de datos

## 6. Vercel
Añadir las 4 variables:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `DATABASE_URL`
- `DIRECT_URL`
