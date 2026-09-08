# Deployment — self-hosted on a Ukrainian VPS

Client decision (2026-09-03): Ukrainian hosting/billing matters more than deploy convenience, so this is **not** on Vercel — it's a plain Docker container (this app) behind Caddy (automatic HTTPS) on a Ukrainian VPS. Real DevOps, not a `git push` platform; this doc is the whole runbook.

## Why this shape

- The app needs a real Node server (Server Actions, the Monobank webhook route, streaming) — rules out classic Ukrainian shared/cPanel hosting, which is mostly PHP-oriented.
- A VPS with root SSH + Docker gets us a proper Node runtime without locking into any specific host's quirks — the same `docker-compose.yml` works on any Ukrainian VPS provider that gives you a Linux box with Docker.
- **Spec target**: root SSH + Docker is the only hard requirement — Ubuntu 22.04/24.04 LTS, a public IPv4. CPU/RAM can be modest: the database lives entirely on Supabase, not on this box, so the VPS only ever runs the Next.js app + Caddy — it barely touches disk and doesn't need much RAM to _run_ (see the note on building below for the one place RAM actually gets tight).

### Provider — real pricing, pulled directly from HostPro's live order page (2026-09-03)

| Plan (NVMe VPS family)  | CPU        | RAM      | Storage        | Price/mo        |
| ----------------------- | ---------- | -------- | -------------- | --------------- |
| **VPS-1 (recommended)** | **1 core** | **2 GB** | **50 GB NVMe** | **₴592 (~$14)** |
| VPS-2                   | 1 core     | 4 GB     | 80 GB NVMe     | ₴1,184 (~$28)   |
| VPS-3                   | 2 cores    | 6 GB     | 100 GB NVMe    | ₴1,776 (~$42)   |

(Two earlier passes at this table, based on a fetch tool rather than the real order page, gave wrong numbers and wrongly pointed at VPS-3/MiroHost — this table is the corrected, real one, taken from the client's own screenshot of HostPro's live pricing.)

**Recommendation: HostPro NVMe VPS-1.** ₴592/mo (~$14) is enough to comfortably _run_ this app — 2 GB RAM covers the Next.js server, Caddy, and OS overhead with real headroom for a small boutique store's traffic. The one place RAM gets tight is _building_ the Docker image (a `next build` inside it), which is why the deploy flow below builds off the VPS rather than on it — see "Building the image" below. SSD VPS-1 (₴538/mo) is nearly identical for ~₴54/mo less; NVMe is worth the difference at that gap.

## One-time VPS setup

```bash
# On the VPS, as root (or a sudo user):
apt update && apt install -y docker.io docker-compose-plugin git
systemctl enable --now docker
```

Also clone the repo there once, for `docker-compose.yml`/`Caddyfile`/`.env` to live alongside (the app image itself gets built elsewhere — see below):

```bash
git clone https://github.com/nlklfor/bob-retail.git
cd bob-retail

# Create the real .env — see .env.example for every variable this needs.
# Real secrets only, never commit this file (it's already gitignored).
nano .env
```

## Building the image

VPS-1 has 2 GB RAM — enough to comfortably _run_ the app, but `next build` itself is meaningfully heavier than that and risks failing partway through with no swap configured. Build on the developer's own machine (or any beefier box) instead, and hand the VPS a finished image instead of asking it to build one:

```bash
# On the developer's machine, from the repo root, using the real values
# from your own .env.local:
docker build \
  --build-arg SUPABASE_URL=<value> \
  --build-arg SUPABASE_ANON_KEY=<value> \
  --build-arg SUPABASE_SERVICE_ROLE_KEY=<value> \
  -t bob-retail-app:latest .

docker save bob-retail-app:latest | gzip > bob-retail-app.tar.gz
scp bob-retail-app.tar.gz root@<VPS_IP>:~/
```

```bash
# On the VPS:
docker load < bob-retail-app.tar.gz
rm bob-retail-app.tar.gz
```

`docker-compose.yml` names the app image `bob-retail-app:latest` explicitly (not Compose's own auto-generated name) specifically so this loaded image is what `docker compose up` finds and runs, below.

If this gets tedious across many redeploys, the natural upgrade later is pushing the image to GitHub Container Registry and having the VPS `docker compose pull` instead of scp+load — not worth setting up now for a first deploy.

## Starting the stack

```bash
# On the VPS, in the cloned repo:
docker compose up -d
```

(No `--build` — the image was already loaded above.) This starts two containers:

- **`app`** — the Next.js server, not exposed to the internet directly (`expose`, not `ports`, in `docker-compose.yml`).
- **`caddy`** — the public-facing reverse proxy on 80/443. Reads `DOMAIN` from `.env` and automatically obtains + renews a real Let's Encrypt certificate for it — no manual certbot/nginx config to maintain.

## DNS

Point the domain's `A` record at the VPS's public IPv4 address. Caddy needs port 80 reachable from the internet to complete the Let's Encrypt HTTP challenge the first time it starts — if there's a firewall in front of the VPS (MiroHost's control panel, `ufw`, etc.), make sure 80 and 443 are open.

## After the domain is live

Update `.env` on the VPS:

```
SITE_URL=https://your-real-domain.com
```

then `docker compose up -d` again to pick it up (no rebuild needed — it's a runtime env var, not baked into the image). **This step is what actually turns on real Monobank payments** — until `SITE_URL` points at the real domain, Monobank has nowhere to deliver its webhook, so `applyInvoiceStatus()` never fires for real and orders sit in `pending_payment` until the fallback check catches up (see `docs/project-status.md`'s Monobank section).

## Redeploying after future changes

Same shape as the first deploy — build on the developer's machine, ship the image over, restart the container:

```bash
# Developer's machine:
git pull  # if the VPS's clone isn't also the source of the rebuild
docker build --build-arg SUPABASE_URL=<value> --build-arg SUPABASE_ANON_KEY=<value> --build-arg SUPABASE_SERVICE_ROLE_KEY=<value> -t bob-retail-app:latest .
docker save bob-retail-app:latest | gzip > bob-retail-app.tar.gz
scp bob-retail-app.tar.gz root@<VPS_IP>:~/
```

```bash
# VPS:
docker load < bob-retail-app.tar.gz && rm bob-retail-app.tar.gz
docker compose up -d
```

Caddy and its certificates aren't touched by this — only the `app` container restarts, onto the newly loaded image.

## Verified locally before writing this doc

The full stack (build → run → real HTTPS via Caddy → real Supabase data → the Monobank webhook route) was built and run end-to-end on the developer's own machine before this was documented as working — not just written and assumed. The `docker save` → `docker load` → `docker compose up` (no `--build`) flow was also verified for real: built the image, deleted it locally to simulate a clean VPS, loaded it back from the saved tarball, and confirmed Compose started it directly — no rebuild triggered — and it served the real site through Caddy identically to the freshly-built version. What wasn't (and can't be) tested locally: the actual `scp` over a real network to a real VPS, and real Let's Encrypt certificate issuance, which needs a real public domain and port 80 reachable from the internet — Caddy transparently falls back to its own local CA for `localhost`, which is what the local test actually exercised. This is a well-established, standard Caddy behavior, not a gap specific to this setup.

**Security note**: `docker build --build-arg` bakes the Supabase values into the image's build history (visible via `docker history`, even though they're not in the final running layers) — Docker's own linter flags this. Accepted here because the image is never pushed to a shared/public registry, only saved to a tarball and `scp`'d directly to the one VPS we control. If that ever changes (a registry enters the picture), switch to BuildKit's `--secret` mount instead of `--build-arg` for these three values.
