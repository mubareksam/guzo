# Deploying Guzo for free (Neon + Vercel)

Total cost: **0 birr**. No map or routing API keys are needed — Guzo uses OpenStreetMap tiles, OSRM routing and Nominatim search, all free.

The app creates its database tables and loads the Addis Ababa network automatically on first start, so you only need a database URL.

---

## 1. Push the code to GitHub

1. Go to <https://github.com/new>, name it `guzo`, keep it **empty** (no README / .gitignore / license), click **Create repository**.
2. On your computer:

```bash
git clone <this project folder or download the zip>   # if you don't have it locally yet
cd guzo
git remote add origin https://github.com/<your-username>/guzo.git
git branch -M main
git push -u origin main
```

When git asks for a password, use a **Personal Access Token** (GitHub → Settings → Developer settings → Personal access tokens → *Fine-grained* → give it access to the `guzo` repo with *Contents: Read and write*).

## 2. Create the free database (Neon)

1. Sign up at <https://neon.tech> (GitHub login works).
2. **Create project** → name `guzo` → region closest to Ethiopia (e.g. *AWS Europe (Frankfurt)*).
3. On the dashboard click **Connect**, choose **Pooled connection**, copy the string. It looks like:

```
postgresql://neondb_owner:xxxx@ep-xxxx-pooler.eu-central-1.aws.neon.tech/neondb?sslmode=require
```

## 3. Deploy the app (Vercel)

1. Sign up at <https://vercel.com> with GitHub (Hobby plan = free).
2. **Add New… → Project** → import the `guzo` repository.
3. Framework is detected as **Next.js** — leave build settings as they are.
4. Open **Environment Variables** and add:

| Name | Value |
| --- | --- |
| `DATABASE_URL` | the Neon pooled connection string |

5. Click **Deploy**. After ~1–2 minutes you get a URL like `https://guzo.vercel.app`.
6. Open `https://<your-url>/api/health` once — it should return `{"ok":true}`. This creates the tables and loads all stations and lines.

Done. Log in with `demo@guzo.et` / `guzo1234`, or the moderator `admin@guzo.et` / `guzo1234`.

> **Change the demo passwords** before sharing the site publicly (log in, or update the `users` table in the Neon SQL editor).

## 4. Updating the site later

Every `git push` to `main` redeploys automatically on Vercel.

If you change `src/db/schema.ts`, regenerate the boot SQL:

```bash
npx drizzle-kit export --config=drizzle.config.json > /tmp/schema.sql
# then update src/db/bootstrap-sql.ts (or run `npx drizzle-kit push` against the Neon URL)
```

If you change the station / line data in `src/db/data/*.ts`, bump `SEED_VERSION` in `src/db/seed.ts` — the network reloads on the next start (users, reports history and contributions are kept).

## 5. Optional extras

- **Custom domain**: Vercel → Project → Settings → Domains (e.g. `guzo.et` once you own it).
- **Install as a phone app**: open the site on Android/iPhone → browser menu → *Add to Home screen*.
- **Alternative free hosts**: Render (web service, free tier sleeps when idle) or Netlify, both with the same Neon database.

## Free-tier notes

- Neon free: 0.5 GB storage, auto-suspends when idle (first request after a pause takes ~1 s).
- Vercel Hobby: personal / non-commercial use, generous bandwidth.
- OpenStreetMap tile and Nominatim servers are community-run; for heavy traffic, switch to a free-tier key from MapTiler or Stadia later (only `src/app/components/MapView.tsx` needs a URL change).
