# Family Feud Next.js Project

## Quick Start

1. Install dependencies:
   ```sh
   npm install
   ```
2. Add your Supabase credentials to `.env.local`:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://twreuzlomwyaadtalkzb.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR3cmV1emxvbXd5YWFkdGFsa3piIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI1NzY2NTUsImV4cCI6MjA2ODE1MjY1NX0.p1zF7O8AxMmWRgyPd1G9puMsUr1xJDvEVEIOOjVQTxM
   ```
3. Start the dev server:
   ```sh
   npm run dev
   ```

## Common Fix

Reset everything and start fresh:

```sh

DONT FORGET TO CTRL S
rm -rf node_modules package-lock.json .next && npm install && npm run dev
```

- Removes cache, lockfile, and modules
- Installs dependencies
- Starts Next.js

## Tech Stack

- Next.js
- Tailwind CSS v3
- Supabase
- PostCSS (see `postcss.config.mjs`)

## Git

Commit and push:

```sh
git add . && git commit -m "setup" && git push origin main
```

---

For more, see official docs:

- [Next.js](https://nextjs.org/docs)
- [Tailwind CSS v3](https://tailwindcss.com/docs/installation)
- [Supabase](https://supabase.com/docs)
- [PostCSS](https://postcss.org/)
