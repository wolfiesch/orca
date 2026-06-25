import { test } from './helpers/orca-app'

test.describe('Startup hydration readiness', () => {
  test('records workspace session readiness time', async ({ electronApp }, testInfo) => {
    const page = await electronApp.firstWindow({ timeout: 120_000 })
    await page.waitForLoadState('domcontentloaded')

    const pollingStart = performance.now()
    await page.waitForFunction(
      () => window.__store?.getState().workspaceSessionReady === true,
      null,
      { timeout: 60_000 }
    )
    const readyMs = performance.now() - pollingStart

    testInfo.annotations.push({
      type: 'startup-hydration-ready',
      description: `readyMs=${readyMs}`
    })
  })
})
