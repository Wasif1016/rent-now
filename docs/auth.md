# Auth & Password Reset

Authentication is handled by **Supabase Auth**. Password reset emails are sent by Supabase, not by this app.

## Admin login

After running the seed (`bun run prisma db seed` or `npx prisma db seed`), a default admin user is created:

| | |
|---|---|
| **Email** | `admin@rentnow.com` |
| **Password** | `Test123!@#` |

Log in at `/auth/login`; you will be redirected to `/admin`.

To use your own admin credentials (e.g. `rentnowpk@gmail.com`), set env vars **before** seeding:

- `ADMIN_SEED_EMAIL` – admin email (e.g. `rentnowpk@gmail.com`)
- `ADMIN_SEED_PASSWORD` – admin password (e.g. `Wasif*1016`)

Then run:

```bash
bun run prisma db seed
```

If the admin user **already exists** in Supabase, the seed will set `user_metadata.role = 'admin'` and **reset the password** to `ADMIN_SEED_PASSWORD`. So if you can’t log in, re-run the seed with the correct env vars to restore access.

### “Invalid credentials” – reset admin password only

To set or reset the admin password **without** re-running the full seed:

1. In `.env.local` set (or add):
   - `ADMIN_SEED_EMAIL=rentnowpk@gmail.com`
   - `ADMIN_SEED_PASSWORD=YourPassword`
2. Run:
   ```bash
   bun run create-admin
   ```
3. Log in at `/auth/login` with that email and password.

## Password reset email not received

If users don't receive the password reset email after submitting the forgot-password form:

### 1. Allowlist the redirect URL in Supabase

Supabase only sends the reset email when the link’s redirect URL is allowed.

1. Open **Supabase Dashboard** → **Authentication** → **URL Configuration**.
2. Set **Site URL** to your app URL (e.g. `http://localhost:3000` or `https://yoursite.com`).
3. Under **Redirect URLs**, add:
   - `http://localhost:3000/auth/reset-password` (for local dev)
   - `https://yourdomain.com/auth/reset-password` (for production)
4. Save.

### 2. Check spam / junk

Emails from Supabase’s default sender often land in spam. Ask users to check spam/junk and wait a few minutes.

### 3. Confirm the email is registered

Supabase returns success even when the email isn’t in the system (to avoid revealing whether an account exists). If the address was never used to sign up, no email is sent.

### 4. Rate limiting

Supabase may throttle reset emails. Trying again after a short wait can help.

---

For custom sender/domain, configure **SMTP** in Supabase: **Project Settings** → **Auth** → **SMTP Settings**.
