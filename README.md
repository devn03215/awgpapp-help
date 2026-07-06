# AWGP Help Center

Static help site for the AWGP mobile app ([HelpKit](https://helpkit.so)-style UI).  
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

## Structure

```
help-landing/
  index.html          # Hub — search, categories, suggested articles
  contact.html
  styles.css
  assets/icon.png
  js/articles.js      # Search index
  js/site.js
  pages/*.html        # Category guides
```

## Edit content

1. Change files here in `awgp-mobile`.
2. Copy to `devn03215/awgpapp-help` and push (see HOSTING.txt).

- **New article:** add to `js/articles.js` and a matching section `id` in `pages/*.html`.
- **New category:** add to `categories` in `articles.js` and create `pages/your-category.html`.

## Link from the app

```
https://devn03215.github.io/awgpapp-help/
```

Update once when you move to a custom domain.
