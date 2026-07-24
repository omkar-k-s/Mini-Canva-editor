# Mini Canva Editor 🎨

> A production-ready, high-performance browser-based design editor.

[![CI](https://github.com/omkar-k-s/Mini-Canva-editor/actions/workflows/ci.yml/badge.svg)](https://github.com/omkar-k-s/Mini-Canva-editor/actions)

---

## 🖼 Project Overview

Mini Canva is a **Canva-inspired design editor** that runs entirely in the browser. It targets **60 FPS performance with 300+ Fabric.js objects** through aggressive memoization, RAF-throttled event handlers, and code splitting.

Users can design:
- 📸 Social Media Posts
- 🎨 Posters
- 📄 Flyers
- 🏆 Certificates
- 📋 Resume Pages
- 💼 Business Cards

---

## 🏗 Architecture

```
mini-canva/
├── client/          # React 19 + Vite + TypeScript SPA
│   └── src/
│       ├── components/  # UI primitives, canvas, panels, toolbar, dialogs
│       ├── hooks/       # useFabric, useKeyboard, useAutoSave, useExport, useSnap
│       ├── store/       # Zustand stores (canvas, auth, project, ui)
│       ├── services/    # Axios API services
│       ├── pages/       # Lazy-loaded route pages
│       ├── types/       # TypeScript interfaces
│       ├── utils/       # Fabric helpers, export utils, debounce/throttle
│       └── constants/   # Templates, fonts, shortcuts, canvas sizes
│
├── server/          # Node.js + Express + MongoDB REST API
│   └── src/
│       ├── controllers/ # auth, project, upload
│       ├── middleware/  # JWT auth, error handler, validation
│       ├── models/      # User, Project Mongoose schemas
│       ├── routes/      # Express route definitions
│       └── utils/       # JWT, response helpers, asyncHandler
│
├── .github/workflows/   # GitHub Actions CI
├── .env.example         # Environment variable template
└── README.md
```

---

## ⚡ Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| React 19 | UI framework |
| TypeScript | Type safety |
| Vite 6 | Build tool with code splitting |
| TailwindCSS 3 | Styling |
| Fabric.js 5 | Canvas rendering engine |
| Zustand 5 | Global state management |
| React Router 7 | Client-side routing |
| Framer Motion 11 | Animations |
| @dnd-kit | Drag-and-drop layers |
| React Color | Color picker |
| jsPDF | PDF export |

### Backend
| Technology | Purpose |
|---|---|
| Node.js + Express 4 | REST API server |
| MongoDB + Mongoose | Database |
| JWT | Authentication |
| Multer | File upload handling |
| Cloudinary | Cloud image storage |
| Express Validator | Input validation |
| Helmet + CORS | Security |

### Deployment
| Service | What |
|---|---|
| Vercel | Frontend (static) + Backend (serverless) |
| MongoDB Atlas | Database (free tier) |
| Cloudinary | Image CDN |
| GitHub Actions | CI pipeline |

---

## 🚀 Installation

### Prerequisites
- Node.js 20+
- npm 10+
- MongoDB Atlas account (free)
- Cloudinary account (free)

### 1. Clone and configure

```bash
git clone https://github.com/omkar-k-s/Mini-Canva-editor.git
cd Mini-Canva-editor
cp .env.example client/.env
cp .env.example server/.env
# Edit both .env files with your credentials
```

### 2. Install and run the client

```bash
cd client
npm install
npm run dev
# → http://localhost:5173
```

### 3. Install and run the server

```bash
cd server
npm install
npm run dev
# → http://localhost:5000
```

---

## 🌐 Vercel Deployment

### Deploy the client

```bash
cd client
vercel deploy --prod
```

### Deploy the server

```bash
cd server
vercel deploy --prod
```

Set these environment variables in the Vercel dashboard for the server:

| Variable | Value |
|---|---|
| `MONGODB_URI` | Your MongoDB Atlas connection string |
| `JWT_SECRET` | A secure random string |
| `CLOUDINARY_CLOUD_NAME` | Your Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Your Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Your Cloudinary API secret |
| `CLIENT_URL` | Your Vercel frontend URL |

Then update `VITE_API_URL` in the client's Vercel environment to point to your server URL.

---

## 📡 API Documentation

### Auth

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/api/auth/register` | Create account | Public |
| POST | `/api/auth/login` | Sign in | Public |
| GET | `/api/auth/profile` | Get current user | 🔒 JWT |
| POST | `/api/auth/logout` | Logout | 🔒 JWT |

### Projects

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/api/projects` | Create project | 🔒 JWT |
| GET | `/api/projects` | List all projects | 🔒 JWT |
| GET | `/api/projects/:id` | Get single project | 🔒 JWT |
| PUT | `/api/projects/:id` | Update project | 🔒 JWT |
| DELETE | `/api/projects/:id` | Delete project | 🔒 JWT |

### Upload

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/api/upload` | Upload image (multipart) | 🔒 JWT |

---

## 🎯 Canvas Features

- ✅ Fabric.js canvas with drag, drop, resize, rotate, move
- ✅ Multi-selection and grouping/ungrouping
- ✅ Zoom (Ctrl+scroll, toolbar buttons)
- ✅ Snap-to-center guidelines
- ✅ Grid toggle
- ✅ Canvas background color
- ✅ All 8 shape types (rect, circle, triangle, ellipse, line, arrow, polygon, star)
- ✅ Text tool (heading, subheading, paragraph) with full formatting
- ✅ Image upload with filters (grayscale, sepia, brightness, flip)
- ✅ Unlimited undo/redo (keyboard + visual history panel)
- ✅ Autosave every 3 seconds to LocalStorage
- ✅ Export as PNG, JPEG, or PDF (up to 3× resolution)
- ✅ 6 built-in templates with real objects
- ✅ Full layer panel — drag-to-reorder, rename, hide, lock, duplicate, delete
- ✅ All keyboard shortcuts

---

## ⚡ Performance Optimizations

| Technique | Where Applied |
|---|---|
| `React.memo` | All panel, toolbar, and card components |
| `useCallback` | All event handlers |
| `useMemo` | Derived data (filtered project list, etc.) |
| Zustand field selectors | Each component subscribes to only what it reads |
| `subscribeWithSelector` middleware | Canvas store — no cascade re-renders |
| RAF throttle | `object:moving`, `object:scaling`, `object:rotating` |
| Debounce (80ms) | All property panel inputs |
| React.lazy + Suspense | All pages + heavy dialogs |
| Vite `manualChunks` | Fabric.js, jsPDF, framer-motion isolated into separate chunks |
| MongoDB projection | Project list endpoint omits canvasData (can be MBs) |
| Canvas `renderOnAddRemove: false` | Batches all render calls |
| `requestRenderAll()` | Queues render, avoids synchronous frame drops |

---

## 🔮 Future Scope

- 🤖 **AI Image Generation** — OpenAI DALL-E or Stable Diffusion integration in the image panel
- 🤖 **AI Design Suggestions** — GPT-powered layout and color palette recommendations
- 🤝 **Real-Time Collaboration** — Multiplayer editing via WebSocket/CRDT (Yjs)
- 📜 **Version History** — Git-like design versioning with named snapshots
- 🔤 **Custom Fonts** — Google Fonts browser + user font upload
- ☁️ **Cloud Sync** — Automatic background sync (not just on save)
- 🔌 **Plugin Marketplace** — Third-party panel extensions via a plugin API

---
