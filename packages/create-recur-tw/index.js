#!/usr/bin/env node
// create-recur-tw — scaffold a Recur-integrated app from recur-tw/templates.
//
// Interactive:      npm create recur-tw@latest
// Non-interactive:  npm create recur-tw@latest my-app -- --template saas --yes
import { existsSync, readdirSync, copyFileSync, readFileSync } from 'node:fs'
import { resolve, join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { execSync } from 'node:child_process'
import * as p from '@clack/prompts'
import pc from 'picocolors'
import { downloadTemplate } from 'giget'

// Each CLI release pins the templates repo to a tag so CLI and template
// contents can't drift apart. Override with --ref (e.g. --ref main).
const TEMPLATES_REF = 'v0.2.0'
const TEMPLATES_REPO = 'recur-tw/templates'

const TEMPLATES = {
  saas: {
    label: 'SaaS 訂閱制服務',
    hint: 'Next.js + 多方案訂閱 + entitlements 權限閘門 + customer portal',
  },
  newsletter: {
    label: '付費電子報',
    hint: 'Tiptap 編輯器 + R2 圖片上傳 + 訂閱牆,內容存 git 免資料庫',
  },
  // Coming soon: community, saas-tanstack, backend-only
}

const { version } = JSON.parse(
  readFileSync(join(dirname(fileURLToPath(import.meta.url)), 'package.json'), 'utf8')
)

// --- Parse argv -------------------------------------------------------------

const HELP = `
${pc.bold('create-recur-tw')} v${version} — scaffold a Recur-integrated app

${pc.bold('Usage:')}
  npm create recur-tw@latest [dir] -- [options]
  pnpm create recur-tw [dir] [options]

${pc.bold('Options:')}
  -t, --template <name>   Template to use (${Object.keys(TEMPLATES).join(', ')})
      --pm <manager>      Package manager for install (pnpm | npm | yarn | bun)
      --no-install        Skip installing dependencies
      --no-git            Skip git init
      --ref <git-ref>     Templates repo ref (default: ${TEMPLATES_REF})
  -y, --yes               Accept defaults, never prompt (for CI / agents)
  -h, --help              Show this help
  -v, --version           Show version

${pc.bold('Examples:')}
  npm create recur-tw@latest my-app -- --template saas --yes
  pnpm create recur-tw my-app --template saas --pm pnpm --no-install
`

function parseArgs(argv) {
  const args = { install: true, git: true, yes: false, ref: TEMPLATES_REF }
  const rest = []
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i]
    if (a === '--template' || a === '-t') args.template = argv[++i]
    else if (a === '--pm') args.pm = argv[++i]
    else if (a === '--ref') args.ref = argv[++i]
    else if (a === '--no-install') args.install = false
    else if (a === '--no-git') args.git = false
    else if (a === '--yes' || a === '-y') args.yes = true
    else if (a === '--help' || a === '-h') args.help = true
    else if (a === '--version' || a === '-v') args.showVersion = true
    else if (!a.startsWith('-')) rest.push(a)
    else {
      console.error(pc.red(`Unknown option: ${a}`))
      console.error(HELP)
      process.exit(1)
    }
  }
  args.dir = rest[0]
  return args
}

function detectPackageManager() {
  const ua = process.env.npm_config_user_agent ?? ''
  if (ua.startsWith('pnpm')) return 'pnpm'
  if (ua.startsWith('yarn')) return 'yarn'
  if (ua.startsWith('bun')) return 'bun'
  return 'npm'
}

function bail(message) {
  console.error(pc.red(`✖ ${message}`))
  process.exit(1)
}

// --- Main -------------------------------------------------------------------

async function main() {
  const args = parseArgs(process.argv.slice(2))
  if (args.help) return console.log(HELP)
  if (args.showVersion) return console.log(version)

  const interactive = !args.yes && process.stdout.isTTY

  if (interactive) p.intro(pc.bgCyan(pc.black(' create-recur-tw ')))

  // Project directory
  let dir = args.dir
  if (!dir) {
    if (!interactive) bail('Missing project directory. Usage: create-recur-tw <dir> --template <name> --yes')
    dir = await p.text({
      message: '專案要建立在哪個資料夾?',
      placeholder: 'my-app',
      validate: (v) => (v.trim() ? undefined : '請輸入資料夾名稱'),
    })
    if (p.isCancel(dir)) return p.cancel('已取消')
  }
  const target = resolve(process.cwd(), dir)
  if (existsSync(target) && readdirSync(target).length > 0) {
    bail(`Directory not empty: ${target}`)
  }

  // Template
  let template = args.template
  if (template && !TEMPLATES[template]) {
    bail(`Unknown template "${template}". Available: ${Object.keys(TEMPLATES).join(', ')}`)
  }
  if (!template) {
    if (!interactive) {
      template = 'saas' // --yes default
    } else {
      template = await p.select({
        message: '選擇模板',
        options: Object.entries(TEMPLATES).map(([value, t]) => ({
          value,
          label: `${value} — ${t.label}`,
          hint: t.hint,
        })),
      })
      if (p.isCancel(template)) return p.cancel('已取消')
    }
  }

  // Download
  const source = `github:${TEMPLATES_REPO}/templates/${template}#${args.ref}`
  const spinner = interactive ? p.spinner() : null
  spinner?.start(`下載模板 ${template} (${args.ref})`)
  try {
    await downloadTemplate(source, { dir: target })
  } catch (error) {
    spinner?.stop('下載失敗')
    bail(`Failed to download ${source}\n  ${error.message}`)
  }
  spinner?.stop(`模板已下載到 ${dir}`)
  if (!interactive) console.log(`✔ Downloaded ${template} (${args.ref}) into ${dir}`)

  // .env.local
  const envExample = join(target, '.env.example')
  const envLocal = join(target, '.env.local')
  if (existsSync(envExample) && !existsSync(envLocal)) {
    copyFileSync(envExample, envLocal)
  }

  // git init
  if (args.git) {
    try {
      execSync('git init -q && git add -A && git commit -qm "Initial commit from create-recur-tw"', {
        cwd: target,
        stdio: 'ignore',
        shell: true,
      })
    } catch {
      // git unavailable or already in a repo — not fatal
    }
  }

  // Install
  const pm = args.pm ?? detectPackageManager()
  if (args.install) {
    spinner?.start(`安裝依賴 (${pm} install)`)
    try {
      execSync(`${pm} install`, { cwd: target, stdio: spinner ? 'ignore' : 'inherit' })
      spinner?.stop('依賴安裝完成')
    } catch {
      spinner?.stop('依賴安裝失敗')
      console.error(pc.yellow(`⚠ ${pm} install failed — run it manually inside ${dir}`))
    }
  }

  // Next steps
  const steps = [
    `cd ${dir}`,
    ...(args.install ? [] : [`${pm} install`]),
    `填入 .env.local 的 Recur API keys (app.recur.tw → Settings → Developers)`,
    `${pm} run dev`,
  ]
  if (interactive) {
    p.note(steps.map((s, i) => `${i + 1}. ${s}`).join('\n'), '下一步')
    p.outro(`完成!文件與客製化指南見 ${dir}/README.md 和 ${dir}/AGENTS.md`)
  } else {
    console.log('\nNext steps:')
    steps.forEach((s, i) => console.log(`  ${i + 1}. ${s}`))
    console.log(`\nDocs: ${dir}/README.md · Agent guide: ${dir}/AGENTS.md`)
  }
}

main().catch((error) => bail(error.message))
