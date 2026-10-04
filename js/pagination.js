/* =========================================================
   SHOWCASE PAGINATION
   9 cards per page / 36 cards = 4 pages

   IMPORTANT:
   This file controls ONLY pagination + the showcase filters.
   It does not contain the mobile menu, modal, or reveal code.
   Those remain in script.js.
   ========================================================= */

(() => {
  'use strict';

  const CARDS_PER_PAGE = 9;

  const cards = Array.from(document.querySelectorAll('.work-card'));
  const filters = Array.from(document.querySelectorAll('.filter'));
  const pagination = document.querySelector('.pagination');

  // Stop safely if the required elements are not present.
  if (!pagination || !cards.length) {
    console.warn('Pagination: required elements were not found.');
    return;
  }

  let currentPage = 1;
  let currentFilter = 'all';

  /* ---------------------------------------------------------
     Return only the cards belonging to the current filter.
     --------------------------------------------------------- */
  function getFilteredCards() {
    return cards.filter(card => {
      const category = card.dataset.category || '';
      return currentFilter === 'all' || category === currentFilter;
    });
  }

  /* ---------------------------------------------------------
     Show only the 9 cards belonging to the current page.
     --------------------------------------------------------- */
  function renderCards() {
    const filteredCards = getFilteredCards();
    const start = (currentPage - 1) * CARDS_PER_PAGE;
    const end = start + CARDS_PER_PAGE;

    // Hide every card first.
    cards.forEach(card => card.classList.add('hidden'));

    // Then show only this page's cards.
    filteredCards.slice(start, end).forEach(card => {
      card.classList.remove('hidden');
    });
  }

  /* ---------------------------------------------------------
     Build the pagination controls.
     Example for 36 cards:
     ←  1  2  3  4  →
     --------------------------------------------------------- */
  function renderPagination() {
    const filteredCards = getFilteredCards();
    const totalPages = Math.ceil(filteredCards.length / CARDS_PER_PAGE);

    pagination.innerHTML = '';

    // If the selected category has 9 or fewer cards,
    // there is nothing to paginate.
    if (totalPages <= 1) {
      pagination.style.display = 'none';
      return;
    }

    pagination.style.display = 'flex';

    // Previous button
    const previous = document.createElement('button');
    previous.type = 'button';
    previous.className = 'pagination-arrow';
    previous.textContent = '←';
    previous.setAttribute('aria-label', 'Previous page');
    previous.disabled = currentPage === 1;

    previous.addEventListener('click', () => {
      if (currentPage <= 1) return;
      currentPage--;
      update();
      scrollToGrid();
    });

    pagination.appendChild(previous);

    // Page buttons
    for (let page = 1; page <= totalPages; page++) {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'pagination-page';
      button.textContent = page;
      button.setAttribute('aria-label', `Page ${page}`);

      if (page === currentPage) {
        button.classList.add('active');
        button.setAttribute('aria-current', 'page');
      }

      button.addEventListener('click', () => {
        if (currentPage === page) return;
        currentPage = page;
        update();
        scrollToGrid();
      });

      pagination.appendChild(button);
    }

    // Next button
    const next = document.createElement('button');
    next.type = 'button';
    next.className = 'pagination-arrow';
    next.textContent = '→';
    next.setAttribute('aria-label', 'Next page');
    next.disabled = currentPage === totalPages;

    next.addEventListener('click', () => {
      if (currentPage >= totalPages) return;
      currentPage++;
      update();
      scrollToGrid();
    });

    pagination.appendChild(next);
  }

  /* ---------------------------------------------------------
     Keep page number valid after a filter change.
     --------------------------------------------------------- */
  function update() {
    const totalPages = Math.max(
      1,
      Math.ceil(getFilteredCards().length / CARDS_PER_PAGE)
    );

    if (currentPage > totalPages) {
      currentPage = totalPages;
    }

    renderCards();
    renderPagination();
  }

  /* ---------------------------------------------------------
     Filter handling.
     Every filter starts from Page 1.
     --------------------------------------------------------- */
  filters.forEach(filterButton => {
    filterButton.addEventListener('click', () => {
      currentFilter = filterButton.dataset.filter || 'all';
      currentPage = 1;

      filters.forEach(button => {
        const isActive = button === filterButton;
        button.classList.toggle('active', isActive);
        button.setAttribute('aria-selected', isActive ? 'true' : 'false');
      });

      update();
    });
  });

  /* ---------------------------------------------------------
     Scroll back to the showcase grid after changing page.
     --------------------------------------------------------- */
  function scrollToGrid() {
    const grid = document.querySelector('.work-grid');
    if (!grid) return;

    const top = grid.getBoundingClientRect().top + window.scrollY - 110;
    window.scrollTo({ top, behavior: 'smooth' });
  }

  /* ---------------------------------------------------------
     INITIAL LOAD
     All → Page 1 → first 9 cards visible.
     --------------------------------------------------------- */
  update();

})();
