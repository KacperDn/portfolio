import { mkdirSync } from 'node:fs'
import { chromium } from 'playwright'

const url = process.env.SITE_URL ?? 'http://localhost:3000'
const out = 'screenshots'
const viewports = [
  { name: '1440', width: 1440, height: 900 },
  { name: '390', width: 390, height: 844 }
]

mkdirSync(out, { recursive: true })
const browser = await chromium.launch()

for (const { name, width, height } of viewports) {
  const page = await browser.newPage({ viewport: { width, height } })
  await page.goto(url, { waitUntil: 'networkidle' })
  await page.waitForTimeout(2000)
  await page.screenshot({ path: `${out}/${name}-hero.png` })

  for (const id of ['about', 'projects', 'contact']) {
    await page.evaluate((target) => document.getElementById(target).scrollIntoView(), id)
    await page.waitForTimeout(1200)
    await page.screenshot({ path: `${out}/${name}-${id}.png` })
  }
  await page.close()
}

await browser.close()
