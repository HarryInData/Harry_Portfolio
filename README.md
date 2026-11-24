# HariOS — macOS portfolio

Personal desktop-style site for **Hari Kishan Singh**.

- Desktop: About, Projects, Skills, Certificates, Resume, Photos, Music, Safari, Mail, Terminal
- Admin (`/admin`): attach resume (PDF), gallery images, favourite tracks, and edit projects / skills / certs / profile

Data is stored in `data/content.json`. Uploads go to `public/uploads/`.

## Run locally

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Admin: [http://localhost:3000/admin](http://localhost:3000/admin).

Set a unique `ADMIN_PASSWORD` in `.env.local` and restart before signing in. Admin sign-in is disabled when the variable is empty. Use HTTPS in production.

The desktop opens on a generated Big Sur-inspired blue-hour wallpaper. Use the play control in the menu bar to switch to the supplied animated wallpaper; the eight-item dock uses custom macOS-style icons.

## Notes

File uploads work on a server with a writable disk. On serverless hosts (Vercel) use object storage or keep the JSON + files in git after you add them locally.

The earlier static portfolio is preserved in `portfolio/` in the GitHub repository; the HariOS app lives at the repository root.
