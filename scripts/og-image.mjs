import { readFileSync } from 'node:fs'
import { chromium } from 'playwright'

const font = readFileSync(
  'node_modules/@fontsource-variable/geist/files/geist-latin-wght-normal.woff2'
).toString('base64')

const html = `<style>
@font-face { font-family: Geist; src: url(data:font/woff2;base64,${font}); font-weight: 100 900; }
body { margin: 0; width: 1200px; height: 630px; box-sizing: border-box; padding: 64px 72px; display: flex; flex-direction: column; justify-content: flex-end; background: #091011; color: #e6f0ee; font-family: Geist; }
h1 { margin: 0 0 40px -6px; font-size: 200px; line-height: 0.85; font-weight: 800; letter-spacing: -0.03em; }
p { margin: 0; padding-top: 24px; border-top: 1px solid #213234; font-size: 34px; color: #9bb0ae; }
</style><h1>KacperDn</h1><p>Fullstack developer. Symfony and Vue.</p>`

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } })
await page.setContent(html)
await page.evaluate(() => document.fonts.ready)
await page.screenshot({ path: 'public/og.png' })
await browser.close()
