# create-recur-tw

Scaffold a [Recur](https://recur.tw)-integrated app from official templates
— checkout, webhooks, entitlements gating, and customer portal pre-wired.

## Usage

```bash
# Interactive
npm create recur-tw@latest

# Non-interactive (CI / AI agents)
npm create recur-tw@latest my-app -- --template saas --yes
```

## Options

| Option | Description |
|--------|-------------|
| `-t, --template <name>` | Template to use (`saas`, `newsletter`) |
| `--pm <manager>` | Package manager for install (`pnpm` / `npm` / `yarn` / `bun`) |
| `--no-install` | Skip installing dependencies |
| `--no-git` | Skip `git init` |
| `--ref <git-ref>` | Templates repo ref (defaults to the tag pinned by this CLI version) |
| `-y, --yes` | Accept defaults, never prompt |

## Templates

See the [templates repo](https://github.com/recur-tw/templates) for the
full catalog. More templates (newsletter, community, tanstack, backend-only)
are on the roadmap.

## License

MIT
