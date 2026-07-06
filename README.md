# Murmur — Frontend

React + TypeScript + Vite UI for **Murmur**, a Character.AI-style chat app.

Companion backend: [murmur](https://github.com/valtykhoniuk/murmur) (separate repo).

**Live app:** https://murmur-web-tawny.vercel.app

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
- CSS (ATLITUDE-inspired palette, Google Sans Flex)

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

## Deploy (Vercel)

1. Connect this repo on [Vercel](https://vercel.com).
2. Framework preset: **Vite** (auto-detected).
3. Build command: `npm run build`
4. Output directory: `dist`
5. **Production API (Vercel proxy — required because EB is HTTP-only):**

| Key | Value |
|-----|--------|
| `VITE_API_URL` | `/api` |

Do **not** set `VITE_API_URL` to the raw `http://...elasticbeanstalk.com` URL — browsers block HTTPS → HTTP requests.

`vercel.json` proxies `/api/*` → Elastic Beanstalk server-side.

6. On the **backend** (AWS EB), set `CORS_ORIGINS` (optional when using proxy; still useful for `/docs`):

```bash
http://localhost:5173,https://murmur-web-tawny.vercel.app
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
