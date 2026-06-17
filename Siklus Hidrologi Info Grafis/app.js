/* ============================================================
   SIKLUS HIDROLOGI – INFOGRAFIS INTERAKTIF
   app.js
   ============================================================ */

'use strict';

// ============================================================
// 1. PARTICLE SYSTEM
// ============================================================
(function initParticles() {
  const canvas = document.getElementById('particleCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, particles = [], animId;

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function createParticle() {
    return {
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 2.5 + 0.5,
      vx: (Math.random() - 0.5) * 0.4,
      vy: -Math.random() * 0.6 - 0.2,
      alpha: Math.random() * 0.5 + 0.1,
      color: Math.random() > 0.5 ? '#38bdf8' : '#2dd4bf',
    };
  }

  function init() {
    particles = [];
    const count = Math.floor((W * H) / 14000);
    for (let i = 0; i < count; i++) particles.push(createParticle());
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach((p, i) => {
      p.x += p.vx;
      p.y += p.vy;
      p.alpha -= 0.0008;

      if (p.y < -10 || p.alpha <= 0) particles[i] = createParticle();

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = Math.max(0, p.alpha);
      ctx.fill();
    });
    ctx.globalAlpha = 1;
    animId = requestAnimationFrame(draw);
  }

  window.addEventListener('resize', () => { resize(); init(); });
  resize();
  init();
  draw();
})();

// ============================================================
// 2. STAGE DATA
// ============================================================
const stageData = {
  evaporasi: {
    icon: '☀️',
    title: 'Evaporasi',
    tags: ['Matahari', 'Uap Air', 'Energi Panas'],
    desc: `Evaporasi adalah proses penguapan air dari permukaan badan air seperti laut, danau, dan sungai akibat energi panas matahari. Molekul air berubah wujud dari cair menjadi gas (uap air) dan naik ke atmosfer.`,
    fact: '💡 Sekitar 80% kelembapan atmosfer berasal dari evaporasi lautan. Setiap hari, triliunan liter air menguap ke atmosfer.',
  },
  kondensasi: {
    icon: '☁️',
    title: 'Kondensasi',
    tags: ['Awan', 'Suhu Dingin', 'Titik Embun'],
    desc: `Kondensasi terjadi ketika uap air yang naik ke atmosfer mengalami penurunan suhu dan berubah kembali menjadi titik-titik air cair. Kumpulan titik air ini membentuk awan dan kabut yang kita lihat di langit.`,
    fact: '💡 Awan cumulonimbus dapat mengandung lebih dari 500.000 ton air dan menjulang hingga ketinggian 15 km.',
  },
  presipitasi: {
    icon: '🌧️',
    title: 'Presipitasi',
    tags: ['Hujan', 'Salju', 'Embun'],
    desc: `Presipitasi adalah jatuhnya air dari atmosfer ke permukaan bumi dalam berbagai bentuk: hujan, salju, hujan es, atau embun. Ini adalah cara utama air kembali dari atmosfer ke daratan dan lautan.`,
    fact: '💡 Indonesia menerima rata-rata 2.000–3.000 mm curah hujan per tahun, menjadikannya salah satu negara terhijau di dunia.',
  },
  infiltrasi: {
    icon: '🌱',
    title: 'Infiltrasi',
    tags: ['Tanah', 'Air Tanah', 'Pori-pori'],
    desc: `Infiltrasi adalah proses meresapnya air hujan ke dalam tanah melalui pori-pori tanah. Air yang terinfiltrasi menjadi air tanah yang menjadi sumber mata air dan sumur, mendukung kehidupan ekosistem bawah tanah.`,
    fact: '💡 Tanah berhutan menyerap air 18x lebih cepat dibanding tanah gundul, inilah mengapa hutan sangat penting mencegah banjir.',
  },
  runoff: {
    icon: '🌊',
    title: 'Run Off (Limpasan)',
    tags: ['Sungai', 'Laut', 'Gravitasi'],
    desc: `Run off atau limpasan adalah pergerakan air di permukaan tanah menuju badan air (sungai, danau) dan akhirnya mengalir ke laut. Air mengikuti gravitasi dari dataran tinggi ke dataran rendah membentuk jaringan sungai.`,
    fact: '💡 Tanpa vegetasi yang cukup, run off berlebihan dapat menyebabkan banjir dan erosi yang merusak ribuan hektar lahan.',
  },
};

// ============================================================
// 3. INTERACTIVE CYCLE DIAGRAM
// ============================================================
(function initCycleDiagram() {
  const nodes  = document.querySelectorAll('.stage-node');
  const cards  = document.querySelectorAll('.stage-card');
  const panel  = document.getElementById('info-panel-inner');

  if (!nodes.length || !panel) return;

  function setActiveStage(stageKey) {
    // Update nodes
    nodes.forEach(n => n.classList.toggle('active', n.dataset.stage === stageKey));
    // Update cards
    cards.forEach(c => c.classList.toggle('active', c.dataset.stage === stageKey));

    const d = stageData[stageKey];
    if (!d) return;

    // Fade out
    panel.classList.add('fade-out');
    setTimeout(() => {
      panel.innerHTML = `
        <span class="stage-detail-icon">${d.icon}</span>
        <h3>${d.title}</h3>
        <div class="stage-tags">
          ${d.tags.map(t => `<span class="stage-tag">${t}</span>`).join('')}
        </div>
        <p>${d.desc}</p>
        <div class="stage-fact">${d.fact}</div>
      `;
      panel.classList.remove('fade-out');
    }, 240);
  }

  nodes.forEach(node => {
    node.addEventListener('click', () => setActiveStage(node.dataset.stage));
  });

  cards.forEach(card => {
    card.addEventListener('click', () => {
      setActiveStage(card.dataset.stage);
      document.getElementById('cycle-diagram').scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  });

  // Auto-cycle highlight on load
  const stageOrder = ['evaporasi', 'kondensasi', 'presipitasi', 'infiltrasi', 'runoff'];
  let autoIdx = 0;
  let autoCycle = setInterval(() => {
    const node = document.querySelector(`.node-${stageOrder[autoIdx]}`);
    if (node) node.classList.add('active');
    setTimeout(() => { if (node) node.classList.remove('active'); }, 900);
    autoIdx = (autoIdx + 1) % stageOrder.length;
  }, 1200);

  // Stop auto-cycle on first click
  nodes.forEach(n => n.addEventListener('click', () => {
    clearInterval(autoCycle);
  }, { once: true }));
})();

// ============================================================
// 4. SCROLL ANIMATIONS (IntersectionObserver)
// ============================================================
(function initScrollAnimations() {
  const observerOptions = { threshold: 0.15, rootMargin: '0px 0px -40px 0px' };

  // Manfaat items
  const manfaatItems = document.querySelectorAll('#manfaat-list .md-item');
  const manfaatObs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const items = entry.target.querySelectorAll('.md-item');
        items.forEach((item, i) => {
          setTimeout(() => item.classList.add('visible'), i * 100);
        });
        manfaatObs.unobserve(entry.target);
      }
    });
  }, observerOptions);

  const manfaatList = document.getElementById('manfaat-list');
  if (manfaatList) manfaatObs.observe(manfaatList);

  // Dampak items
  const dampakObs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const items = entry.target.querySelectorAll('.md-item');
        items.forEach((item, i) => {
          setTimeout(() => item.classList.add('visible'), i * 100);
        });
        dampakObs.unobserve(entry.target);
      }
    });
  }, observerOptions);

  const dampakList = document.getElementById('dampak-list');
  if (dampakList) dampakObs.observe(dampakList);

  // Langkah cards
  const langkahCards = document.querySelectorAll('.langkah-card');
  const langkahObs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        langkahCards.forEach((card, i) => {
          setTimeout(() => card.classList.add('visible'), i * 120);
        });
        langkahObs.unobserve(entry.target);
      }
    });
  }, observerOptions);

  const langkahGrid = document.querySelector('.langkah-grid');
  if (langkahGrid) langkahObs.observe(langkahGrid);

  // Stage cards
  const stageCards = document.querySelectorAll('.stage-card');
  const stageObs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        stageCards.forEach((card, i) => {
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, i * 100);
        });
        stageObs.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Initial style for stage cards
  stageCards.forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
  });

  const stagesGrid = document.getElementById('stages-grid');
  if (stagesGrid) stageObs.observe(stagesGrid);
})();

// ============================================================
// 5. QUIZ ENGINE
// ============================================================
(function initQuiz() {
  const questions = [
    {
      q: 'Proses penguapan air dari permukaan laut dan sungai ke atmosfer akibat panas matahari disebut…',
      opts: ['Kondensasi', 'Presipitasi', 'Evaporasi', 'Infiltrasi'],
      ans: 2,
      exp: '✅ Benar! Evaporasi adalah proses penguapan air dari badan air (laut, danau, sungai) ke atmosfer akibat panas matahari.',
    },
    {
      q: 'Perubahan wujud uap air menjadi titik-titik air di atmosfer sehingga membentuk awan disebut…',
      opts: ['Evaporasi', 'Kondensasi', 'Presipitasi', 'Transpirasi'],
      ans: 1,
      exp: '✅ Tepat! Kondensasi terjadi saat uap air mengalami penurunan suhu di atmosfer dan berubah menjadi titik-titik air membentuk awan.',
    },
    {
      q: 'Jatuhnya air dari atmosfer ke permukaan bumi dalam bentuk hujan atau salju disebut…',
      opts: ['Infiltrasi', 'Run Off', 'Kondensasi', 'Presipitasi'],
      ans: 3,
      exp: '✅ Benar! Presipitasi adalah jatuhnya air dari atmosfer ke permukaan bumi — bisa berupa hujan, salju, maupun hujan es.',
    },
    {
      q: 'Peresapan air ke dalam tanah melalui pori-pori tanah disebut…',
      opts: ['Run Off', 'Kondensasi', 'Infiltrasi', 'Evaporasi'],
      ans: 2,
      exp: '✅ Betul! Infiltrasi adalah proses meresapnya air ke dalam tanah melalui pori-pori tanah menjadi air tanah.',
    },
    {
      q: 'Mengapa menanam pohon penting untuk menjaga siklus hidrologi?',
      opts: [
        'Pohon membuat cuaca menjadi panas',
        'Pohon menyerap air hujan, mencegah erosi, dan membantu evapotranspirasi',
        'Pohon menghalangi presipitasi',
        'Pohon mempercepat run off ke laut',
      ],
      ans: 1,
      exp: '✅ Tepat! Pohon berperan krusial — akarnya menyerap air hujan, daun-daunnya melepas uap air (transpirasi), dan tajuknya mencegah erosi tanah.',
    },
  ];

  let current = 0, score = 0, answered = false;

  const numEl      = document.getElementById('quiz-num');
  const questionEl = document.getElementById('quiz-question');
  const optionsEl  = document.getElementById('quiz-options');
  const feedbackEl = document.getElementById('quiz-feedback');
  const progressEl = document.getElementById('quiz-progress-bar');
  const resultEl   = document.getElementById('quiz-result');
  const qWrapEl    = document.querySelector('.quiz-question-wrap');
  const restartBtn = document.getElementById('btn-quiz-restart');

  if (!numEl) return;

  function renderQuestion() {
    answered = false;
    feedbackEl.style.display = 'none';
    resultEl.style.display   = 'none';
    qWrapEl.style.display    = '';

    const btnNext = document.getElementById('btn-next-quiz');
    if (btnNext) btnNext.remove();

    const q = questions[current];
    numEl.textContent      = `Soal ${current + 1} / ${questions.length}`;
    questionEl.textContent = q.q;
    progressEl.style.width = `${((current) / questions.length) * 100}%`;

    optionsEl.innerHTML = '';
    q.opts.forEach((opt, i) => {
      const btn = document.createElement('button');
      btn.className    = 'quiz-opt';
      btn.textContent  = opt;
      btn.id           = `quiz-opt-${i}`;
      btn.addEventListener('click', () => handleAnswer(i));
      optionsEl.appendChild(btn);
    });
  }

  function handleAnswer(chosen) {
    if (answered) return;
    answered = true;

    const q    = questions[current];
    const opts = document.querySelectorAll('.quiz-opt');
    const correct = chosen === q.ans;

    opts.forEach((btn, i) => {
      btn.disabled = true;
      if (i === q.ans) btn.classList.add('correct');
      else if (i === chosen && !correct) btn.classList.add('wrong');
    });

    if (correct) score++;

    feedbackEl.textContent  = correct ? q.exp : `❌ Kurang tepat. ${q.exp}`;
    feedbackEl.className    = `quiz-feedback ${correct ? 'correct' : 'wrong'}`;
    feedbackEl.style.display = 'block';

    // Next button
    const nextBtn = document.createElement('button');
    nextBtn.className = 'btn-next-quiz';
    nextBtn.id        = 'btn-next-quiz';
    nextBtn.textContent = current < questions.length - 1 ? 'Soal Berikutnya →' : 'Lihat Hasil 🎉';
    nextBtn.addEventListener('click', () => {
      current++;
      if (current < questions.length) {
        renderQuestion();
      } else {
        showResult();
      }
    });
    feedbackEl.after(nextBtn);
  }

  function showResult() {
    qWrapEl.style.display    = 'none';
    feedbackEl.style.display = 'none';
    const btnNext = document.getElementById('btn-next-quiz');
    if (btnNext) btnNext.remove();

    progressEl.style.width = '100%';

    const pct = (score / questions.length) * 100;
    let icon, title, desc;

    if (pct === 100) {
      icon = '🏆'; title = 'Sempurna!';
      desc = `Kamu menjawab semua ${questions.length} soal dengan benar! Kamu sudah menguasai Siklus Hidrologi dengan sangat baik.`;
    } else if (pct >= 60) {
      icon = '⭐'; title = `Bagus! Skor: ${score}/${questions.length}`;
      desc = `Pemahamanmu tentang Siklus Hidrologi sudah baik. Coba lagi untuk mencapai nilai sempurna!`;
    } else {
      icon = '📚'; title = `Skor: ${score}/${questions.length}`;
      desc = `Jangan menyerah! Baca kembali materi Siklus Hidrologi di atas dan coba lagi. Kamu pasti bisa!`;
    }

    document.getElementById('result-icon').textContent  = icon;
    document.getElementById('result-title').textContent = title;
    document.getElementById('result-desc').textContent  = desc;
    resultEl.style.display = 'block';
  }

  restartBtn && restartBtn.addEventListener('click', () => {
    current = 0; score = 0;
    progressEl.style.width = '0%';
    renderQuestion();
  });

  renderQuestion();
})();

// ============================================================
// 6. SMOOTH SCROLL for hero CTA
// ============================================================
document.getElementById('btn-explore')?.addEventListener('click', e => {
  e.preventDefault();
  document.getElementById('siklus')?.scrollIntoView({ behavior: 'smooth' });
});

// ============================================================
// 7. NAVBAR SCROLL EFFECT (subtle top-bar)
// ============================================================
(function initScrollHeader() {
  let lastY = 0;
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    // Add subtle glow to body on scroll
    document.body.style.setProperty('--scroll-progress', Math.min(y / 400, 1).toFixed(2));
    lastY = y;
  }, { passive: true });
})();

// ============================================================
// 8. ANIMATED COUNTER for fun stats
// ============================================================
(function initCounters() {
  // Future extensibility: add counters in HTML with data-count attr
  const counters = document.querySelectorAll('[data-count]');
  if (!counters.length) return;

  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el  = entry.target;
      const end = parseInt(el.dataset.count, 10);
      let   val = 0;
      const dur = 1500;
      const step = end / (dur / 16);
      const timer = setInterval(() => {
        val = Math.min(val + step, end);
        el.textContent = Math.floor(val).toLocaleString('id-ID');
        if (val >= end) clearInterval(timer);
      }, 16);
      obs.unobserve(el);
    });
  }, { threshold: 0.5 });

  counters.forEach(el => obs.observe(el));
})();

// ============================================================
// 9. WATER RIPPLE on click
// ============================================================
document.addEventListener('click', (e) => {
  if (e.target.closest('button') || e.target.closest('a')) return;
  const ripple = document.createElement('div');
  ripple.style.cssText = `
    position: fixed;
    left: ${e.clientX}px;
    top: ${e.clientY}px;
    width: 0; height: 0;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(56,189,248,0.3) 0%, transparent 70%);
    transform: translate(-50%, -50%);
    pointer-events: none;
    z-index: 9999;
    animation: rippleOut 0.7s ease-out forwards;
  `;
  document.body.appendChild(ripple);
  setTimeout(() => ripple.remove(), 700);
});

// Add ripple keyframe dynamically
const style = document.createElement('style');
style.textContent = `
  @keyframes rippleOut {
    from { width: 0; height: 0; opacity: 1; }
    to   { width: 200px; height: 200px; opacity: 0; }
  }
`;
document.head.appendChild(style);

console.log('%c💧 Siklus Hidrologi Infografis', 'color:#38bdf8;font-size:18px;font-weight:bold;');
console.log('%cDibuat oleh Mahasiswa Universitas Indraprasta PGRI', 'color:#2dd4bf;font-size:12px;');
