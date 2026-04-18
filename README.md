# simple-frontend-cloudflare

A minimal static frontend example ready for Cloudflare Pages deployment.

## Local preview

```bash
npm run dev
```

Then open `http://localhost:4173`.

## Deploy

This project can be deployed with:

```bash
npx wrangler pages deploy . --project-name simple-frontend-cloudflare
```

## GitHub Actions Auto Deploy

This repo includes `.github/workflows/deploy-pages.yml`.
Every push to `main` triggers a GitHub Action that deploys to Cloudflare Pages.

Required GitHub repository secrets:

- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID` (current value: `cdae7bfa9e2d12d2f24c5ca43a431898`)

After secrets are configured, run:

```bash
git add .
git commit -m "feat: update site"
git push origin main
```

Cloudflare Pages will be updated automatically by the workflow.
