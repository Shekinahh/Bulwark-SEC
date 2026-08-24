/**
 * Bulwark SEC, Inc. — Shared Utility Scripts
 * Runs on every page: theme, clock, toast, mobile nav
 */

// ── Tailwind Config (shared via CDN) ──────────────────────────────────────
// NOTE: Tailwind config is inlined in each page's <head>

// ── Theme ─────────────────────────────────────────────────────────────────
(function initTheme() {
  const html = document.documentElement;
  const saved = localStorage.getItem('bulwark_theme') || 'light';
  if (saved === 'dark') html.classList.add('dark');
  else html.classList.remove('dark');
})();

document.addEventListener('DOMContentLoaded', () => {
  // Theme toggle wiring
  const sunIcon  = document.getElementById('theme-icon-sun');
  const moonIcon = document.getElementById('theme-icon-moon');
  const html     = document.documentElement;

  function syncIcons() {
    const isDark = html.classList.contains('dark');
    if (sunIcon)  sunIcon.classList.toggle('hidden', !isDark);
    if (moonIcon) moonIcon.classList.toggle('hidden', isDark);
  }
  syncIcons();

  function toggleTheme() {
    const isDark = html.classList.toggle('dark');
    localStorage.setItem('bulwark_theme', isDark ? 'dark' : 'light');
    syncIcons();
    showToast(isDark ? 'Night Patrol Mode Active' : 'Daylight Mode Active', 'info');
  }

  document.getElementById('theme-toggle')?.addEventListener('click', toggleTheme);
  document.getElementById('mobile-theme-toggle')?.addEventListener('click', toggleTheme);

  // Mobile drawer
  const menuBtn  = document.getElementById('mobile-menu-btn');
  const closeBtn = document.getElementById('close-drawer-btn');
  const drawer   = document.getElementById('mobile-drawer');
  const backdrop = document.getElementById('drawer-backdrop');

  function openDrawer()  {
    drawer?.classList.remove('translate-x-full');
    drawer?.classList.add('translate-x-0');
    backdrop?.classList.remove('opacity-0', 'pointer-events-none');
    backdrop?.classList.add('opacity-100');
  }
  function closeDrawer() {
    drawer?.classList.add('translate-x-full');
    drawer?.classList.remove('translate-x-0');
    backdrop?.classList.add('opacity-0', 'pointer-events-none');
    backdrop?.classList.remove('opacity-100');
  }

  menuBtn?.addEventListener('click', openDrawer);
  closeBtn?.addEventListener('click', closeDrawer);
  backdrop?.addEventListener('click', closeDrawer);
  document.querySelectorAll('.drawer-link').forEach(l => l.addEventListener('click', closeDrawer));

  // Live UTC clock
  const clockEl = document.getElementById('live-utc-clock');
  function tick() {
    if (!clockEl) return;
    const n = new Date();
    clockEl.textContent = `UTC ${String(n.getUTCHours()).padStart(2,'0')}:${String(n.getUTCMinutes()).padStart(2,'0')}:${String(n.getUTCSeconds()).padStart(2,'0')}`;
  }
  tick();
  setInterval(tick, 1000);

  // Patrol canvas (hero page only)
  initPatrolCanvas();
});

// ── Patrol Network Canvas ─────────────────────────────────────────────────
function initPatrolCanvas() {
  const canvas = document.getElementById('defense-grid-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let w, h;

  function resize() { w = canvas.width = canvas.offsetWidth; h = canvas.height = canvas.offsetHeight; }
  window.addEventListener('resize', resize);
  resize();

  const PARTICLE_COUNT = 45;
  const particles = Array.from({ length: PARTICLE_COUNT }, () => ({
    x: Math.random() * w, y: Math.random() * h,
    vx: (Math.random() - 0.5) * 0.65, vy: (Math.random() - 0.5) * 0.65,
    r: Math.random() * 2 + 1.5,
    isVehicle: Math.random() > 0.82
  }));

  function animate() {
    ctx.clearRect(0, 0, w, h);
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx*dx + dy*dy);
        if (dist < 135) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(37,99,235,${(1 - dist/135) * 0.55})`;
          ctx.lineWidth = 0.7;
          ctx.stroke();
        }
      }
    }
    particles.forEach(p => {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > w) p.vx *= -1;
      if (p.y < 0 || p.y > h) p.vy *= -1;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.isVehicle ? '#10b981' : '#2563eb';
      ctx.fill();
    });
    requestAnimationFrame(animate);
  }
  animate();
}

// ── Animated Counter ──────────────────────────────────────────────────────
function animateCounters(root) {
  const counters = (root || document).querySelectorAll('.counter');
  let done = false;
  const obs = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting && !done) {
      done = true;
      counters.forEach(c => {
        const target = parseFloat(c.dataset.target);
        const isFloat = target % 1 !== 0;
        let cur = 0; const inc = target / 60;
        const t = setInterval(() => {
          cur += inc;
          if (cur >= target) { c.textContent = isFloat ? target.toFixed(1) : Math.round(target); clearInterval(t); }
          else c.textContent = isFloat ? cur.toFixed(1) : Math.round(cur);
        }, 25);
      });
    }
  }, { threshold: 0.2 });
  const section = document.getElementById('hero') || document.querySelector('section');
  if (section) obs.observe(section);
}
document.addEventListener('DOMContentLoaded', () => animateCounters());

// ── Toast Notification ────────────────────────────────────────────────────
function showToast(message, type = 'info') {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'fixed bottom-6 right-6 z-[100] flex flex-col gap-3 pointer-events-none';
    document.body.appendChild(container);
  }
  const colors = {
    success: 'bg-emerald-600 text-white',
    error:   'bg-red-600 text-white',
    info:    'bg-slate-900 dark:bg-slate-800 text-white'
  };
  const icons = {
    success: '<svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>',
    error:   '<svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>',
    info:    '<svg class="w-4 h-4 flex-shrink-0 text-brand-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>'
  };
  const toast = document.createElement('div');
  toast.className = `p-4 rounded-xl font-mono text-xs shadow-2xl flex items-center gap-3 border border-white/10 pointer-events-auto opacity-0 translate-y-3 transition-all duration-300 ${colors[type] || colors.info}`;
  toast.innerHTML = `${icons[type] || icons.info}<span>${message}</span>`;
  container.appendChild(toast);
  requestAnimationFrame(() => { toast.classList.remove('opacity-0','translate-y-3'); });
  setTimeout(() => {
    toast.classList.add('opacity-0','translate-y-3');
    setTimeout(() => container.contains(toast) && container.removeChild(toast), 300);
  }, 3500);
}
