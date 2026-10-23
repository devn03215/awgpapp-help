# AWGP App Help Center

Static help site for the AWGP App ([HelpKit](https://helpkit.so)-style UI).  
**Source of truth:** this repository.

## Live site

[awgp.link/help/](https://awgp.link/help/) and [awgp.app/help/](https://awgp.app/help/) serve the help center. The old GitHub Pages site redirects visitors to `awgp.link`, keeping the article, language query, and section fragment.

Push changes here to `main`. **Update live website** refreshes the private Railway website from all three public AWGP repositories and checks that this exact commit is live on both domains. The old Pages address remains available for redirects. See [HOSTING.txt](./HOSTING.txt).

## Local preview

```bash
cd help-landing && npx serve .
```

Open with a language: `http://localhost:3000/?lang=hi` (also `gu`, `mr`; English is default).

## Localization

- App Profile opens Help / FAQ with `?lang=` matching the in-app UI language (`en` / `hi` / `gu` / `mr`).
- Strings live in `js/locales/{en,hi,gu,mr}.js`. HTML uses `data-i18n` / `data-i18n-html` / `data-i18n-placeholder`.
- `js/i18n.js` reads `?lang=`, keeps it in `sessionStorage`, rewrites internal links, and shows a language switcher.
- Push translations here to update both domains.

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
When you cut a store release, update both `docs/CHANGELOG.md` and the What’s New page (plus locale strings), then push the help changes here to `main`.

## Edit content

1. Change English (and translations) in `js/locales/*.js`, and matching `data-i18n` keys in HTML.
2. Push this repository to `main`; check the deployment workflow.

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
