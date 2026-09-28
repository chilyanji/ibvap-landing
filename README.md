# IBVAP Landing Page

A responsive, theme-aware landing page for the **Intelligent Border Video Analytics Platform (IBVAP)**.

## Stack

- React 18
- TypeScript
- Vite
- Lucide React icons
- Pure CSS design system
- Persistent dark/light theme using `localStorage`

## Run locally

### 1. Install Node.js

Use Node.js 20 LTS or newer.

Check:

```bash
node -v
npm -v
```

### 2. Install dependencies

From the project folder:

```bash
npm install
```

### 3. Start development server

```bash
npm run dev
```

Open the URL shown by Vite, normally:

```text
http://localhost:5173
```

## Production build

```bash
npm run build
```

The final static output is generated in:

```text
dist/
```

Preview the production build locally:

```bash
npm run preview
```

---

# Deployment Option 1 — Vercel (recommended)

## A. Push the project to GitHub

```bash
git init
git add .
git commit -m "Add IBVAP landing page"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPOSITORY.git
git push -u origin main
```

## B. Deploy on Vercel

1. Sign in to Vercel.
2. Select **Add New → Project**.
3. Import your GitHub repository.
4. Vercel should automatically detect **Vite**.
5. Confirm:
   - Framework Preset: `Vite`
   - Build Command: `npm run build`
   - Output Directory: `dist`
6. Click **Deploy**.

Every future push to `main` will automatically trigger a new production deployment.

## C. Custom domain

Inside the Vercel project:

1. Open **Settings → Domains**.
2. Add your domain.
3. Update the DNS records at your domain registrar using the values shown by Vercel.
4. HTTPS will be provisioned automatically.

---

# Deployment Option 2 — Netlify

1. Push the project to GitHub.
2. Sign in to Netlify.
3. Select **Add new site → Import an existing project**.
4. Choose the repository.
5. Use:
   - Build command: `npm run build`
   - Publish directory: `dist`
6. Deploy.

---

# Deployment Option 3 — Static Linux/Nginx server

Build the site:

```bash
npm install
npm run build
```

Copy `dist/` to the server:

```bash
scp -r dist/* user@SERVER_IP:/var/www/ibvap/
```

Example Nginx configuration:

```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;

    root /var/www/ibvap;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

Enable the configuration, reload Nginx, and add HTTPS using Certbot.

---

# Integration with the existing IBVAP dashboard

There are two common approaches.

## Option A — Landing page and dashboard in the same React app

Use React Router:

- `/` → public landing page
- `/login` → authentication
- `/dashboard` → authenticated command dashboard
- `/admin` → administrator area

This is best if the landing page and dashboard share the same repository.

## Option B — Separate landing and dashboard deployments

Example:

```text
https://ibvap.example.com          → landing page
https://app.ibvap.example.com      → secure dashboard
https://api.ibvap.example.com      → FastAPI backend
```

This separation is cleaner when the public site and operational dashboard have different security/deployment requirements.

---

# Backend/API deployment notes

The landing page itself does not require the backend.

For the actual IBVAP application:

- Keep PostgreSQL and Redis on protected infrastructure.
- Do not expose Redis directly to the internet.
- Put FastAPI behind HTTPS/reverse proxy or a managed deployment platform.
- Configure CORS only for trusted frontend domains.
- Store secrets and database URLs in environment variables.
- Use authentication tokens/cookies securely.
- Restrict dashboard routes to authenticated users.
- Keep camera credentials and internal device addresses out of frontend code.

Example Vite environment variable:

```bash
VITE_API_BASE_URL=https://api.example.com
```

Access it in the frontend:

```ts
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
```

For local development create:

```text
.env.local
```

Example:

```text
VITE_API_BASE_URL=http://127.0.0.1:8000
```

Do **not** commit secret values to GitHub.

---

# Recommended production topology

```text
Public Users
     │
     ▼
Landing Page / Vercel
     │
     ├── Public project information
     └── Login / Dashboard link
              │
              ▼
       Secure React Dashboard
              │ HTTPS
              ▼
           FastAPI
          /   |    \
         /    |     \
PostgreSQL  Redis   Edge AI Workers
                       │
                       ▼
               CCTV / Camera Sources
```

## Recommended domain layout

```text
www.example.com       → landing page
app.example.com       → authenticated dashboard
api.example.com       → backend API
```

This structure makes the public marketing surface, operational application and backend security boundaries easier to manage.


---

# Instant no-build preview

A dependency-free version is also included:

```text
standalone.html
```

You can double-click it in Windows and it will open directly in the browser.

To deploy only this static version, rename it to `index.html` and upload it to any static host, GitHub Pages, Netlify, Vercel, Nginx, Apache, or standard web hosting.
