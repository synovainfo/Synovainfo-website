# Synova Laravel — Live Preview (run doc)

Serves the **Laravel public site** (day/dark themed corporate pages, premium GSAP
homepage) for live preview against the **real MySQL database** (`synova_db`).

> **History:** a previous version of this doc forced a SQLite mirror because the
> snake_case Eloquent models couldn't query the Prisma/camelCase MySQL schema
> (the site 500'd). That drift is **fixed** — every model now uses the
> `HasCamelCaseColumns` trait (`app/Models/Concerns/HasCamelCaseColumns.php`),
> so the app reads/writes the camelCase columns (`createdAt`, `authorId`,
> `deletedAt`, …) natively. Serve against MySQL; no mirror needed.

## 1. Reproduce the uncommitted artifacts

A fresh checkout needs these steps (all run from the repo root):

1. **Install PHP dependencies** (if `laravel/vendor` is missing):

   ```bash
   cd laravel && composer install
   ```

2. **Build frontend assets** (if `laravel/public/build` is missing):

   ```bash
   cd laravel && npm install && npm run build
   ```

   This compiles `resources/css/app.css` (day/dark theme system + semantic
   tokens) and `resources/js/app.js` (Alpine theme toggle) into
   `laravel/public/build/assets/`.

3. **`.env`** — keep the existing file; it points `DB_*` at the remote MySQL
   (`118.139.178.77/synova_db`). The Prisma-generated tables + camelCase columns
   are the source of truth; Laravel migrations are marked as already-run.

## 2. Run the server

```bash
cd laravel
php artisan serve --host=127.0.0.1 --port=8000
```

- **Port 8000** is the Laravel default. If it's taken, pick another free port
  and set `APP_URL`/`APP_PORT` to match.
- The homepage (`/`) and all public routes render against MySQL.
- Routes: `/`, `/about`, `/approach`, `/architecture`, `/services`,
  `/industries`, `/technologies`, `/solutions`, `/portfolio`, `/case-studies`,
  `/blog`, `/careers`, `/contact`, `/sitemap.xml`.
- **Admin** (`/admin`) is also live: login `admin@synovainfo.com` /
  `password123`. All 25 modules return 200.
- **Theme toggle** — the sun/moon control in the header; persists to
  localStorage with a FOUC-safe bootstrap script in the layout.
- **Mobile menu** — hamburger in the header opens the full-screen nav dialog.

## 3. Notes

- The `HasCamelCaseColumns` trait maps snake_case attribute names (used by
  views/controllers) to camelCase DB columns; `SoftDeletes` models declare
  `protected const DELETED_AT = 'deletedAt';`. Do not rename DB columns to
  snake_case.
- Debug mode is on (`APP_DEBUG=true`), so errors surface in the browser while
  iterating.
