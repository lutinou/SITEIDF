// Menu burger
const burger = document.querySelector('.burger');
const nav = document.querySelector('.nav');
const menu = document.getElementById('menu');
if (burger && nav && menu) {
  burger.addEventListener('click', () => {
    const expanded = burger.getAttribute('aria-expanded') === 'true';
    burger.setAttribute('aria-expanded', String(!expanded));
    nav.classList.toggle('open');
  });
  menu.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      burger.setAttribute('aria-expanded', 'false');
      nav.classList.remove('open');
    });
  });
}

// Année pied de page
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// Validation email (mailto:)
const form = document.getElementById('contactForm');
if (form) {
  form.addEventListener('submit', (e) => {
    const email = document.getElementById('email');
    if (!email.checkValidity()) {
      e.preventDefault();
      email.focus();
      alert('Merci de saisir un e-mail valide.');
    }
  });
}

// --- Avis Google (depuis assets/reviews.json) ---
const track = document.getElementById('reviewsTrack');
const googleReviewsLink = document.getElementById('googleReviewsLink');

if (track) {
  fetch('assets/reviews.json')
    .then(r => r.json())
    .then(data => {
      if (googleReviewsLink && data.placeUrl) googleReviewsLink.href = data.placeUrl;
      const reviews = (data.reviews || []).slice(0, 30);
      if (!reviews.length) {
        track.innerHTML = '<p class="muted">Ajoutez vos avis dans <code>assets/reviews.json</code>.</p>';
        return;
      }
      track.innerHTML = reviews.map(r => `
        <article class="review-card">
          <div class="review-head">
            <span class="review-author">${escapeHtml(r.author || 'Anonyme')}</span>
            <span class="review-stars">${'★'.repeat(Math.round(r.rating || 5))}</span>
          </div>
          <p>${escapeHtml(r.text || '').slice(0, 300)}${(r.text || '').length > 300 ? '…' : ''}</p>
          <p class="muted">${r.time ? new Date(r.time).toLocaleDateString('fr-FR') : ''}</p>
        </article>
      `).join('');
    })
    .catch(() => {
      track.innerHTML = '<p class="muted">Impossible de charger les avis.</p>';
    });

  // Boutons slider
  document.querySelectorAll('.rev-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const dir = btn.dataset.dir === 'next' ? 1 : -1;
      const card = track.querySelector('.review-card');
      const amount = card ? (card.getBoundingClientRect().width + 16) : 300;
      track.scrollBy({ left: dir * amount, behavior: 'smooth' });
    });
  });

  // Auto-défilement toutes les 5s
  let autoScroll = setInterval(() => {
    const card = track && track.querySelector('.review-card');
    if (!track || !card) return;
    const amount = card.getBoundingClientRect().width + 16;
    track.scrollBy({ left: amount, behavior: 'smooth' });
  }, 5000);
  window.addEventListener('blur', () => clearInterval(autoScroll));
}

// Sécurité XSS basique pour le contenu des avis
function escapeHtml(str) {
  return String(str)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}
