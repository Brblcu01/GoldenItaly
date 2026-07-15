import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '')
  const siteUrl = env.VITE_SITE_URL?.trim()

  if (mode === 'production') {
    if (!siteUrl) throw new Error('VITE_SITE_URL is required for a production build.')
    if (!siteUrl.startsWith('https://')) throw new Error('VITE_SITE_URL must use HTTPS.')
    if (/localhost|127\.0\.0\.1/i.test(siteUrl)) throw new Error('VITE_SITE_URL cannot use a local hostname in production.')
    if (/\.netlify\.app$/i.test(new URL(siteUrl).hostname)) throw new Error('VITE_SITE_URL must use the definitive custom domain, not the Netlify subdomain.')
    if (siteUrl.endsWith('/')) throw new Error('VITE_SITE_URL must not end with a slash.')
    const parsed = new URL(siteUrl)
    if (parsed.pathname !== '/' || parsed.search || parsed.hash) throw new Error('VITE_SITE_URL must contain only the canonical origin.')
  }

  return {
    plugins: [react()],
  }
})
