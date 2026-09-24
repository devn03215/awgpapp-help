/**
 * Help Center i18n — resolve ?lang=, apply data-i18n*, preserve lang on links.
 * Locales register on window.AWGP_HELP_I18N[lang].
 */
(function () {
  var STORAGE_KEY = 'awgp-help-lang';
  var SUPPORTED = ['en', 'hi', 'gu', 'mr'];

  function normalizeLang(value) {
    if (!value) return null;
    var code = String(value).toLowerCase().split(/[-_]/)[0];
    return SUPPORTED.indexOf(code) !== -1 ? code : null;
  }

  function resolveLang() {
    try {
      var params = new URLSearchParams(window.location.search);
      var fromQuery = normalizeLang(params.get('lang'));
      if (fromQuery) {
        try {
          sessionStorage.setItem(STORAGE_KEY, fromQuery);
        } catch (e) {}
        return fromQuery;
      }
      var fromStore = normalizeLang(sessionStorage.getItem(STORAGE_KEY));
      if (fromStore) return fromStore;
    } catch (e) {}
    return 'en';
  }

  function getDict(lang) {
    var all = window.AWGP_HELP_I18N || {};
    return all[lang] || all.en || {};
  }

  function lookup(dict, key) {
    if (!key) return undefined;
    var parts = key.split('.');
    var cur = dict;
    for (var i = 0; i < parts.length; i++) {
      if (cur == null || typeof cur !== 'object') return undefined;
      cur = cur[parts[i]];
    }
    return typeof cur === 'string' ? cur : undefined;
  }

  function t(key, fallback) {
    var lang = window.AWGP_HELP_LANG || 'en';
    var primary = lookup(getDict(lang), key);
    if (primary != null) return primary;
    if (lang !== 'en') {
      var en = lookup(getDict('en'), key);
      if (en != null) return en;
    }
    return fallback != null ? fallback : key;
  }

  function withLang(href, lang) {
    if (!href || href.charAt(0) === '#' || href.indexOf('mailto:') === 0) return href;
    if (/^https?:\/\//i.test(href) && href.indexOf(window.location.host) === -1) {
      // Absolute external — leave alone unless same GitHub Pages help host path
      try {
        var u = new URL(href, window.location.href);
        if (u.origin !== window.location.origin) return href;
        href = u.pathname + u.search + u.hash;
      } catch (e) {
        return href;
      }
    }
    try {
      var url = new URL(href, window.location.href);
      if (lang && lang !== 'en') {
        url.searchParams.set('lang', lang);
      } else {
        url.searchParams.delete('lang');
      }
      // Prefer relative if same path directory style
      var out = url.pathname + url.search + url.hash;
      // On GitHub Pages project sites, pathname includes /awgpapp-help/
      // Keep absolute path from URL API so links work from nested pages
      return out;
    } catch (e) {
      return href;
    }
  }

  function applyText() {
    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var key = el.getAttribute('data-i18n');
      var value = t(key, el.textContent);
      el.textContent = value;
    });
    document.querySelectorAll('[data-i18n-html]').forEach(function (el) {
      var key = el.getAttribute('data-i18n-html');
      var value = t(key, el.innerHTML);
      el.innerHTML = value;
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach(function (el) {
      var key = el.getAttribute('data-i18n-placeholder');
      var value = t(key, el.getAttribute('placeholder') || '');
      el.setAttribute('placeholder', value);
    });
    document.querySelectorAll('[data-i18n-aria]').forEach(function (el) {
      var key = el.getAttribute('data-i18n-aria');
      var value = t(key, el.getAttribute('aria-label') || '');
      el.setAttribute('aria-label', value);
    });
    document.querySelectorAll('[data-i18n-title]').forEach(function (el) {
      var key = el.getAttribute('data-i18n-title');
      var value = t(key, document.title);
      if (el.tagName === 'TITLE' || el === document.querySelector('title')) {
        document.title = value;
      } else {
        el.setAttribute('title', value);
      }
    });
    var titleEl = document.querySelector('title[data-i18n]');
    if (titleEl) {
      document.title = t(titleEl.getAttribute('data-i18n'), document.title);
    }
  }

  function rewriteLinks(lang) {
    document.querySelectorAll('a[href]').forEach(function (a) {
      var href = a.getAttribute('href');
      if (!href) return;
      if (href.indexOf('mailto:') === 0 || href.indexOf('tel:') === 0) return;
      if (href.charAt(0) === '#') return;
      // Skip language switcher links — they set lang themselves
      if (a.hasAttribute('data-lang-switch')) return;
      a.setAttribute('href', withLang(href, lang));
    });
  }

  function ensureFonts(lang) {
    if (lang !== 'hi' && lang !== 'mr' && lang !== 'gu') return;
    if (document.getElementById('awgp-help-indic-fonts')) return;
    var link = document.createElement('link');
    link.id = 'awgp-help-indic-fonts';
    link.rel = 'stylesheet';
    link.href =
      'https://fonts.googleapis.com/css2?family=Noto+Sans+Devanagari:wght@400;500;600;700&family=Noto+Sans+Gujarati:wght@400;500;600;700&display=swap';
    document.head.appendChild(link);
  }

  function renderLangSwitcher(lang) {
    var host = document.getElementById('lang-switcher');
    if (!host) return;
    var labels = { en: 'English', hi: 'हिन्दी', gu: 'ગુજરાતી', mr: 'मराठी' };
    host.innerHTML = SUPPORTED.map(function (code) {
      var active = code === lang ? ' is-active' : '';
      return (
        '<button type="button" class="lang-btn' +
        active +
        '" data-lang-switch="' +
        code +
        '" aria-pressed="' +
        (code === lang ? 'true' : 'false') +
        '">' +
        labels[code] +
        '</button>'
      );
    }).join('');
    host.querySelectorAll('[data-lang-switch]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var next = btn.getAttribute('data-lang-switch');
        try {
          sessionStorage.setItem(STORAGE_KEY, next);
        } catch (e) {}
        var url = new URL(window.location.href);
        if (next === 'en') url.searchParams.delete('lang');
        else url.searchParams.set('lang', next);
        window.location.href = url.toString();
      });
    });
  }

  var lang = resolveLang();
  window.AWGP_HELP_LANG = lang;
  window.AWGP_HELP_t = t;
  window.AWGP_HELP_withLang = withLang;

  document.documentElement.lang = lang;
  ensureFonts(lang);

  function boot() {
    applyText();
    rewriteLinks(lang);
    renderLangSwitcher(lang);
    document.documentElement.setAttribute('data-help-lang', lang);
    document.dispatchEvent(new CustomEvent('awgp-help-i18n-ready', { detail: { lang: lang } }));
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
