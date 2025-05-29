import { createStoryCard } from '../../components/story-card';
import StoryApi from '../../data/api';

const HomePage = {
  async render() {
    return `
    <section id="home" class="page">
      <div class="hero">
        <h1>Berbagi Cerita</h1>
        <p>Platform untuk berbagi pengalaman dan cerita menarik dari berbagai tempat di dunia</p>
        <a href="#/" class="cta-button">
          <i class="fas fa-compass"></i> Jelajahi Cerita
        </a>
      </div>
      <div id="stories-container" class="story-list"></div>
    </section>
  `;
  },

  async afterRender() {
    const container = document.getElementById('stories-container');
    try {
      const stories = await StoryApi.getAllStories();
      container.innerHTML = stories.map(story => createStoryCard(story)).join('');
    } catch (error) {
      console.error('Failed to load stories:', error);
      container.innerHTML = `
        <div class="error-message">
          <i class="fas fa-exclamation-triangle"></i>
          <p>Gagal memuat cerita: ${error.message}</p>
        </div>
      `;
    }
  }
};

export default HomePage;
