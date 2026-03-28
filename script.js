// ===== パスワードゲート =====
// Base64エンコードで難読化（カジュアル保護）
const PASS_KEY = 'T25zZW5kYWlzdWtp'; // Base64

function checkPass() {
  var input = document.getElementById('gate-input').value;
  var key = atob(PASS_KEY);

  if (input === key) {
    document.getElementById('gate').classList.add('hidden');
    document.body.classList.remove('locked');
    sessionStorage.setItem('yudo_auth', '1');
  } else {
    document.getElementById('gate-error').textContent = '合言葉が違います';
    document.getElementById('gate-input').value = '';
  }
}

// フォームsubmitをJSで制御
document.addEventListener('DOMContentLoaded', function() {
  var form = document.getElementById('gate-form');
  if (form) {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      checkPass();
    });
  }
});

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
