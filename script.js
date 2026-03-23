/* ══════════════════════════════════════════
   TELEGRAM BOT — НАСТРОЙКИ
   1. Вставьте токен бота (от @BotFather)
   2. Добавьте Chat ID всех получателей в массив TG_CHATS
   Как узнать Chat ID: напишите боту @userinfobot
════════════════════════════════════════════ */
const TG_TOKEN = '8612202761:AAEv3tNyxsW9QKvumVnNnmVTWw9N8j4zjOQ';

// Добавьте сюда Chat ID всех кто должен получать заявки:
const TG_CHATS = [
  '859042885',   // Получатель 1 (текущий)
  // '123456789', // Получатель 2 — раскомментируйте и вставьте Chat ID
  // '987654321', // Получатель 3 — раскомментируйте и вставьте Chat ID
];

async function sendToTelegram(name, phone, source) {
  // Номер заявки из timestamp
  const num = String(Date.now()).slice(-4);

  // Дата и время
  const now = new Date();
  const time = now.toLocaleTimeString('ru-RU', {hour:'2-digit', minute:'2-digit'});
  const date = now.toLocaleDateString('ru-RU', {day:'2-digit', month:'2-digit', year:'numeric'});

  const text =
    `📥 Новая заявка #${num}\n` +
    `👤 Имя: ${name || '—'}\n` +
    `📞 Телефон: ${phone}\n` +
    `🕐 Время: ${time}, ${date}\n` +
    `🖥 Источник: ${source}`;

  const url = `https://api.telegram.org/bot${TG_TOKEN}/sendMessage`;
  try {
    await Promise.all(TG_CHATS.map(chatId =>
      fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text: text,
          parse_mode: 'HTML'
        })
      })
    ));
  } catch (err) {
    console.error('Ошибка отправки в Telegram:', err);
  }
}

/* ── NAVIGATION ── */
function toggleNav() {
  const nav = document.getElementById('main-nav');
  nav.classList.toggle('open');
}
function closeNav() {
  document.getElementById('main-nav').classList.remove('open');
}

/* ── MODAL ── */
function openModal() {
  document.getElementById('modalOverlay').classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeModal() {
  document.getElementById('modalOverlay').classList.remove('open');
  document.body.style.overflow = '';
  document.getElementById('modalFormOk').style.display = 'none';
}
document.getElementById('modalOverlay').addEventListener('click', function(e) {
  if (e.target === this) closeModal();
});
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') closeModal();
});

/* ── FORMS ── */
function submitForm(e) {
  e.preventDefault();
  const name  = e.target.querySelector('[name="name"]') ? e.target.querySelector('[name="name"]').value : '';
  const phone = e.target.querySelector('[name="phone"]') ? e.target.querySelector('[name="phone"]').value : '';

  sendToTelegram(name, phone, 'Основная форма');

  const ok = document.getElementById('mainFormOk');
  ok.style.display = 'block';
  e.target.reset();
  setTimeout(() => { ok.style.display = 'none'; }, 6000);
}

function submitModal(e) {
  e.preventDefault();
  const name  = e.target.querySelector('[name="name"]') ? e.target.querySelector('[name="name"]').value : '';
  const phone = e.target.querySelector('[name="phone"]') ? e.target.querySelector('[name="phone"]').value : '';

  sendToTelegram(name, phone, 'Всплывающая форма');

  const ok = document.getElementById('modalFormOk');
  ok.style.display = 'block';
  e.target.reset();
  setTimeout(() => { closeModal(); }, 3000);
}

/* ── ANIMATED COUNTERS ── */
function animateCounters() {
  document.querySelectorAll('.stat-num[data-target]').forEach(el => {
    const target = +el.dataset.target;
    const suffix = el.dataset.suffix || '';
    let current = 0;
    const step = target / 60;
    const timer = setInterval(() => {
      current = Math.min(current + step, target);
      el.textContent = Math.round(current) + suffix;
      if (current >= target) clearInterval(timer);
    }, 25);
  });
}

/* ── INTERSECTION OBSERVER ── */
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      if (entry.target.id === 'stats') animateCounters();
    }
  });
}, { threshold: 0.3 });
document.querySelectorAll('#stats').forEach(s => observer.observe(s));

/* ══ SCROLL REVEAL — runs after DOM is ready ══ */
document.addEventListener('DOMContentLoaded', function() {
  var revealObserver = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });

  document.querySelectorAll('.reveal, .reveal-group, .section-line').forEach(function(el) {
    revealObserver.observe(el);
  });

  /* Parallax + active nav */
  window.addEventListener('scroll', function() {
    var hero = document.getElementById('hero');
    var scroll = window.pageYOffset;
    if (hero && scroll < window.innerHeight) {
      hero.style.backgroundPositionY = (scroll * 0.3) + 'px';
    }
    var sections = ['about','services','stats','compare','advantages','legal','contact'];
    var links = document.querySelectorAll('nav a');
    var current = '';
    sections.forEach(function(id) {
      var sec = document.getElementById(id);
      if (sec && sec.getBoundingClientRect().top <= 130) current = id;
    });
    links.forEach(function(link) {
      link.style.color = (link.getAttribute('href') === '#' + current) ? 'var(--acc)' : '';
      link.style.borderBottomColor = (link.getAttribute('href') === '#' + current) ? 'var(--acc)' : 'transparent';
    });
  }, { passive: true });
});
