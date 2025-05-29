import { saveStory, getAllStories, deleteStory } from './idbHelper.js';

export function setupStoryForm() {
  const form = document.getElementById('addStoryForm');
  const storyList = document.getElementById('storyList');

  if (!form || !storyList) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const title = form.title.value.trim();
    const content = form.content.value.trim();

    if (!title || !content) return;

    const newStory = { title, content, date: new Date().toISOString() };
    await saveStory(newStory);

    form.reset();
    loadStories();
  });

  async function loadStories() {
    const stories = await getAllStories();
    storyList.innerHTML = '';

    if (stories.length === 0) {
      storyList.innerHTML = '<p>Belum ada cerita disimpan.</p>';
      return;
    }

    stories.forEach((story) => {
      const storyEl = document.createElement('div');
      storyEl.classList.add('story-item');
      storyEl.innerHTML = `
        <h3>${story.title}</h3>
        <p>${story.content}</p>
        <small>${new Date(story.date).toLocaleString()}</small><br>
        <button data-id="${story.id}" class="delete-btn">🗑 Hapus</button>
      `;
      storyList.appendChild(storyEl);
    });

    document.querySelectorAll('.delete-btn').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        const id = parseInt(e.target.dataset.id);
        await deleteStory(id);
        loadStories();
      });
    });
  }

  // load saat awal
  loadStories();
}
