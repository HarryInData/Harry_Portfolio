/* ===========================
   HARI KISHAN SINGH — PORTFOLIO JS
   Premium: Character reveals, magnetic buttons,
   3D tilt, text scramble, smooth counters,
   scroll progress, enhanced terminal
   =========================== */

(function () {
  'use strict';

  // ========================
  // LOADING SCREEN (enhanced)
  // ========================
  const loader = document.getElementById('loader');
  const loaderBar = document.getElementById('loaderBar');
  const loaderPercent = document.getElementById('loaderPercent');
  const nav = document.getElementById('nav');
  const loaderCommands = document.querySelectorAll('.loader-cmd');

  let loadProgress = 0;
  let cmdIndex = 0;

  const loadInterval = setInterval(() => {
    loadProgress += Math.random() * 6 + 1.5;
    if (loadProgress > 100) loadProgress = 100;
    loaderBar.style.width = loadProgress + '%';
    loaderPercent.textContent = Math.floor(loadProgress) + '%';

    // Show commands progressively
    const cmdThreshold = (cmdIndex + 1) * (100 / loaderCommands.length);
    if (loadProgress >= cmdThreshold && cmdIndex < loaderCommands.length) {
      loaderCommands[cmdIndex].classList.add('visible');
      cmdIndex++;
    }

    if (loadProgress >= 100) {
      clearInterval(loadInterval);
      setTimeout(() => {
        loader.classList.add('hidden');
        nav.classList.add('visible');
        setTimeout(() => {
          initCharReveal();
          initRevealAnimations();
          animateHeroContent();
        }, 200);
      }, 800);
    }
  }, 70);

  // ========================
  // CUSTOM CURSOR (enhanced with text)
  // ========================
  const cursor = document.getElementById('cursor');
  const cursorTrail = document.getElementById('cursorTrail');
  const cursorText = document.getElementById('cursorText');
  let mouseX = 0, mouseY = 0;
  let trailX = 0, trailY = 0;
  let cursorVisible = false;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    if (!cursorVisible) {
      cursor.style.opacity = '1';
      cursorTrail.style.opacity = '1';
      cursorVisible = true;
    }
  });

  document.addEventListener('mouseleave', () => {
    cursor.style.opacity = '0';
    cursorTrail.style.opacity = '0';
    cursorVisible = false;
  });

  // Smooth cursor position with RAF
  let cursorX = 0, cursorY = 0;
  function updateCursor() {
    cursorX += (mouseX - cursorX) * 0.2;
    cursorY += (mouseY - cursorY) * 0.2;
    cursor.style.left = cursorX + 'px';
    cursor.style.top = cursorY + 'px';

    trailX += (mouseX - trailX) * 0.08;
    trailY += (mouseY - trailY) * 0.08;
    cursorTrail.style.left = trailX + 'px';
    cursorTrail.style.top = trailY + 'px';

    requestAnimationFrame(updateCursor);
  }
  updateCursor();

  // Hover expansion with cursor text
  document.querySelectorAll('[data-hover], a, button').forEach((el) => {
    el.addEventListener('mouseenter', () => {
      cursor.classList.add('hover');
      cursorTrail.classList.add('hover');
      const text = el.dataset.cursorText || '';
      cursorText.textContent = text;
    });
    el.addEventListener('mouseleave', () => {
      cursor.classList.remove('hover');
      cursorTrail.classList.remove('hover');
      cursorText.textContent = '';
    });
  });

  // ========================
  // MAGNETIC BUTTONS
  // ========================
  document.querySelectorAll('.magnetic').forEach((btn) => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      btn.style.transform = `translate(${x * 0.25}px, ${y * 0.25}px)`;
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = 'translate(0, 0)';
    });
  });

  // ========================
  // MOBILE MENU
  // ========================
  const navMenuBtn = document.getElementById('navMenuBtn');
  const mobileMenu = document.getElementById('mobileMenu');

  navMenuBtn.addEventListener('click', () => {
    navMenuBtn.classList.toggle('active');
    mobileMenu.classList.toggle('active');
  });

  document.querySelectorAll('.mobile-link').forEach((link) => {
    link.addEventListener('click', () => {
      navMenuBtn.classList.remove('active');
      mobileMenu.classList.remove('active');
    });
  });

  // ========================
  // HERO CANVAS — Enhanced particle system
  // ========================
  const canvas = document.getElementById('heroCanvas');
  const ctx = canvas.getContext('2d');
  let cw, ch;

  function resizeCanvas() {
    cw = canvas.width = canvas.offsetWidth;
    ch = canvas.height = canvas.offsetHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  const particles = [];
  const PARTICLE_COUNT = 90;

  // Mouse interaction with particles
  let canvasMouseX = cw / 2;
  let canvasMouseY = ch / 2;

  canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    canvasMouseX = e.clientX - rect.left;
    canvasMouseY = e.clientY - rect.top;
  });

  class Particle {
    constructor() {
      this.reset();
    }
    reset() {
      this.x = Math.random() * cw;
      this.y = Math.random() * ch;
      this.baseSize = Math.random() * 1.5 + 0.3;
      this.size = this.baseSize;
      this.speedX = (Math.random() - 0.5) * 0.25;
      this.speedY = (Math.random() - 0.5) * 0.25;
      this.opacity = Math.random() * 0.5 + 0.1;
    }
    update() {
      // Mouse repulsion
      const dx = this.x - canvasMouseX;
      const dy = this.y - canvasMouseY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 150) {
        const force = (150 - dist) / 150;
        this.x += (dx / dist) * force * 1.5;
        this.y += (dy / dist) * force * 1.5;
        this.size = this.baseSize + force * 2;
      } else {
        this.size += (this.baseSize - this.size) * 0.05;
      }

      this.x += this.speedX;
      this.y += this.speedY;
      if (this.x < -10 || this.x > cw + 10 || this.y < -10 || this.y > ch + 10) {
        this.reset();
      }
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(162, 155, 254, ${this.opacity})`;
      ctx.fill();
    }
  }

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    particles.push(new Particle());
  }

  // Central glowing orb (enhanced)
  let orbAngle = 0;
  let orbBreath = 0;

  function drawOrb() {
    const cx = cw / 2;
    const cy = ch / 2;
    const baseRadius = Math.min(cw, ch) * 0.12;
    orbAngle += 0.004;
    orbBreath += 0.02;

    const breathScale = 1 + Math.sin(orbBreath) * 0.05;

    // Outer glow
    const grad1 = ctx.createRadialGradient(cx, cy, 0, cx, cy, baseRadius * 3.5);
    grad1.addColorStop(0, 'rgba(108, 92, 231, 0.07)');
    grad1.addColorStop(0.4, 'rgba(108, 92, 231, 0.02)');
    grad1.addColorStop(1, 'transparent');
    ctx.fillStyle = grad1;
    ctx.fillRect(0, 0, cw, ch);

    // Pulsing rings
    for (let r = 0; r < 3; r++) {
      const pulse = Math.sin(orbAngle * 2 + r * 0.8) * 8;
      const radius = (baseRadius * (1 + r * 0.4) + pulse) * breathScale;
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(162, 155, 254, ${0.06 - r * 0.015})`;
      ctx.lineWidth = 0.8;
      ctx.stroke();
    }

    // Inner orb
    const grad2 = ctx.createRadialGradient(cx, cy, 0, cx, cy, baseRadius * breathScale);
    grad2.addColorStop(0, 'rgba(162, 155, 254, 0.14)');
    grad2.addColorStop(0.6, 'rgba(108, 92, 231, 0.05)');
    grad2.addColorStop(1, 'transparent');
    ctx.fillStyle = grad2;
    ctx.beginPath();
    ctx.arc(cx, cy, baseRadius * breathScale, 0, Math.PI * 2);
    ctx.fill();

    // Orbiting dots with trails
    for (let i = 0; i < 7; i++) {
      const angle = orbAngle + (i * Math.PI * 2) / 7;
      const orbitRadius = baseRadius * (0.6 + Math.sin(orbAngle * 0.5 + i) * 0.2) * breathScale;
      const ox = cx + Math.cos(angle) * orbitRadius;
      const oy = cy + Math.sin(angle) * orbitRadius;

      // Dot trail
      const trailAngle = angle - 0.2;
      const tx = cx + Math.cos(trailAngle) * orbitRadius;
      const ty = cy + Math.sin(trailAngle) * orbitRadius;
      const trailGrad = ctx.createLinearGradient(tx, ty, ox, oy);
      trailGrad.addColorStop(0, 'transparent');
      trailGrad.addColorStop(1, 'rgba(162, 155, 254, 0.3)');
      ctx.beginPath();
      ctx.moveTo(tx, ty);
      ctx.lineTo(ox, oy);
      ctx.strokeStyle = trailGrad;
      ctx.lineWidth = 1.5;
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(ox, oy, 2, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(162, 155, 254, 0.5)';
      ctx.fill();
    }
  }

  function drawConnections() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 100) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(162, 155, 254, ${0.05 * (1 - dist / 100)})`;
          ctx.lineWidth = 0.4;
          ctx.stroke();
        }
      }
    }
  }

  function animateCanvas() {
    ctx.clearRect(0, 0, cw, ch);
    drawOrb();
    particles.forEach((p) => {
      p.update();
      p.draw();
    });
    drawConnections();
    requestAnimationFrame(animateCanvas);
  }
  animateCanvas();

  // ========================
  // CHARACTER-BY-CHARACTER REVEAL
  // ========================
  function initCharReveal() {
    document.querySelectorAll('.char-reveal').forEach((el) => {
      const text = el.textContent;
      const delay = parseFloat(el.dataset.delay || 0);
      el.innerHTML = '';
      el.style.visibility = 'visible';

      [...text].forEach((char, i) => {
        const span = document.createElement('span');
        span.className = 'char' + (char === ' ' ? ' space' : '');
        span.textContent = char === ' ' ? '\u00A0' : char;
        el.appendChild(span);

        setTimeout(() => {
          span.classList.add('revealed');
        }, delay * 1000 + i * 40 + 300);
      });
    });
  }

  // ========================
  // TEXT SCRAMBLE EFFECT
  // ========================
  const scrambleChars = '!<>-_\\/[]{}—=+*^?#_abcdefghijklmnopqrstuvwxyz';

  class TextScramble {
    constructor(el) {
      this.el = el;
      this.originalText = el.textContent;
      this.isScrambling = false;
    }

    scramble() {
      if (this.isScrambling) return;
      this.isScrambling = true;
      const original = this.originalText;
      const length = original.length;
      let frame = 0;
      const totalFrames = 15;

      const update = () => {
        let output = '';
        for (let i = 0; i < length; i++) {
          if (original[i] === ' ' || original[i] === '\n') {
            output += original[i];
          } else if (frame > totalFrames * (i / length)) {
            output += original[i];
          } else {
            output += scrambleChars[Math.floor(Math.random() * scrambleChars.length)];
          }
        }
        // Use innerHTML to preserve <br> tags
        this.el.childNodes.forEach((node, idx) => {
          if (node.nodeType === 3) { // text node
            const start = this.getTextOffset(this.el, idx);
            const end = start + node.textContent.length;
            node.textContent = output.slice(start, end);
          }
        });
        // Fallback: just set textContent if no child text nodes
        if (this.el.childNodes.length <= 1) {
          this.el.textContent = output;
        }
        frame++;
        if (frame <= totalFrames + length * 0.5) {
          requestAnimationFrame(update);
        } else {
          this.el.textContent = original;
          this.isScrambling = false;
        }
      };
      update();
    }

    getTextOffset(parent, targetIdx) {
      let offset = 0;
      for (let i = 0; i < targetIdx; i++) {
        const node = parent.childNodes[i];
        if (node.nodeType === 3) offset += node.textContent.length;
        else offset += node.textContent ? node.textContent.length : 0;
      }
      return offset;
    }
  }

  // Simple scramble: just scramble the raw text
  document.querySelectorAll('[data-scramble]').forEach((el) => {
    const originalText = el.textContent;
    let isScrambling = false;

    el.addEventListener('mouseenter', () => {
      if (isScrambling) return;
      isScrambling = true;
      const len = originalText.length;
      let frame = 0;
      const totalFrames = 12;

      const animate = () => {
        let output = '';
        for (let i = 0; i < len; i++) {
          if (originalText[i] === ' ' || originalText[i] === '\n') {
            output += originalText[i];
          } else if (frame > totalFrames * (i / len)) {
            output += originalText[i];
          } else {
            output += scrambleChars[Math.floor(Math.random() * scrambleChars.length)];
          }
        }
        el.textContent = output;
        frame++;
        if (frame <= totalFrames + 5) {
          requestAnimationFrame(animate);
        } else {
          el.textContent = originalText;
          isScrambling = false;
        }
      };
      animate();
    });
  });

  // ========================
  // 3D TILT CARDS
  // ========================
  document.querySelectorAll('.tilt-card').forEach((card) => {
    const glow = card.querySelector('.card-glow');

    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      const rotateX = (0.5 - y) * 12;
      const rotateY = (x - 0.5) * 12;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`;

      if (glow) {
        glow.style.setProperty('--glow-x', (x * 100) + '%');
        glow.style.setProperty('--glow-y', (y * 100) + '%');
      }
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
    });
  });

  // ========================
  // SCROLL REVEAL ANIMATIONS (enhanced)
  // ========================
  function initRevealAnimations() {
    const reveals = document.querySelectorAll('.reveal-up');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const delay = parseFloat(entry.target.dataset.delay || 0);
            setTimeout(() => {
              entry.target.classList.add('revealed');
            }, delay * 1000);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -60px 0px' }
    );
    reveals.forEach((el) => observer.observe(el));
  }

  // ========================
  // HERO CONTENT ANIMATION
  // ========================
  function animateHeroContent() {
    // The hero-tag
    const heroTag = document.querySelector('.hero-tag');
    if (heroTag) {
      setTimeout(() => heroTag.classList.add('revealed'), 200);
    }

    // hero-sub and hero-cta
    document.querySelectorAll('.hero-sub, .hero-cta, .scroll-indicator').forEach((el) => {
      const delay = parseFloat(el.dataset.delay || 0);
      setTimeout(() => el.classList.add('revealed'), delay * 1000 + 200);
    });
  }

  // ========================
  // SMOOTH SCROLL
  // ========================
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // ========================
  // COUNTER ANIMATION
  // ========================
  function animateCounters() {
    document.querySelectorAll('.stat-number[data-count]').forEach((counter) => {
      const target = parseInt(counter.dataset.count);
      const duration = 2000;
      const startTime = performance.now();
      let animated = false;

      if (counter.dataset.animated) return;
      counter.dataset.animated = 'true';

      function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Ease out cubic
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = Math.floor(eased * target);
        counter.textContent = current.toLocaleString();

        if (progress < 1) {
          requestAnimationFrame(update);
        } else {
          counter.textContent = target.toLocaleString();
        }
      }
      requestAnimationFrame(update);
    });
  }

  // Observe counters
  const statsObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounters();
          statsObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.3 }
  );
  const statsGrid = document.querySelector('.stats-grid');
  if (statsGrid) statsObserver.observe(statsGrid);

  // ========================
  // TERMINAL INTERACTION (enhanced)
  // ========================
  const terminalInput = document.getElementById('terminalInput');
  const terminalOutput = document.getElementById('terminalOutput');
  const terminalBody = document.getElementById('terminalBody');

  const commands = {
    help: () =>
      `<p class="term-yellow">Available commands:</p>
       <p class="term-dim">  about        — Who am I?</p>
       <p class="term-dim">  projects     — See my projects</p>
       <p class="term-dim">  skills       — My tech stack</p>
       <p class="term-dim">  contact      — How to reach me</p>
       <p class="term-dim">  run analysis — Run a data analysis demo</p>
       <p class="term-dim">  whoami       — Quick identity</p>
       <p class="term-dim">  date         — Current timestamp</p>
       <p class="term-dim">  clear        — Clear terminal</p>`,

    about: () =>
      `<p class="term-accent">━━━ ABOUT ━━━</p>
       <p class="term-white">Hari Kishan Singh</p>
       <p class="term-dim">Data Analyst | AI & ML Enthusiast</p>
       <p class="term-dim">BCA Student @ IMS Ghaziabad</p>
       <p class="term-dim">New Delhi, India</p>
       <p>&nbsp;</p>
       <p class="term-dim">Building intelligent systems that turn chaos into clarity.</p>
       <p class="term-dim">I don't just analyze data — I architect understanding.</p>`,

    projects: () =>
      `<p class="term-accent">━━━ PROJECTS ━━━</p>
       <p>&nbsp;</p>
       <p class="term-white">01. TeamFit AI</p>
       <p class="term-dim">    → Freeloader detection in group projects</p>
       <p>&nbsp;</p>
       <p class="term-white">02. AI BI Dashboard</p>
       <p class="term-dim">    → No-code AI-powered analytics</p>
       <p>&nbsp;</p>
       <p class="term-white">03. Emotion-Aware Encryption</p>
       <p class="term-dim">    → Facial expression-based security</p>
       <p>&nbsp;</p>
       <p class="term-white">04. Customer Churn Prediction</p>
       <p class="term-dim">    → ML-powered churn modeling</p>`,

    skills: () =>
      `<p class="term-accent">━━━ SKILLS ━━━</p>
       <p>&nbsp;</p>
       <p class="term-dim">Languages   : <span class="term-white">Python, SQL, JavaScript</span></p>
       <p class="term-dim">ML/AI       : <span class="term-white">Scikit-learn, TensorFlow, NLP</span></p>
       <p class="term-dim">Data Tools  : <span class="term-white">Pandas, Power BI, Excel</span></p>
       <p class="term-dim">Web         : <span class="term-white">HTML/CSS, FastAPI, Streamlit</span></p>
       <p class="term-dim">Other       : <span class="term-white">Git, Deep Learning</span></p>`,

    contact: () =>
      `<p class="term-accent">━━━ CONTACT ━━━</p>
       <p>&nbsp;</p>
       <p class="term-dim">Email    : <span class="term-white">harikishan4763@gmail.com</span></p>
       <p class="term-dim">GitHub   : <span class="term-white">github.com/HarryInData</span></p>
       <p class="term-dim">LinkedIn : <span class="term-white">Hari Kishan Singh</span></p>`,

    whoami: () =>
      `<p class="term-white">Hari Kishan Singh — Data Analyst & AI Developer</p>`,

    date: () =>
      `<p class="term-white">${new Date().toLocaleString()}</p>`,

    clear: () => 'CLEAR',
  };

  // "run analysis" with enhanced typing animation
  async function runAnalysis() {
    const lines = [
      { text: '> Initializing data pipeline...', cls: 'term-dim', delay: 300 },
      { text: '> Connecting to database... ✓', cls: 'term-green', delay: 500 },
      { text: '> Importing dataset...', cls: 'term-dim', delay: 400 },
      { text: '> Dataset loaded: 15,482 rows × 23 columns', cls: 'term-white', delay: 600 },
      { text: '', cls: '', delay: 200 },
      { text: '> Cleaning null values... done ✓', cls: 'term-green', delay: 500 },
      { text: '> Encoding categorical variables... done ✓', cls: 'term-green', delay: 400 },
      { text: '> Running feature engineering...', cls: 'term-dim', delay: 600 },
      { text: '> Features selected: 14 of 23', cls: 'term-white', delay: 400 },
      { text: '', cls: '', delay: 200 },
      { text: '> Splitting data: 80% train / 20% test', cls: 'term-dim', delay: 400 },
      { text: '> Training model: Random Forest Classifier', cls: 'term-accent', delay: 800 },
      { text: '> ████████████████████ 100%', cls: 'term-accent', delay: 600 },
      { text: '', cls: '', delay: 200 },
      { text: '> Model Performance:', cls: 'term-yellow', delay: 300 },
      { text: '  Accuracy  : 94.7%', cls: 'term-white', delay: 200 },
      { text: '  F1 Score  : 0.93', cls: 'term-white', delay: 200 },
      { text: '  AUC-ROC   : 0.97', cls: 'term-white', delay: 200 },
      { text: '  Precision : 0.95', cls: 'term-white', delay: 200 },
      { text: '', cls: '', delay: 200 },
      { text: '━━━ ANALYSIS COMPLETE ━━━', cls: 'term-accent', delay: 400 },
      { text: '', cls: '', delay: 100 },
      { text: 'Top churn drivers identified:', cls: 'term-white', delay: 300 },
      { text: '  1. Contract type (month-to-month → highest risk)', cls: 'term-dim', delay: 200 },
      { text: '  2. Tenure < 12 months', cls: 'term-dim', delay: 200 },
      { text: '  3. High monthly charges + low usage', cls: 'term-dim', delay: 200 },
      { text: '  4. No tech support subscription', cls: 'term-dim', delay: 200 },
      { text: '', cls: '', delay: 100 },
      { text: '> Report saved to /output/analysis_report.pdf ✓', cls: 'term-green', delay: 300 },
      { text: '> Model exported to /models/churn_rf_v2.pkl ✓', cls: 'term-green', delay: 300 },
    ];

    for (const line of lines) {
      await new Promise((resolve) => setTimeout(resolve, line.delay));
      const p = document.createElement('p');
      p.className = line.cls;
      p.textContent = line.text;
      p.style.opacity = '0';
      p.style.transform = 'translateY(5px)';
      terminalOutput.appendChild(p);

      // Animate line in
      requestAnimationFrame(() => {
        p.style.transition = 'opacity 0.3s, transform 0.3s';
        p.style.opacity = '1';
        p.style.transform = 'translateY(0)';
      });

      terminalBody.scrollTop = terminalBody.scrollHeight;
    }
  }

  terminalInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const val = terminalInput.value.trim().toLowerCase();
      if (!val) return;

      const echo = document.createElement('p');
      echo.innerHTML = `<span class="term-green">hari@portfolio</span>:<span class="term-blue">~</span>$ ${val}`;
      terminalOutput.appendChild(echo);
      terminalInput.value = '';

      if (val === 'run analysis' || val === 'run project.exe' || val === 'analyze data' || val === 'analyze') {
        runAnalysis();
        return;
      }

      if (val === 'clear') {
        terminalOutput.innerHTML = '';
        return;
      }

      const cmdFn = commands[val];
      if (cmdFn) {
        const result = document.createElement('div');
        result.innerHTML = cmdFn();
        result.style.opacity = '0';
        result.style.transform = 'translateY(5px)';
        terminalOutput.appendChild(result);

        requestAnimationFrame(() => {
          result.style.transition = 'opacity 0.4s, transform 0.4s';
          result.style.opacity = '1';
          result.style.transform = 'translateY(0)';
        });
      } else {
        const err = document.createElement('p');
        err.className = 'term-dim';
        err.textContent = `command not found: ${val}. Type "help" for available commands.`;
        terminalOutput.appendChild(err);
      }

      terminalBody.scrollTop = terminalBody.scrollHeight;
    }
  });

  // ========================
  // SCROLL PROGRESS BAR
  // ========================
  const scrollProgress = document.getElementById('scrollProgress');

  // ========================
  // PARALLAX & SCROLL HANDLERS
  // ========================
  const heroContent = document.querySelector('.hero-content');
  const sections = document.querySelectorAll('.section');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = (scrollY / docHeight) * 100;

    // Scroll progress bar
    scrollProgress.style.width = scrollPercent + '%';

    // Parallax hero
    if (heroContent) {
      const parallaxY = scrollY * 0.2;
      const opacity = Math.max(0, 1 - scrollY / 600);
      heroContent.style.transform = `translateY(${parallaxY}px)`;
      heroContent.style.opacity = opacity;
    }

    // Nav visibility
    if (scrollY > 80) {
      nav.classList.add('visible');
    }

    // Active nav link
    let currentSection = '';
    sections.forEach((section) => {
      const top = section.offsetTop - 200;
      if (scrollY >= top) {
        currentSection = section.getAttribute('id');
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove('active');
      if (link.getAttribute('href') === '#' + currentSection) {
        link.classList.add('active');
      }
    });
  });

  // ========================
  // RIPPLE EFFECT ON BUTTONS
  // ========================
  document.querySelectorAll('.btn').forEach((btn) => {
    btn.addEventListener('click', function (e) {
      const ripple = document.createElement('span');
      const rect = this.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;

      ripple.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        left: ${x}px;
        top: ${y}px;
        border-radius: 50%;
        background: rgba(255,255,255,0.2);
        transform: scale(0);
        animation: ripple-anim 0.6s ease-out;
        pointer-events: none;
        z-index: 3;
      `;

      this.appendChild(ripple);
      setTimeout(() => ripple.remove(), 600);
    });
  });

  // Add ripple animation to stylesheet
  const style = document.createElement('style');
  style.textContent = `
    @keyframes ripple-anim {
      to { transform: scale(2.5); opacity: 0; }
    }
  `;
  document.head.appendChild(style);

})();
