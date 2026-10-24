import { mkdirSync } from 'node:fs'
import { chromium } from 'playwright'

const url = process.env.SITE_URL ?? 'http://localhost:3000'
const out = 'screenshots'
const viewports = [
  { name: '1440', width: 1440, height: 900 },
  { name: '390', width: 390, height: 844 }
]
/** Scene positions in steps; see useScrollScene. */
const sceneStops = [-0.3, 1, 2.5, 3.2, 5, 8.9]

mkdirSync(out, { recursive: true })
const browser = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader'] })

for (const { name, width, height } of viewports) {
  const page = await browser.newPage({ viewport: { width, height } })
  await page.goto(url, { waitUntil: 'networkidle' })
  await page.waitForTimeout(3000)
  await page.screenshot({ path: `${out}/${name}-hero.png` })

  const centers = await page.evaluate(() =>
    [...document.querySelectorAll('[data-step]')].map((el) => {
      const box = el.getBoundingClientRect()
      return box.top + scrollY + box.height / 2
    })
  )
  for (const s of sceneStops) {
    const i = Math.min(Math.max(Math.floor(s), 0), centers.length - 2)
    const y = centers[i] + (s - i) * (centers[i + 1] - centers[i]) - height / 2
    await page.evaluate((top) => window.scrollTo(0, top), y)
    await page.waitForTimeout(500)
    await page.screenshot({ path: `${out}/${name}-scene-${s}.png` })
  }

  for (const id of ['projects', 'contact']) {
    await page.evaluate((target) => document.getElementById(target).scrollIntoView(), id)
    await page.waitForTimeout(1200)
    await page.screenshot({ path: `${out}/${name}-${id}.png` })
  }
  await page.close()
}

await browser.close()
