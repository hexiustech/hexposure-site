# Hexposure site — working notes

Bilingual marketing site (Jekyll, GitHub Pages "Deploy from a branch", apex domain
**hexposure.ca**). **French is the default**: English lives under `/en/`, French
under `/fr/`, and the root `/` redirects to `/fr/`. All user-visible copy is
data-driven from `_data/`; shared templates in `_includes/pages/` + `_layouts/`
render both locales.

## 1. Brand: ALWAYS use `brand-hexposure/`

`brand-hexposure/` is the **single source of truth** for the visual brand. Pull
from it — never invent colors, type, or marks. Before changing anything visual,
check it against the kit.

- **Colors** → `brand-hexposure/tokens.css` (dark + `[data-theme="light"]`).
  `site.css` `:root` token values must match these.
- **Fonts** → Sora (400/700/800) + IBM Plex Mono, loaded in `_includes/head.html`.
- **Logo / mark** → `brand-hexposure/logos/` — `hexposure-mark.svg` is what
  `_includes/logo.html` inlines.
- **Favicon / app icon** → `brand-hexposure/logos/hexposure-favicon-tile.svg`,
  shipped as `favicon.svg` (+ `favicon-32.png`, `apple-touch-icon.png`).
- **Brand gradient** → `#c3aef2 → #8b6ce6 → #5e3fb0`.

(`brand-hexposure/` is reference material; it currently also ships into `_site/`.)

## 2. Bilingual: ALWAYS edit BOTH FR and EN

Every content file is paired:
- **English** = base name: `home.yml`, `platform.yml`, `why.yml`, `privacy.yml`,
  `terms.yml`, `nav.yml`, `footer.yml`, `ui.yml`.
- **French** = `*_fr.yml` sibling: `home_fr.yml`, `platform_fr.yml`, …

**Rule: any content change must be applied to BOTH the base file AND its `_fr.yml`
sibling**, keeping the same keys/structure. This includes list items
(e.g. `strip.items`), stats, legal sections, and meta titles/descriptions. After a
copy edit, diff the two files' shapes to confirm they stayed in sync.

Deliberate per-language wording is fine (e.g. the hero third beat is
"Prove you're covered." in EN but "Prouvez votre sécurité." in FR) — just make that
call on purpose, never by forgetting one side.

`site.yml` is the only locale-shared data file (emails, urls) — no `_fr` sibling.

## 3. Liquid data-lookup gotcha

Templates select the locale file via a computed suffix. Liquid does **not** allow a
filter inside `[ ]` — assign the key to a variable first, then bracket-look it up:

```liquid
{%- assign sfx = '' -%}{%- if page.lang == 'fr' -%}{%- assign sfx = '_fr' -%}{%- endif -%}
{%- assign k = 'nav' | append: sfx -%}{%- assign nav = site.data[k] -%}
```

Locale-prefixed links (`/en/…`, `/fr/…`) are baked into each locale's data file.

## 4. Build / preview locally

The machine's Bundler is broken — bypass it:

```bash
JEKYLL_NO_BUNDLER_REQUIRE=true jekyll build
JEKYLL_NO_BUNDLER_REQUIRE=true jekyll serve --no-watch --host 127.0.0.1 --port 4000
```

Screenshots: headless Chrome at `/usr/bin/google-chrome`. Reference assets over
`http://127.0.0.1:4000` (headless Chrome blocks `file://` subresources).
