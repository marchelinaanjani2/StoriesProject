export const createStoryCard = (story) => {
  return `
    <article class="story-card">
      <img src="${story.photoUrl}" alt="${story.name}" class="story-image" loading="lazy">
      <div class="story-content">
        <h3 class="story-title">${story.name}</h3>
        <p class="story-description">${story.description}</p>
        <div class="story-meta">
          <div class="story-location">
            <i class="fas fa-map-marker-alt"></i>
            <span>${story.lat ? `${story.lat.toFixed(4)}, ${story.lon.toFixed(4)}` : 'No location'}</span>
          </div>
          <time datetime="${story.createdAt}">
            ${new Date(story.createdAt).toLocaleDateString('id-ID')}
          </time>
        </div>
      </div>
    </article>
  `;
};