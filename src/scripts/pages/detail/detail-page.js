import StoryApi from '../../data/api';
import { showFormattedDate } from '../../utils';

const DetailStoryPage = {
  async render() {
    return `
      <section class="page">
        <div id="story-detail-container">
          <div class="loading">
            <div class="spinner"></div>
            <p>Memuat cerita...</p>
          </div>
        </div>
      </section>
    `;
  },

  async afterRender() {
    const container = document.getElementById('story-detail-container');
    
    try {
      // Get story ID from URL
      const urlParams = new URLSearchParams(window.location.search);
      const id = urlParams.get('id');
      
      if (!id) {
        throw new Error('ID cerita tidak ditemukan');
      }

      // Fetch story detail
      const story = await StoryApi.getStoryById(id);
      
      container.innerHTML = `
        <article class="story-detail">
          <img src="${story.photoUrl}" alt="${story.name}" class="story-image">
          <div class="story-content">
            <h1 class="story-title">${story.name}</h1>
            <div class="story-meta">
              <div class="story-location">
                <i class="fas fa-map-marker-alt"></i>
                <span>${story.lat ? `${story.lat.toFixed(4)}, ${story.lon.toFixed(4)}` : 'No location'}</span>
              </div>
              <time datetime="${story.createdAt}">
                ${showFormattedDate(story.createdAt, 'id-ID')}
              </time>
            </div>
            <div class="story-description">${story.description}</div>
          </div>
        </article>
      `;
    } catch (error) {
      container.innerHTML = `
        <div class="error-message">
          <i class="fas fa-exclamation-triangle"></i>
          <p>${error.message}</p>
        </div>
      `;
    }
  }
};

export default DetailStoryPage;