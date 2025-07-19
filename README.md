This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Quick Setup

To fully reset your environment and install all dependencies, run the following command in your terminal:

```sh
rm -rf node_modules package-lock.json .next && npm install && npm run dev
```

### What this does:

- Removes all installed packages, lockfile, and Next.js build cache
- Installs all dependencies as specified in `package.json`
- Starts the Next.js development server

### Additional setup

1. Make sure your `.env.local` file contains your Supabase credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://twreuzlomwyaadtalkzb.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR3cmV1emxvbXd5YWFkdGFsa3piIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI1NzY2NTUsImV4cCI6MjA2ODE1MjY1NX0.p1zF7O8AxMmWRgyPd1G9puMsUr1xJDvEVEIOOjVQTxM
   ```
2. If you need to push changes to git:
   ```sh
   git add . && git commit -m "Setup and credentials" && git push origin main
   ```

---

This single command will resolve most environment, dependency, and cache issues for this project.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
