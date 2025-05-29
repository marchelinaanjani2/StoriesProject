export function showFormattedDate(date, locale = 'en-US', options = {}) {
  return new Date(date).toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    ...options,
  });
}

export function sleep(time = 1000) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

export function showLoading() {
  document.getElementById('loading').style.display = 'block';
}

export function hideLoading() {
  document.getElementById('loading').style.display = 'none';
}

export function showSuccess(message) {
  const element = document.getElementById('success-message');
  if (element) {
    element.textContent = message;
    element.style.display = 'block';
    setTimeout(() => {
      element.style.display = 'none';
    }, 5000);
  }
}

export function showError(message) {
  const element = document.getElementById('error-message');
  if (element) {
    element.textContent = message;
    element.style.display = 'block';
    setTimeout(() => {
      element.style.display = 'none';
    }, 5000);
  }
}