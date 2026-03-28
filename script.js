// ===== パスワードゲート =====
// SHA-256ハッシュで比較（平文をソースに書かない）
const PASS_HASH = '1e05d5568f260c6fca228fd1745d2126f636729bb0fb406ecae62c725026d61c';

async function sha256(text) {
  const data = new TextEncoder().encode(text);
  const hash = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('');
}

async function checkPass() {
  const input = document.getElementById('gate-input').value;
  const hash = await sha256(input);

  if (hash === PASS_HASH) {
    document.getElementById('gate').classList.add('hidden');
    document.body.classList.remove('locked');
    sessionStorage.setItem('yudo_auth', '1');
    return false;
  } else {
    document.getElementById('gate-error').textContent = '合言葉が違います';
    document.getElementById('gate-input').value = '';
    return false;
  }
}

// セッション中は再入力不要
if (sessionStorage.getItem('yudo_auth') === '1') {
  document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('gate').classList.add('hidden');
    document.body.classList.remove('locked');
  });
} else {
  document.addEventListener('DOMContentLoaded', () => {
    document.body.classList.add('locked');
  });
}

// ===== スクロールアニメーション =====
document.addEventListener('DOMContentLoaded', () => {
  // アニメーション対象要素にクラスを追加
  const targets = document.querySelectorAll(
    '.spirit-card, .activity-card, .org-card, .org-note, ' +
    '.join-phase, .join-requirements, .vision-item, ' +
    '.section-title, .section-lead'
  );

  targets.forEach(el => el.classList.add('fade-in'));

  // Intersection Observer
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -40px 0px'
  });

  targets.forEach(el => observer.observe(el));

  // スムーススクロール（Safari対応）
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
});
