# On The Glass — Community Events Calendar

A public events calendar. Anyone can browse approved events. Anyone with an
account can submit one. Only you approve or reject them.

Two free services do the heavy lifting:
- **Supabase** — stores accounts, events, and images
- **Vercel** — hosts the actual website, gives you a live URL

Total setup time: ~20 minutes, no coding. Follow every step in order.

---

## Part 1 — Create the database (Supabase)

1. Go to **supabase.com** → **Start your project** → sign up (free).
2. Click **New project**.
   - Name: anything, e.g. `pinball-events`
   - Database password: generate one and **save it somewhere** (a password manager, a note — you likely won't need it again, but don't lose it)
   - Region: pick whatever's closest to you
   - Click **Create new project** and wait ~2 minutes while it spins up.
3. Once it's ready, click **SQL Editor** in the left sidebar → **New query**.
4. Open the file `supabase/schema.sql` from this project, copy the **entire contents**, paste into the SQL editor.
5. The file already has `halienoble512@gmail.com` hardcoded into the two admin policies near the bottom — that's the email you'll sign up with as moderator. If you ever want to change it, edit both `auth.jwt() ->> 'email' = '...'` lines and re-run the file.
6. Click **Run** (bottom right). You should see "Success. No rows returned."
7. In the left sidebar, click the gear icon **Project Settings** → **API**.
   You'll need two values from this page in Part 2:
   - **Project URL**
   - **anon public** key (under "Project API keys")

Leave this tab open.

---

## Part 2 — Put the code on GitHub

Vercel deploys from GitHub, so the code needs to live there first.

1. Go to **github.com** → sign up if you don't have an account (free).
2. Click the **+** in the top right → **New repository**.
   - Name: `pinball-events` (or whatever)
   - Keep it **Private** if you don't want the code public
   - Click **Create repository**
3. On the next page, click **uploading an existing file**.
4. Drag in **every file and folder** from this project (everything I gave you, keeping the folder structure intact — `app/`, `lib/`, `supabase/`, `package.json`, etc.)
5. Scroll down, click **Commit changes**.

---

## Part 3 — Deploy it (Vercel)

1. Go to **vercel.com** → sign up using your **GitHub account** (this links them automatically).
2. Click **Add New…** → **Project**.
3. Find the `pinball-events` repo you just created → click **Import**.
4. Before clicking deploy, open **Environment Variables** and add three:

   | Name | Value |
   |---|---|
   | `NEXT_PUBLIC_SUPABASE_URL` | the **Project URL** from Supabase (Part 1, step 7) |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | the **anon public** key from Supabase |
   | `ADMIN_EMAIL` | the exact same email you put in the SQL in Part 1, step 5 |

5. Click **Deploy**. Wait ~2 minutes.
6. You'll get a live URL like `pinball-events.vercel.app`. That's your real, public website.

---

## Part 4 — Make yourself the admin

1. Visit your live URL → **Sign up** using the exact email from `ADMIN_EMAIL`.
2. Supabase will email you a confirmation link (check spam). Click it.
3. Log in. You'll now see a **MODERATE** link in the top nav — that's your queue.
4. Have a friend (or a second email of yours) submit a test event from **SUBMIT**, then approve it from **MODERATE** to confirm the whole loop works.

---

## Changing things later

- **Site name / colors** — edit `app/globals.css` (colors) and `app/layout.tsx` (the "ON THE GLASS" title).
- **Tag options on the submit form** — edit the `SUGGESTED_TAGS` list in `app/submit/page.tsx`.
- **Adding a co-moderator** — right now only one `ADMIN_EMAIL` is trusted. If you want a moderator team, tell me and I'll switch it to a list of trusted emails instead of just one — it's a small change to the code and the SQL policy.
- Any edit: change the file on GitHub (or push via git), Vercel redeploys automatically in ~1 minute.

## Costs

Free tier limits: Supabase gives 500MB database + 1GB file storage + 50,000
monthly active users; Vercel's free (Hobby) tier is generous for a
low-traffic community site. A niche community calendar will not come close
to either limit unless it grows dramatically — if that happens, it's a good
problem to have and both have cheap paid tiers ($25/mo and up).

## If something breaks

The most common failure is a typo in the environment variables or the admin
email not matching *exactly* (including capitalization) between the SQL and
Vercel. Double-check those two first.
