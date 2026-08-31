(function () {
  const data = window.AWGP_HELP;
  if (!data) return;

  const root = document.documentElement;
  const basePath = root.getAttribute('data-base') || '';
  const t = window.AWGP_HELP_t || function (key, fb) { return fb != null ? fb : key; };
  const withLang = window.AWGP_HELP_withLang || function (href) { return href; };

  function resolveHref(href) {
    if (!href || href.startsWith('http') || href.startsWith('mailto:')) return href;
    var resolved = href;
    if (basePath && !href.startsWith(basePath)) {
      resolved = basePath.replace(/\/?$/, '/') + href.replace(/^\//, '');
    }
    return withLang(resolved, window.AWGP_HELP_LANG || 'en');
  }

  function normalize(s) {
    return String(s || '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
  }

  function categoryTitle(id) {
    return t('categories.' + id, id);
  }

  function articlesLabel(count) {
    return t('chrome.articlesCount', count + ' Articles')
      .replace(/__COUNT__/g, String(count))
      .replace(/\{\{count\}\}/g, String(count));
  }

  function renderCategoryGrid(container) {
    if (!container) return;
    container.innerHTML = data.categories
      .map(function (cat) {
        const count = data.articles.filter(function (a) {
          return a.categoryId === cat.id;
        }).length;
        return (
          '<a class="category-card" href="' +
          resolveHref(cat.href) +
          '">' +
          '<span class="category-emoji">' +
          cat.emoji +
          '</span>' +
          '<span class="category-title">' +
          categoryTitle(cat.id) +
          '</span>' +
          '<span class="category-count">' +
          articlesLabel(count) +
          '</span>' +
          '</a>'
        );
      })
      .join('');
  }

  function renderSuggested(container) {
    if (!container) return;
    container.innerHTML = data.suggested
      .map(function (item) {
        return (
          '<a class="suggested-item" href="' +
          resolveHref(item.href) +
          '">' +
          t('suggested.' + item.id, item.id) +
          '</a>'
        );
      })
      .join('');
  }

  function setupSearch() {
    const input = document.getElementById('help-search');
    const results = document.getElementById('search-results');
    if (!input || !results) return;

    function closeResults() {
      results.classList.remove('open');
      results.innerHTML = '';
    }

    function openResults(html) {
      results.innerHTML = html;
      results.classList.add('open');
    }

    input.addEventListener('input', function () {
      const q = normalize(input.value.trim());
      if (q.length < 2) {
        closeResults();
        return;
      }

      const matches = data.articles
        .filter(function (article) {
          const title = t('articles.' + article.id, article.id);
          const category = categoryTitle(article.categoryId);
          const hay = normalize(title + ' ' + category);
          return hay.indexOf(q) !== -1;
        })
        .slice(0, 8);

      if (!matches.length) {
        openResults(
          '<div class="search-empty">' +
            t('chrome.searchEmpty', 'No articles found. Try different keywords.') +
            '</div>'
        );
        return;
      }

      openResults(
        matches
          .map(function (article) {
            return (
              '<a class="search-result" href="' +
              resolveHref(article.href) +
              '">' +
              '<div class="search-result-title">' +
              t('articles.' + article.id, article.id) +
              '</div>' +
              '<div class="search-result-meta">' +
              categoryTitle(article.categoryId) +
              '</div>' +
              '</a>'
            );
          })
          .join('')
      );
    });

    input.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeResults();
    });

    document.addEventListener('click', function (e) {
      if (!results.contains(e.target) && e.target !== input) {
        closeResults();
      }
    });
  }

  function bootHub() {
    renderCategoryGrid(document.getElementById('category-grid'));
    renderSuggested(document.getElementById('suggested-list'));
    setupSearch();
  }

  if (document.getElementById('category-grid') || document.getElementById('suggested-list')) {
    if (window.AWGP_HELP_t) {
      bootHub();
    } else {
      document.addEventListener('awgp-help-i18n-ready', bootHub);
    }
  }
})();
