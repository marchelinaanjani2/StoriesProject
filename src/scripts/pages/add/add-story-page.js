import { initStoryMap } from '../../components/story-map';
import StoryApi from '../../data/api';
import { showFormattedDate } from '../../utils';

const AddStoryPage = {
  async render() {
    console.log('=== RENDER START ===');

    const html = `
      <section id="add-story" class="page" style="padding: 20px; max-width: 800px; margin: 0 auto;">
        <h2 style="color: #333; margin-bottom: 20px;">
          <i class="fas fa-plus-circle"></i> Tambah Cerita Baru
        </h2>
        
        <div class="success-message" id="success-message" style="display: none; background: #d4edda; color: #155724; padding: 12px; border-radius: 4px; margin-bottom: 15px;">
          <i class="fas fa-check-circle"></i> <span id="success-text">Cerita berhasil ditambahkan!</span>
        </div>
        
        <div class="error-message" id="error-message" style="display: none; background: #f8d7da; color: #721c24; padding: 12px; border-radius: 4px; margin-bottom: 15px;">
          <i class="fas fa-exclamation-triangle"></i> <span id="error-text">Terjadi kesalahan saat menambahkan cerita.</span>
        </div>

        <form id="story-form" style="background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <div style="margin-bottom: 20px;">
            <label for="story-name" style="display: block; margin-bottom: 8px; font-weight: bold;">
              <i class="fas fa-heading"></i> Judul Cerita *
            </label>
            <input 
              type="text" 
              id="story-name" 
              name="name" 
              required 
              style="width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 4px; font-size: 16px;"
              placeholder="Masukkan judul cerita Anda"
            >
            <small style="color: #666; font-size: 14px;">Masukkan judul yang menarik untuk cerita Anda</small>
          </div>

          <div style="margin-bottom: 20px;">
            <label for="story-description" style="display: block; margin-bottom: 8px; font-weight: bold;">
              <i class="fas fa-align-left"></i> Deskripsi Cerita *
            </label>
            <textarea 
              id="story-description" 
              name="description" 
              required 
              rows="4"
              style="width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 4px; font-size: 16px; resize: vertical;"
              placeholder="Ceritakan pengalaman Anda dengan detail"
            ></textarea>
            <small style="color: #666; font-size: 14px;">Ceritakan pengalaman Anda dengan detail</small>
          </div>

          <div style="margin-bottom: 20px; border: 1px solid #eee; padding: 15px; border-radius: 4px;">
            <h3 style="margin: 0 0 15px 0; color: #333;">
              <i class="fas fa-camera"></i> Ambil Foto
            </h3>
            <video 
              id="video" 
              autoplay 
              muted 
              style="width: 100%; max-width: 400px; height: auto; border: 1px solid #ddd; border-radius: 4px; display: block; margin-bottom: 10px;"
            ></video>
            <canvas id="canvas" style="display: none;"></canvas>
            
            <div style="margin-bottom: 10px;">
              <button type="button" id="start-camera" style="margin-right: 10px; padding: 8px 16px; background: #28a745; color: white; border: none; border-radius: 4px; cursor: pointer;">
                <i class="fas fa-video"></i> Mulai Kamera
              </button>
              <button type="button" id="capture-photo" disabled style="margin-right: 10px; padding: 8px 16px; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer;">
                <i class="fas fa-camera"></i> Ambil Foto
              </button>
              <button type="button" id="stop-camera" disabled style="padding: 8px 16px; background: #dc3545; color: white; border: none; border-radius: 4px; cursor: pointer;">
                <i class="fas fa-stop"></i> Hentikan Kamera
              </button>
            </div>
            
            <div id="photo-preview" style="display: none; margin-top: 10px;">
              <img id="preview-image" style="max-width: 100%; height: auto; border: 1px solid #ddd; border-radius: 4px;">
            </div>
          </div>

          <div style="margin-bottom: 20px;">
            <label style="display: block; margin-bottom: 8px; font-weight: bold;">
              <i class="fas fa-map-marker-alt"></i> Pilih Lokasi di Peta
            </label>
            <div 
              id="map" 
              style="height: 400px; border: 1px solid #ddd; border-radius: 4px; background: #f8f9fa;"
            ></div>
            <p id="selected-location" style="margin-top: 8px; color: #666; font-size: 14px;">
              Klik pada peta untuk memilih lokasi
            </p>
          </div>

          <button type="submit" style="width: 100%; padding: 12px; background: #007bff; color: white; border: none; border-radius: 4px; font-size: 16px; cursor: pointer;">
            <i class="fas fa-paper-plane"></i> Kirim Cerita
          </button>
        </form>
      </section>
    `;

    console.log('=== RENDER HTML LENGTH ===', html.length);
    console.log('=== RENDER END ===');

    return html;
  },

  async afterRender() {
    console.log('=== AFTER RENDER START ===');

    // Check if page is actually rendered
    const addStorySection = document.getElementById('add-story');
    console.log('=== ADD STORY SECTION ===', addStorySection);

    if (!addStorySection) {
      console.error('ADD STORY SECTION NOT FOUND!');
      return;
    }

    const form = document.getElementById('story-form');
    console.log('=== FORM ELEMENT ===', form);

    if (!form) {
      console.error('FORM NOT FOUND!');
      return;
    }

    // Get all elements
    const video = document.getElementById('video');
    const canvas = document.getElementById('canvas');
    const startBtn = document.getElementById('start-camera');
    const captureBtn = document.getElementById('capture-photo');
    const stopBtn = document.getElementById('stop-camera');
    const successMessage = document.getElementById('success-message');
    const errorMessage = document.getElementById('error-message');
    const photoPreview = document.getElementById('photo-preview');
    const previewImage = document.getElementById('preview-image');

    console.log('=== DOM ELEMENTS CHECK ===', {
      video: !!video,
      canvas: !!canvas,
      startBtn: !!startBtn,
      captureBtn: !!captureBtn,
      stopBtn: !!stopBtn,
      successMessage: !!successMessage,
      errorMessage: !!errorMessage
    });

    let currentStream = null;
    let capturedPhoto = null;
    let selectedLat = null;
    let selectedLon = null;

    // Initialize map
    console.log('=== INITIALIZING MAP ===');
    try {
      const mapElement = document.getElementById('map');
      console.log('=== MAP ELEMENT ===', mapElement);

      if (!mapElement) {
        throw new Error('Map element not found');
      }

      const map = initStoryMap('map', (lat, lng) => {
        console.log('=== LOCATION SELECTED ===', { lat, lng });
        selectedLat = lat;
        selectedLon = lng;
        const locationElement = document.getElementById('selected-location');
        if (locationElement) {
          locationElement.textContent = `Lokasi terpilih: ${lat.toFixed(6)}, ${lng.toFixed(6)}`;
          locationElement.style.color = '#28a745';
          locationElement.style.fontWeight = 'bold';
        }
      });

      console.log('=== MAP INITIALIZED ===', map);
    } catch (error) {
      console.error('=== MAP INITIALIZATION ERROR ===', error);
      showError('Gagal memuat peta: ' + error.message);
    }

    // Camera controls
    if (startBtn) {
      startBtn.addEventListener('click', async () => {
        console.log('=== START CAMERA CLICKED ===');
        try {
          currentStream = await navigator.mediaDevices.getUserMedia({
            video: { width: 640, height: 480 }
          });
          video.srcObject = currentStream;
          startBtn.disabled = true;
          captureBtn.disabled = false;
          stopBtn.disabled = false;
          console.log('=== CAMERA STARTED ===');
        } catch (error) {
          console.error('=== CAMERA ERROR ===', error);
          showError('Gagal mengakses kamera: ' + error.message);
        }
      });
    }

    if (captureBtn) {
      captureBtn.addEventListener('click', () => {
        console.log('=== CAPTURE PHOTO CLICKED ===');
        try {
          const context = canvas.getContext('2d');
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          context.drawImage(video, 0, 0);

          const dataURL = canvas.toDataURL('image/jpeg', 0.8);
          previewImage.src = dataURL;
          photoPreview.style.display = 'block';

          canvas.toBlob((blob) => {
            capturedPhoto = new File([blob], 'photo.jpg', { type: 'image/jpeg' });
            showSuccess('Foto berhasil diambil!');
            console.log('=== PHOTO CAPTURED ===');
          }, 'image/jpeg', 0.8);
        } catch (error) {
          console.error('=== CAPTURE ERROR ===', error);
          showError('Gagal mengambil foto: ' + error.message);
        }
      });
    }

    if (stopBtn) {
      stopBtn.addEventListener('click', () => {
        console.log('=== STOP CAMERA CLICKED ===');
        if (currentStream) {
          currentStream.getTracks().forEach(track => track.stop());
          currentStream = null;
          video.srcObject = null;
          startBtn.disabled = false;
          captureBtn.disabled = true;
          stopBtn.disabled = true;
          console.log('=== CAMERA STOPPED ===');
        }
      });
    }

    // Form submission
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      console.log('=== FORM SUBMITTED ===');

      const description = document.getElementById('story-description')?.value;

      if (!description) {
        showError('Harap isi deskripsi cerita');
        return;
      }

      if (!capturedPhoto) {
        showError('Harap ambil foto terlebih dahulu');
        return;
      }

      try {
        showSuccess('Mengirim cerita...');

        await StoryApi.addStory({
          description,
          photo: capturedPhoto,
          lat: selectedLat,
          lon: selectedLon
        });

        showSuccess('Cerita berhasil ditambahkan!');

        // Reset form
        form.reset();
        capturedPhoto = null;
        selectedLat = null;
        selectedLon = null;
        photoPreview.style.display = 'none';

        setTimeout(() => {
          window.location.hash = '#/';
        }, 2000);

      } catch (error) {
        console.error('=== SUBMIT ERROR ===', error);
        showError('Gagal menambah cerita: ' + error.message);
      }
    });

    function showSuccess(message) {
      console.log('=== SHOW SUCCESS ===', message);
      if (successMessage) {
        document.getElementById('success-text').textContent = message;
        successMessage.style.display = 'block';
        if (errorMessage) errorMessage.style.display = 'none';
      }
    }

    function showError(message) {
      console.log('=== SHOW ERROR ===', message);
      if (errorMessage) {
        document.getElementById('error-text').textContent = message;
        errorMessage.style.display = 'block';
        if (successMessage) successMessage.style.display = 'none';
      }
    }

    console.log('=== AFTER RENDER END ===');
  }
};

export default AddStoryPage;