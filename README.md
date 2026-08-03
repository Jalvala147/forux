# Forux

Foro Next.js + Supabase Auth + Postgres. Invitados leen; usuarios autenticados publican y responden.

## Stack

- Next.js 15 en Vercel
- Supabase Auth (email/password)
- Supabase Postgres + Prisma
- Guest = solo lectura

## Setup

1. Crea proyecto en Supabase
2. Ejecuta **todo** el archivo `supabase/schema.sql` en SQL Editor
3. Configura Auth (ver checklist abajo / README)
4. Copia `.env.example` → `.env` con tus keys y connection strings
5. `npm install && npx prisma generate && npm run dev`

> Las tablas se crean con `supabase/schema.sql` (incluye trigger de perfil y RLS). No hace falta `prisma migrate` contra Supabase; Prisma solo genera el client.

## Deploy Vercel

Mismas variables que `.env.example` en Project Settings → Environment Variables.

## Roles

| Modo | Leer | Crear hilo | Responder |
|------|------|------------|-----------|
| Invitado | Sí | No | No |
| Logueado | Sí | Sí | Sí |
