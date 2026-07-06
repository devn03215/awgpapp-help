(function () {
  const data = window.AWGP_HELP;
  if (!data) return;

  const root = document.documentElement;
  const basePath = root.getAttribute('data-base') || '';

  function resolveHref(href) {
    if (!href || href.startsWith('http') || href.startsWith('mailto:')) return href;
    if (basePath && !href.startsWith(basePath)) {
      return basePath.replace(/\/?$/, '/') + href.replace(/^\//, '');
    }
    return href;
  }

  function normalize(s) {
    return String(s || '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
  }

  function renderCategoryGrid(container) {
    if (!container) return;
    container.innerHTML = data.categories
      .map(function (cat) {
        const count = data.articles.filter(function (a) {
          return a.category === cat.title;
        }).length;
        return (
          '<a class="category-card" href="' +
          resolveHref(cat.href) +
          '">' +
          '<span class="category-emoji">' +
          cat.emoji +
          '</span>' +
          '<span class="category-title">' +
          cat.title +
          '</span>' +
          '<span class="category-count">' +
          count +
          ' Articles</span>' +
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
          item.title +
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
          const hay = normalize(article.title + ' ' + article.category);
          return hay.indexOf(q) !== -1;
        })
        .slice(0, 8);

      if (!matches.length) {
        openResults('<div class="search-empty">No articles found. Try different keywords.</div>');
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
              article.title +
              '</div>' +
              '<div class="search-result-meta">' +
              article.category +
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

  renderCategoryGrid(document.getElementById('category-grid'));
  renderSuggested(document.getElementById('suggested-list'));
  setupSearch();
})();
