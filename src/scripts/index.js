import '../styles/styles.css';
import routes from './routes/routes';
import { matchRoute } from './routes/url-parser';
import { showLoading, hideLoading } from './utils';
import { subscribePush, unsubscribePush } from './pushHelper.js';
import { setupStoryForm } from './storyController.js';
import { openDatabase, saveStory, getAllStories } from './idbHelper.js';



const vapidPublicKey = 'BCCs2eonMI-6H2ctvFaWg-UYdDv387Vno_bzUzALpB442r2lCnsHmtrx8biyPi_E-1fSGABK_Qs_GlvPoJJqxbk';

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

async function registerPush() {
  if ('serviceWorker' in navigator && 'PushManager' in window) {
    const swReg = await navigator.serviceWorker.register('/sw.js');
    console.log('Service Worker Registered');

    const subscription = await swReg.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(vapidPublicKey),
    });

    console.log('Push subscribed:', JSON.stringify(subscription));

  }
}

registerPush()

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+').replace(/_/g, '/');
  const raw = atob(base64);
  return new Uint8Array([...raw].map(c => c.charCodeAt(0)));
}
document.addEventListener('DOMContentLoaded', () => {
  new App();
  setupStoryForm();
  if ('serviceWorker' in navigator && 'PushManager' in window) {
    document.getElementById('btn-subscribe').addEventListener('click', subscribePush);
    document.getElementById('btn-unsubscribe').addEventListener('click', unsubscribePush);
  } else {
    alert('Push notification tidak didukung di browser ini.');
  }
});

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js').then(() => {
    console.log('✅ Service Worker registered');
  });
}

// Event beforeinstallprompt
let deferredPrompt;

window.addEventListener('beforeinstallprompt', (e) => {
  console.log('✅ beforeinstallprompt triggered');
  e.preventDefault();
  deferredPrompt = e;

  // Tampilkan tombol
  const installBtn = document.getElementById('install-btn');
  if (installBtn) {
    installBtn.style.display = 'block';

    installBtn.addEventListener('click', async () => {
      installBtn.style.display = 'none';
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      console.log(`User ${outcome === 'accepted' ? 'accepted' : 'dismissed'} install`);
      deferredPrompt = null;
    });
  }
});

// Cek apakah sudah diinstall
window.addEventListener('appinstalled', () => {
  console.log('🎉 App installed!');
  document.getElementById('install-btn').style.display = 'none';
});


try {
    const db = await openDatabase();
    console.log('IndexedDB opened:', db);

    // Simpan story dummy buat trigger muncul
    const id = await saveStory({
      title: "Tes Achel",
      content: "Ini cerita test IndexedDB",
      date: new Date().toISOString()
    });

    console.log('Story saved with id:', id);

    // Cek apakah berhasil disimpan
    const all = await getAllStories();
    console.log('Semua story:', all);
  } catch (e) {
    console.error('Gagal inisialisasi IndexedDB:', e);
  }



