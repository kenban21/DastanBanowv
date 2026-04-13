// ===== NOTE BURST ON CLICK =====
const NOTES = ['♩','♪','♫','♬','𝅘𝅥𝅮','🎵','🎶'];

document.addEventListener('click', e => {
  const count = 6;
  for (let i = 0; i < count; i++) {
    const el = document.createElement('span');
    el.className = 'note-burst';
    el.textContent = NOTES[Math.floor(Math.random() * NOTES.length)];

    const angle = (360 / count) * i + Math.random() * 20;
    const dist  = 50 + Math.random() * 50;
    const rad   = angle * Math.PI / 180;
    const tx    = Math.cos(rad) * dist + 'px';
    const ty    = Math.sin(rad) * dist + 'px';

    el.style.left = e.clientX + 'px';
    el.style.top  = e.clientY + 'px';
    el.style.setProperty('--tx', `calc(-50% + ${tx})`);
    el.style.setProperty('--ty', `calc(-50% + ${ty})`);
    el.style.fontSize = (0.9 + Math.random() * 0.7) + 'rem';
    el.style.color = Math.random() > 0.5 ? '#FF6A00' : '#ffffff';

    document.body.appendChild(el);
    setTimeout(() => el.remove(), 700);
  }
});


const toggle = document.getElementById('navToggle');
const navLinks = document.querySelector('.nav-links');

toggle?.addEventListener('click', () => {
  navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
  navLinks.style.flexDirection = 'column';
  navLinks.style.position = 'absolute';
  navLinks.style.top = '70px';
  navLinks.style.left = '0';
  navLinks.style.right = '0';
  navLinks.style.background = 'rgba(10,10,10,0.97)';
  navLinks.style.padding = '20px 24px';
  navLinks.style.gap = '20px';
  navLinks.style.borderBottom = '1px solid rgba(255,215,0,0.1)';
});

// Smooth scroll for nav links
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const target = document.querySelector(link.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
      if (window.innerWidth <= 900) navLinks.style.display = 'none';
    }
  });
});

// Scroll reveal animation
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.track-card, .art-card, .social-card, .about-card').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(30px)';
  el.style.transition = 'opacity 0.5s ease, transform 0.5s ease, border-color 0.25s, box-shadow 0.25s';
  observer.observe(el);
});

// Navbar scroll effect
window.addEventListener('scroll', () => {
  const navbar = document.querySelector('.navbar');
  if (window.scrollY > 50) {
    navbar.style.borderBottomColor = 'rgba(255,215,0,0.2)';
  } else {
    navbar.style.borderBottomColor = 'rgba(255,215,0,0.1)';
  }
});

// ===== MUSIC PLAYER =====
const audio = new Audio();
let currentBtn = null;

document.querySelectorAll('.track-play').forEach(btn => {
  btn.addEventListener('click', () => {
    const src = btn.dataset.src;
    if (!src) return;

    // тот же трек — пауза/плей
    if (audio.src.endsWith(src)) {
      if (audio.paused) {
        audio.play();
        btn.textContent = '⏸';
      } else {
        audio.pause();
        btn.textContent = '▶';
      }
      return;
    }

    // другой трек — сбросить предыдущую кнопку
    if (currentBtn) currentBtn.textContent = '▶';
    currentBtn = btn;

    audio.src = src;
    audio.play();
    btn.textContent = '⏸';
  });
});

// когда трек закончился
audio.addEventListener('ended', () => {
  if (currentBtn) currentBtn.textContent = '▶';
  currentBtn = null;
});

// Hero title typewriter on load
window.addEventListener('load', () => {
  const title = document.querySelector('.hero-title');
  if (!title) return;
  title.innerHTML = '<span class="hero-white"></span><br/><span class="hero-orange"></span>';
  const white = title.querySelector('.hero-white');
  const orange = title.querySelector('.hero-orange');
  const word1 = 'Dastan';
  const word2 = 'Banowv';
  let i = 0;
  const t = setInterval(() => {
    if (i < word1.length) {
      white.textContent += word1[i];
    } else {
      orange.textContent += word2[i - word1.length];
    }
    i++;
    if (i >= word1.length + word2.length) clearInterval(t);
  }, 80);
});
function typewrite(el) {
  // если есть data-html — печатаем с поддержкой сегментов
  const segments = [];
  el.childNodes.forEach(node => {
    if (node.nodeType === 3) {
      // текстовый узел
      segments.push({ text: node.textContent, color: null });
    } else if (node.nodeType === 1) {
      // элемент (span и т.д.)
      segments.push({ text: node.textContent, color: node.style.color || 'var(--yellow)', bold: node.style.fontWeight });
    }
  });

  const fullText = segments.map(s => s.text).join('');
  if (!fullText.trim()) return;

  el.innerHTML = '';
  el.style.opacity = '1';

  // создаём spans для каждого сегмента
  const spans = segments.map(s => {
    const span = document.createElement('span');
    if (s.color) { span.style.color = s.color; }
    if (s.bold)  { span.style.fontWeight = s.bold; }
    el.appendChild(span);
    return { span, text: s.text };
  });

  let segIdx = 0, charIdx = 0;
  const speed = parseInt(el.dataset.speed) || 30;

  const timer = setInterval(() => {
    if (segIdx >= spans.length) { clearInterval(timer); return; }
    const cur = spans[segIdx];
    cur.span.textContent += cur.text[charIdx];
    charIdx++;
    if (charIdx >= cur.text.length) { segIdx++; charIdx = 0; }
    if (segIdx >= spans.length) clearInterval(timer);
  }, speed);
}

const twObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting && !entry.target.dataset.typed) {
      entry.target.dataset.typed = 'true';
      typewrite(entry.target);
      twObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.2 });

// Все текстовые элементы кроме nav и hero-title (они уже видны сразу)
const twSelectors = [
  '.section-label',
  '.section h2',
  '.about-text p',
  '.stat-num',
  '.stat-label',
  '.card-tag',
  '.card-desc',
  '.track-title',
  '.track-meta',
  '.social-name',
  '.social-handle',
  '.art-overlay span',
  '.footer-quote',
  '.section-label'
];

document.querySelectorAll(twSelectors.join(',')).forEach(el => {
  if (el.textContent.trim()) {
    el.style.opacity = '0';
    twObserver.observe(el);
  }
});
