import CONFIG from '../config';

class StoryApi {
  static async getAllStories({ page = 1, size = 10, location = 0 } = {}) {
    const response = await fetch(`${CONFIG.BASE_URL}/stories?page=${page}&size=${size}&location=${location}`, {
      headers: {
        Authorization: `Bearer ${CONFIG.API_TOKEN}`,
        'Content-Type': 'application/json',
      },
    });
    const data = await response.json();
    if (!data.error) {
      return data.listStory;
    }
    throw new Error(data.message);
  }


  static async addStory({ description, photo, lat, lon }) {
    const formData = new FormData();
    formData.append('description', description);
    formData.append('photo', photo);
    if (lat) formData.append('lat', lat);
    if (lon) formData.append('lon', lon);

    const response = await fetch(`${CONFIG.BASE_URL}/stories/guest`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${CONFIG.API_TOKEN}`,
        
      },
      body: formData
    });

    const data = await response.json();
    if (!data.error) {
      return data;
    }
    throw new Error(data.message);
  }



  static async getStoryById(id) {
    const response = await fetch(`${CONFIG.BASE_URL}/stories/${id}`, {
      headers: {
        Authorization: `Bearer ${CONFIG.API_TOKEN}`,
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();
    if (!data.error) {
      return data.story;
    }
    throw new Error(data.message);
  }


}

export default StoryApi;