import HomePage from '../pages/home/home-page.js';
import DetailPage from '../pages/detail/detail-page.js';
import AddStoryPage from '../pages/add/add-story-page.js';
import { matchRoute } from '../routes/url-parser';

const routes = {
  '': HomePage,
  '/': HomePage,
  '/detail/:id': DetailPage,
  '/add': AddStoryPage,
};

class App {
  constructor() {
    this.content = document.getElementById('main-content');
    this.setupRouter();
    this.setupNavigation();
    this.renderPage();
  }

  setupRouter() {
    window.addEventListener('load', () => {
      this.renderPage();
    });

    window.addEventListener('hashchange', () => {
      this.renderPage();
    });
  }

  setupNavigation() {
    // Pasang event klik untuk link navigasi supaya update hash tanpa reload halaman
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const path = e.currentTarget.getAttribute('href').replace('#', '');
        window.location.hash = path;
      });
    });
  }

  updateActiveNavLink(currentPath) {
    document.querySelectorAll('.nav-link').forEach(link => {
      const linkPath = link.getAttribute('href').replace('#', '');
      link.classList.toggle('active',
        linkPath === currentPath ||
        (currentPath === '/' && (linkPath === '' || linkPath === '/'))
      );
    });
  }

  async renderPage() {
    try {
      const path = window.location.hash.substring(1) || '/';
      const { page, params } = matchRoute(path, routes);

      console.log('Rendering page:', path, page);

      if (!page) {
        throw new Error('Page not found');
      }

      const html = await page.render(params);
      console.log('HTML from render:', html);

      this.content.innerHTML = html;

      await page.afterRender(params);
      console.log('afterRender done');

      this.updateActiveNavLink(path);
    } catch (error) {
      console.error('Render error:', error);
      this.content.innerHTML = '<h2>Error loading page</h2>';
    }
  }
}

export default App;
