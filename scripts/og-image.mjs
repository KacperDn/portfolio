import { readFileSync } from 'node:fs'
import { chromium } from 'playwright'

const font = readFileSync(
  'node_modules/@fontsource-variable/bricolage-grotesque/files/bricolage-grotesque-latin-wdth-normal.woff2'
).toString('base64')

const html = `<style>
@font-face { font-family: Bricolage; src: url(data:font/woff2;base64,${font}); font-weight: 200 800; font-stretch: 75% 100%; }
body { margin: 0; width: 1200px; height: 630px; box-sizing: border-box; padding: 64px 72px; display: flex; flex-direction: column; justify-content: flex-end; background: #0d0d0e; color: #e9e9e6; font-family: Bricolage; }
h1 { margin: 0 0 40px -6px; font-size: 250px; line-height: 0.85; font-weight: 800; font-stretch: 75%; letter-spacing: -0.02em; }
p { margin: 0; padding-top: 24px; border-top: 1px solid #2c2c30; font-size: 34px; color: #a0a0a4; }
</style><h1>KacperDn</h1><p>Fullstack developer. Symfony and Vue.</p>`

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } })
await page.setContent(html)
await page.evaluate(() => document.fonts.ready)
await page.screenshot({ path: 'public/og.png' })
await browser.close()
