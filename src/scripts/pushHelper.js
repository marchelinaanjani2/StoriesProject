import CONFIG from './config';

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = atob(base64);
  return Uint8Array.from([...rawData].map(char => char.charCodeAt(0)));
}

const vapidPublicKey = 'BCCs2eonMI-6H2ctvFaWg-UYdDv387Vno_bzUzALpB442r2lCnsHmtrx8biyPi_E-1fSGABK_Qs_GlvPoJJqxbk';

export async function subscribePush() {
  const permission = await Notification.requestPermission();
   if (Notification.permission === 'denied') {
    alert('Please enable notifications in browser settings first');
    return;
  }

  const sw = await navigator.serviceWorker.register('/sw.js');
  const subscription = await sw.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(vapidPublicKey),
  });

  const body = {
    endpoint: subscription.endpoint,
    keys: {
      p256dh: btoa(String.fromCharCode(...new Uint8Array(subscription.getKey('p256dh')))),
      auth: btoa(String.fromCharCode(...new Uint8Array(subscription.getKey('auth')))),
    },
  };

  try {
    const response = await fetch(`${CONFIG.BASE_URL}/notifications/subscribe`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${CONFIG.API_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const json = await response.json();

    console.log('📨 Subscribe');
    console.log('URL: /notifications/subscribe');
    console.log('Method: POST');
    console.log('Request Body:', body);
    console.log('Response:', json);

    alert(json.message || 'Notifikasi berhasil diaktifkan!');
  } catch (err) {
    console.error('❌ Gagal subscribe push notification', err);
    alert('Gagal mengaktifkan notifikasi.');
  }
}

export async function unsubscribePush() {
  const sw = await navigator.serviceWorker.ready;
  const subscription = await sw.pushManager.getSubscription();

  if (!subscription) {
    alert('Kamu belum berlangganan notifikasi.');
    return;
  }

  const body = { endpoint: subscription.endpoint };

  try {
    const response = await fetch(`${CONFIG.BASE_URL}/notifications/subscribe`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${CONFIG.API_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ endpoint: subscription.endpoint }),
    });

    const json = await response.json();

    await subscription.unsubscribe();

    console.log('🔕 Unsubscribe');
    console.log('URL: /notifications/subscribe');
    console.log('Method: DELETE');
    console.log('Request Body:', body);
    console.log('Response:', json);

    alert(json.message || 'Notifikasi berhasil dinonaktifkan!');
  } catch (err) {
    console.error('❌ Gagal unsubscribe push notification', err);
    alert('Gagal menonaktifkan notifikasi.');
  }
}
