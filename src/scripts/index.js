import '../styles/styles.css';
import routes from './routes/routes';
import { matchRoute } from './routes/url-parser';
import { showLoading, hideLoading } from './utils';

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
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const path = e.target.getAttribute('href').replace('#', '');
        window.location.hash = path;
      });
    });
  }

  async renderPage() {
    try {
      showLoading();

      const path = window.location.hash.substring(1) || '/';
      console.log('[DEBUG] Current path:', path);

      const { page, params } = matchRoute(path, routes);
      console.log('[DEBUG] Matched page:', page);
      console.log('[DEBUG] Params:', params);

      if (!page) {
        throw new Error('Halaman tidak ditemukan');
      }

      this.content.innerHTML = await page.render();
      await page.afterRender();

      this.updateActiveNavLink(path);
    } catch (error) {
      console.error('Error render:', error);
      this.content.innerHTML = `
        <section class="page">
          <h2>Terjadi Kesalahan</h2>
          <p>${error.message}</p>
        </section>
      `;
    } finally {
      hideLoading();
    }
  }

  updateActiveNavLink(currentPath) {
    document.querySelectorAll('.nav-link').forEach(link => {
      const linkPath = link.getAttribute('href').replace('#', '');
      link.classList.toggle('active',
        linkPath === currentPath ||
        (currentPath === '/' && linkPath === '/home'));
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new App();
});