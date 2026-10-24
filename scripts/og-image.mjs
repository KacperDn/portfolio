import { readFileSync } from 'node:fs'
import { chromium } from 'playwright'

const font = readFileSync(
  'node_modules/@fontsource-variable/bricolage-grotesque/files/bricolage-grotesque-latin-wdth-normal.woff2'
).toString('base64')

const html = `<style>
@font-face { font-family: Bricolage; src: url(data:font/woff2;base64,${font}); font-weight: 200 800; font-stretch: 75% 100%; }
body { margin: 0; width: 1200px; height: 630px; box-sizing: border-box; padding: 80px; display: flex; flex-direction: column; justify-content: flex-end; background: #14122b; color: #eceaf4; font-family: Bricolage; }
h1 { margin: 0; font-size: 220px; line-height: 1; font-weight: 700; letter-spacing: -0.04em; }
p { margin: 24px 0 0; font-size: 34px; color: #b8b5cc; }
</style><h1>Kacper</h1><p>Fullstack developer. Symfony and Vue.</p>`

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } })
await page.setContent(html)
await page.evaluate(() => document.fonts.ready)
await page.screenshot({ path: 'public/og.png' })
await browser.close()
