import { spawnSync } from 'node:child_process'
import { mkdirSync } from 'node:fs'
import { dirname } from 'node:path'

const extraArgs = process.argv.slice(2)
const playwrightArgs = extraArgs[0] === '--' ? extraArgs.slice(1) : extraArgs
const pnpm = process.platform === 'win32' ? 'pnpm.cmd' : 'pnpm'
const env = {
  ...process.env,
  ORCA_E2E_SSH_DOCKER: '1'
}

if (process.env.ORCA_E2E_SSH_DOCKER_PERF_JSON) {
  mkdirSync(dirname(process.env.ORCA_E2E_SSH_DOCKER_PERF_JSON), { recursive: true })
}

const runtime = spawnSync(pnpm, ['run', 'ensure:electron-runtime'], {
  stdio: 'inherit',
  env
})

if (runtime.status !== 0) {
  process.exit(runtime.status ?? 1)
}

const result = spawnSync(
  pnpm,
  [
    'exec',
    'playwright',
    'test',
    'tests/e2e/ssh-docker-relay-perf.spec.ts',
    '--config',
    'tests/playwright.config.ts',
    '--project',
    'electron-headless',
    '--workers=1',
    ...playwrightArgs
  ],
  {
    stdio: 'inherit',
    env
  }
)

process.exit(result.status ?? 1)
