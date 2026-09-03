# Deployment — self-hosted on a Ukrainian VPS

Client decision (2026-09-03): Ukrainian hosting/billing matters more than deploy convenience, so this is **not** on Vercel — it's a plain Docker container (this app) behind Caddy (automatic HTTPS) on a Ukrainian VPS. Real DevOps, not a `git push` platform; this doc is the whole runbook.

## Why this shape

- The app needs a real Node server (Server Actions, the Monobank webhook route, streaming) — rules out classic Ukrainian shared/cPanel hosting, which is mostly PHP-oriented.
- A VPS with root SSH + Docker gets us a proper Node runtime without locking into any specific host's quirks — the same `docker-compose.yml` works on any Ukrainian VPS provider that gives you a Linux box with Docker.
- **Spec target**: 2 vCPU / 4+ GB RAM minimum, Ubuntu 22.04 or 24.04 LTS, a public IPv4 address, full root SSH access (Docker isn't something a host needs to specially support — any root-access Linux box can install it with `apt install docker.io`).

### Provider comparison (real pricing pulled 2026-09-03, re-check before ordering — hosting prices drift)

| Provider                                       | Plan      | CPU         | RAM      | Storage         | Price/mo      |
| ---------------------------------------------- | --------- | ----------- | -------- | --------------- | ------------- |
| **[HostPro](https://hostpro.ua/en/nvme-vps/)** | VPS-2     | 1 core      | 4 GB     | 80 GB NVMe      | $22           |
| **HostPro (recommended)**                      | **VPS-3** | **2 cores** | **6 GB** | **100 GB NVMe** | **$33**       |
| [MiroHost](https://mirohost.net/en/vps)        | eVPS-8    | 2 cores     | 4 GB     | 48 GB SSD       | ₴1,524 (~$36) |

**Recommendation: HostPro VPS-3.** At essentially the same price as MiroHost's closest matching tier, it beats it on every spec (more RAM, more storage, and NVMe rather than plain SSD), explicitly confirms full root access, offers a wide distro choice (Ubuntu/Debian/AlmaLinux/RockyLinux/Fedora), and includes 24/7 admin support. HostPro VPS-2 ($22/mo, 1 core/4 GB) is a reasonable leaner starting point if budget is tight — a single vCPU is fine for Node's request handling, it just leaves less headroom for the admin panel and image uploads running at the same time as storefront traffic.

## One-time VPS setup

```bash
# On the VPS, as root (or a sudo user):
apt update && apt install -y docker.io docker-compose-plugin git
systemctl enable --now docker
```

## Deploying

```bash
git clone https://github.com/nlklfor/bob-retail.git
cd bob-retail

# Create the real .env — see .env.example for every variable this needs.
# Real secrets only, never commit this file (it's already gitignored).
nano .env

docker compose up -d --build
```

That's it — `docker compose` builds the image (Bun for install/build, plain Node for the runtime — see `Dockerfile`) and starts two containers:

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

```bash
git pull
docker compose up -d --build
```

Caddy and its certificates aren't touched by this — only the `app` container gets rebuilt.

## Verified locally before writing this doc

The full stack (build → run → real HTTPS via Caddy → real Supabase data → the Monobank webhook route) was built and run end-to-end on the developer's own machine before this was documented as working — not just written and assumed. What wasn't (and can't be) tested locally: real Let's Encrypt certificate issuance, which needs a real public domain and port 80 reachable from the internet — Caddy transparently falls back to its own local CA for `localhost`, which is what the local test actually exercised. This is a well-established, standard Caddy behavior, not a gap specific to this setup.
