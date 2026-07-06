# Murmur — Frontend

React + TypeScript + Vite UI for **Murmur**, a Character.AI-style chat app.

Companion backend: [murmur](../murmur) (separate repo).

## Features

- Landing page with owner login, friend login, and one-click **demo** mode
- Character list with **avatars**, edit, delete, and start chat
- Chat list with **preview**, chat ID, message count, and delete
- Live chat with character avatar, settings link, image URL rendering in messages
- Per-chat customization (temperature, reply length, speech style, memory window)
- Demo banner + send blocking when the 20-message limit is hit

## Stack

- React 19, TypeScript, Vite 8
- React Router 7
- CSS (glassmorphism theme, no UI framework)

## Quick start (local)

### 1. Backend running

Start the API on port 8000 (see murmur README).

### 2. Install & dev server

```bash
npm install
npm run dev
```

Open `http://localhost:5173`.

Vite proxies `/api/*` → `http://localhost:8000/*` (see `vite.config.ts`), so no extra env is needed locally.

### 3. Try demo

From the home page, click **Try demo** — auto-logs in as the public demo user (20 messages total).

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Dev server with hot reload |
| `npm run build` | Production build → `dist/` |
| `npm run preview` | Preview production build locally |
| `npm run lint` | ESLint |

## Environment (production)

Create `.env.production` (or set in your host):

```bash
VITE_API_URL=https://your-api.example.com
```

If unset, the app falls back to `/api` (same-origin). Use a reverse proxy or CDN rule to forward `/api` to the backend, **or** set `VITE_API_URL` to the full backend URL.

## Deploy notes

### Static hosting (Vercel, Netlify, Cloudflare Pages)

1. Connect this repo.
2. Build command: `npm run build`
3. Output directory: `dist`
4. Set `VITE_API_URL` to your deployed FastAPI URL.
5. Ensure backend CORS allows your frontend origin.

### Same-origin (nginx)

Serve `dist/` and proxy `/api` to uvicorn — then `VITE_API_URL` can stay unset.

Example nginx snippet:

```nginx
location /api/ {
    proxy_pass http://127.0.0.1:8000/;
}
location / {
    root /var/www/murmur-web/dist;
    try_files $uri /index.html;
}
```

## Routes

| Path | Page |
|------|------|
| `/` | Landing / entry |
| `/auth` | Login |
| `/characters` | Character list |
| `/characters/new` | Create character |
| `/characters/:id/edit` | Edit character |
| `/chats` | Chat list |
| `/chat/:id` | Chat room |
| `/chat/:id/settings` | Chat customization |

## License

Personal portfolio project.
