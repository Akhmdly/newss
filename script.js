const logo = document.querySelector('.logo');
const searchForm = document.querySelector('.search-form');
const searchInput = document.querySelector('.search-input');
const aboutLinks = document.querySelectorAll('.about-link, .about-link-footer');
const contactLinks = document.querySelectorAll('.contact-link, .contact-link-footer');
const categorySelect = document.querySelector('.category-select');

const newsContainer = document.querySelector('.news-container');
const infoContainer = document.querySelector('.info-container');
const paginationContainer = document.querySelector('.pagination-container');
const pageNumber = document.getElementById('page-number');
const prevPageBtn = document.getElementById('prev-page');
const nextPageBtn = document.getElementById('next-page');

const modal = document.querySelector('.modal');
const modalClose = document.querySelector('.modal-close');
const modalTitle = document.querySelector('.modal-title');
const modalImage = document.querySelector('.modal-image');
const modalDescription = document.querySelector('.modal-description');
const modalUrl = document.querySelector('.modal-url');

const scrollTopBtn = document.getElementById('scroll-top-btn');

let currentArticles = [];
let filteredArticles = [];
let currentQuery = "news";
let currentPage = 1;
const articlesPerPage = 12;

async function fetchNews(query = "news") {
  document.body.classList.remove('about-active', 'contact-active');
  infoContainer.style.display = 'none';
  newsContainer.style.display = 'grid';
  paginationContainer.style.display = 'flex';

  currentQuery = query;
  currentPage = 1;

  try {
    const url = `/news?q=${encodeURIComponent(query)}`;
    const res = await fetch(url);
    const data = await res.json();

    if (data.status !== 'ok') {
      newsContainer.innerHTML = `<p>Error: ${data.message}</p>`;
      paginationContainer.style.display = 'none';
      return;
    }

    currentArticles = data.articles;
    filteredArticles = currentArticles.filter(article =>
      article.title && article.description && article.urlToImage
    );
    displayNews();
  } catch (error) {
    newsContainer.innerHTML = `<p>Network error: ${error.message}</p>`;
    paginationContainer.style.display = 'none';
  }
}

function displayNews() {
  const totalPages = Math.ceil(filteredArticles.length / articlesPerPage);
  const start = (currentPage - 1) * articlesPerPage;
  const end = start + articlesPerPage;
  const paginatedArticles = filteredArticles.slice(start, end);

  newsContainer.innerHTML = '';

  if (paginatedArticles.length === 0) {
    newsContainer.innerHTML = '<p>No results found.</p>';
    paginationContainer.style.display = 'none';
    return;
  }

  paginatedArticles.forEach((article, index) => {
    const div = document.createElement('div');
    div.className = 'news-item';
    div.dataset.index = start + index;

    div.innerHTML = `
      <img src="${article.urlToImage || 'https://via.placeholder.com/400x200?text=No+Image'}" class="news-img" alt="News Image" />
      <div class="news-content">
        <h3>${article.title}</h3>
        <p>${article.description}</p>
        <p class="news-source">${article.source.name} - ${new Date(article.publishedAt).toLocaleString()}</p>
      </div>
    `;

    newsContainer.appendChild(div);
  });

  pageNumber.textContent = currentPage;
  prevPageBtn.disabled = currentPage === 1;
  nextPageBtn.disabled = currentPage === totalPages;
}

prevPageBtn.addEventListener('click', () => {
  if (currentPage > 1) {
    currentPage--;
    displayNews();
  }
});

nextPageBtn.addEventListener('click', () => {
  const totalPages = Math.ceil(filteredArticles.length / articlesPerPage);
  if (currentPage < totalPages) {
    currentPage++;
    displayNews();
  }
});

searchForm.addEventListener('submit', e => {
  e.preventDefault();
  const query = searchInput.value.trim();
  if (query) {
    fetchNews(query);
  }
});

categorySelect.addEventListener('change', () => {
  fetchNews(categorySelect.value);
});

newsContainer.addEventListener('click', e => {
  const item = e.target.closest('.news-item');
  if (!item) return;
  const idx = item.dataset.index;
  const article = filteredArticles[idx];
  modalTitle.textContent = article.title;
  modalImage.src = article.urlToImage || 'https://via.placeholder.com/600x300?text=No+Image';
  modalDescription.textContent = article.content || article.description || '';
  modalUrl.href = article.url;
  modal.style.display = 'flex';
});

modalClose.addEventListener('click', () => {
  modal.style.display = 'none';
});

modal.addEventListener('click', e => {
  if (e.target === modal) {
    modal.style.display = 'none';
  }
});

logo.addEventListener('click', () => {
  fetchNews('news');
});

aboutLinks.forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    newsContainer.style.display = 'none';
    paginationContainer.style.display = 'none';
    infoContainer.style.display = 'block';
    infoContainer.innerHTML = `<h2>About Us</h2><p>This is a simple news application using NewsAPI.</p>`;
    document.body.classList.add('about-active');
    document.body.classList.remove('contact-active');
  });
});

contactLinks.forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    newsContainer.style.display = 'none';
    paginationContainer.style.display = 'none';
    infoContainer.style.display = 'block';
    infoContainer.innerHTML = `<h2>Contact Us</h2><p>Email: support@newssite.com</p>`;
    document.body.classList.add('contact-active');
    document.body.classList.remove('about-active');
  });
});

window.addEventListener('scroll', () => {
  scrollTopBtn.style.display = window.scrollY > 300 ? 'flex' : 'none';
});

scrollTopBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

document.getElementById('current-year').textContent = new Date().getFullYear();

fetchNews('news');
