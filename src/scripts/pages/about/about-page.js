const AboutPage = {
  async render() {
    return `
      <section class="page">
        <h2>Tentang Kami</h2>
        <p>Aplikasi Berbagi Cerita adalah platform untuk berbagi pengalaman dan cerita menarik dari berbagai tempat di dunia.</p>
      </section>
    `;
  },

  async afterRender() {
    // Initialization if needed
  }
};

export default AboutPage;
