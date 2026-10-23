# AWGP App Help Center

Static help site for the AWGP App ([HelpKit](https://helpkit.so)-style UI).  
**Source of truth:** `help-landing/` in [awgp-mobile](https://github.com/shiv213/awgp-mobile).

## Live site

[awgp.link/help/](https://awgp.link/help/) and [awgp.app/help/](https://awgp.app/help/) serve the help center. The old GitHub Pages site redirects visitors to `awgp.link`, keeping the article, language query, and section fragment.

Canonical content is in `help-landing/` in `shiv213/awgp-mobile`. Push changes there to `main`; its Cloudflare website workflow deploys both domains. This repository keeps the old Pages address working. See [HOSTING.txt](./HOSTING.txt).

## Local preview

```bash
cd help-landing && npx serve .
```

Open with a language: `http://localhost:3000/?lang=hi` (also `gu`, `mr`; English is default).

## Localization

- App Profile opens Help / FAQ with `?lang=` matching the in-app UI language (`en` / `hi` / `gu` / `mr`).
- Strings live in `js/locales/{en,hi,gu,mr}.js`. HTML uses `data-i18n` / `data-i18n-html` / `data-i18n-placeholder`.
- `js/i18n.js` reads `?lang=`, keeps it in `sessionStorage`, rewrites internal links, and shows a language switcher.
- Publish translations from `help-landing/` in the app repository to update both domains.

## Structure

```
help-landing/
  index.html          # Hub — search, categories, suggested articles
  contact.html
  styles.css
  assets/icon.png
  js/articles.js      # Search index (ids + hrefs)
  js/i18n.js          # Language resolve + DOM apply
  js/locales/*.js     # en / hi / gu / mr catalogs
  js/site.js
  pages/
    whats-new.html    # Member-facing release highlights
    *.html            # Category guides
```

Internal engineering changelog (Keep a Changelog): `docs/CHANGELOG.md` in the app repo.  
When you cut a store release, update both `docs/CHANGELOG.md` and the What’s New page (plus locale strings), then push the canonical content to `main` in the app repository.

## Edit content

1. Change English (and translations) in `js/locales/*.js`, and matching `data-i18n` keys in HTML.
2. Update the canonical `help-landing/` content in the app repository and push to `main`.

- **New article:** add to `js/articles.js`, locale `articles.*` / page keys, and a matching section `id` in `pages/*.html`.
- **New category:** add to `categories` in `articles.js` + `categories.*` in locales, and create `pages/your-category.html`.

## Link from the app

```
https://awgp.link/help/
https://awgp.link/help/?lang=hi
https://awgp.link/help/pages/faq.html?lang=hi
https://awgp.link/help/pages/whats-new.html?lang=hi
```

Both domains preserve the language query.
