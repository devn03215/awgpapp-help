# AWGP App Help Center

Static help site for the AWGP App ([HelpKit](https://helpkit.so)-style UI).  
**Source of truth:** `help-landing/` in [awgp-mobile](https://github.com/shiv213/awgp-mobile).

## Live site

Hosted on GitHub Pages under [devn03215](https://github.com/devn03215):

**https://devn03215.github.io/awgpapp-help/**

(Same account as [awgp-share](https://devn03215.github.io/awgp-share/), [awgp-books](https://devn03215.github.io/awgp-books/), and [privacy-policy](https://devn03215.github.io/privacy-policy/).)

See [HOSTING.txt](./HOSTING.txt) for deploy steps.

## Local preview

```bash
cd help-landing && npx serve .
```

Open with a language: `http://localhost:3000/?lang=hi` (also `gu`, `mr`; English is default).

## Localization

- App Profile opens Help / FAQ with `?lang=` matching the in-app UI language (`en` / `hi` / `gu` / `mr`).
- Strings live in `js/locales/{en,hi,gu,mr}.js`. HTML uses `data-i18n` / `data-i18n-html` / `data-i18n-placeholder`.
- `js/i18n.js` reads `?lang=`, keeps it in `sessionStorage`, rewrites internal links, and shows a language switcher.
- Until you copy this folder to `awgpapp-help` and push (see HOSTING.txt), production Pages will not show new translations even though the app already appends `?lang=`.

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
  pages/*.html        # Category guides
```

## Edit content

1. Change English (and translations) in `js/locales/*.js`, and matching `data-i18n` keys in HTML.
2. Copy to `devn03215/awgpapp-help` and push (see HOSTING.txt).

- **New article:** add to `js/articles.js`, locale `articles.*` / page keys, and a matching section `id` in `pages/*.html`.
- **New category:** add to `categories` in `articles.js` + `categories.*` in locales, and create `pages/your-category.html`.

## Link from the app

```
https://devn03215.github.io/awgpapp-help/
https://devn03215.github.io/awgpapp-help/?lang=hi
https://devn03215.github.io/awgpapp-help/pages/faq.html?lang=hi
```

Update once when you move to a custom domain.
