/**
 * Bulwark SEC, Inc. - Elite Physical Security Personnel & Guard Services
 * Core Interactive Application Engine
 */

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initPatrolCanvas();
  initMetricsCounter();
  initServiceTabs();
  initServiceModal();
  initPatrolOperationsMap();
  initGuardStaffingCalculator();
  initGuardPortalModal();
  initContactForm();
  initMobileNavigation();
  initScrollSpy();
  initLiveClock();
});

/* =========================================================================
   1. THEME SWITCHER (LIGHT MODE FIRST / DEFAULT)
   ========================================================================= */
function initTheme() {
  const themeToggleBtn = document.getElementById('theme-toggle');
  const mobileThemeToggleBtn = document.getElementById('mobile-theme-toggle');
  const sunIcon = document.getElementById('theme-icon-sun');
  const moonIcon = document.getElementById('theme-icon-moon');
  const html = document.documentElement;

  const savedTheme = localStorage.getItem('bulwark_theme') || 'light';
  
  if (savedTheme === 'dark') {
    html.classList.add('dark');
    if (sunIcon && moonIcon) {
      sunIcon.classList.remove('hidden');
      moonIcon.classList.add('hidden');
    }
  } else {
    html.classList.remove('dark');
    if (sunIcon && moonIcon) {
      sunIcon.classList.add('hidden');
      moonIcon.classList.remove('hidden');
    }
  }

  function toggleTheme() {
    const isDark = html.classList.toggle('dark');
    localStorage.setItem('bulwark_theme', isDark ? 'dark' : 'light');
    if (sunIcon && moonIcon) {
      if (isDark) {
        sunIcon.classList.remove('hidden');
        moonIcon.classList.add('hidden');
        showToast('Night Patrol Theme Active', 'info');
      } else {
        sunIcon.classList.add('hidden');
        moonIcon.classList.remove('hidden');
        showToast('Daylight Facility Theme Active', 'info');
      }
    }
  }

  if (themeToggleBtn) themeToggleBtn.addEventListener('click', toggleTheme);
  if (mobileThemeToggleBtn) mobileThemeToggleBtn.addEventListener('click', toggleTheme);
}

/* =========================================================================
   2. HERO PATROL NETWORK CANVAS (Interactive Guard Post Connections)
   ========================================================================= */
/* =========================================================================
   2. HERO PATROL NETWORK CANVAS (Interactive Tactical Defense Grid & Radar)
   ========================================================================= */
function initPatrolCanvas() {
  const canvas = document.getElementById('defense-grid-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let width, height;
  let particles = [];
  const particleCount = 45;
  let mouse = { x: -1000, y: -1000, isHovering: false };
  let radarAngle = 0;
  let pings = [];

  function resize() {
    width = canvas.width = canvas.offsetWidth;
    height = canvas.height = canvas.offsetHeight;
  }
  window.addEventListener('resize', resize);
  resize();

  // Mouse interactivity
  const heroEl = document.getElementById('hero') || canvas;
  heroEl.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
    mouse.isHovering = true;
  });

  heroEl.addEventListener('mouseleave', () => {
    mouse.isHovering = false;
    mouse.x = -1000;
    mouse.y = -1000;
  });

  // Tactical click dispatch ripple
  heroEl.addEventListener('click', (e) => {
    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;
    pings.push({
      x: clickX,
      y: clickY,
      radius: 5,
      maxRadius: 160,
      opacity: 1,
      tag: `DISPATCH-POST [${Math.round(clickX)}, ${Math.round(clickY)}]`
    });
  });

  const unitTypes = [
    { type: 'Static Guard', color: '#7CB0AB', size: 2.5 },
    { type: 'Mobile Patrol', color: '#10b981', size: 3.5 },
    { type: 'K-9 Unit', color: '#38bdf8', size: 3 },
    { type: 'VIP Escort', color: '#f59e0b', size: 3 }
  ];

  class GuardUnit {
    constructor() {
      this.x = Math.random() * (width || 800);
      this.y = Math.random() * (height || 600);
      this.vx = (Math.random() - 0.5) * 0.65;
      this.vy = (Math.random() - 0.5) * 0.65;
      this.unit = unitTypes[Math.floor(Math.random() * unitTypes.length)];
      this.radius = this.unit.size;
      this.pulse = Math.random() * Math.PI * 2;
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.pulse += 0.04;
      if (this.x < 0 || this.x > width) this.vx *= -1;
      if (this.y < 0 || this.y > height) this.vy *= -1;
    }
    draw() {
      // Glow halo
      const pulseSize = this.radius + Math.sin(this.pulse) * 1.5;
      ctx.beginPath();
      ctx.arc(this.x, this.y, pulseSize + 4, 0, Math.PI * 2);
      ctx.fillStyle = this.unit.color === '#10b981' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(124, 176, 171, 0.15)';
      ctx.fill();

      // Main core node
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = this.unit.color;
      ctx.shadowColor = this.unit.color;
      ctx.shadowBlur = 8;
      ctx.fill();
      ctx.shadowBlur = 0;
    }
  }

  for (let i = 0; i < particleCount; i++) {
    particles.push(new GuardUnit());
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);

    // 1. Draw Rotating Tactical Radar Beam
    radarAngle += 0.008;
    const radarCenterX = width * 0.5;
    const radarCenterY = height * 0.45;
    const radarRadius = Math.max(width, height) * 0.8;

    ctx.save();
    const radarGrad = ctx.createConicGradient(radarAngle, radarCenterX, radarCenterY);
    radarGrad.addColorStop(0, 'rgba(124, 176, 171, 0.08)');
    radarGrad.addColorStop(0.08, 'rgba(7, 40, 50, 0.0)');
    radarGrad.addColorStop(1, 'rgba(7, 40, 50, 0.0)');
    ctx.fillStyle = radarGrad;
    ctx.beginPath();
    ctx.arc(radarCenterX, radarCenterY, radarRadius, 0, Math.PI * 2);
    ctx.fill();

    // Radar Concentric Range Rings
    ctx.strokeStyle = 'rgba(124, 176, 171, 0.08)';
    ctx.lineWidth = 1;
    [150, 300, 480, 680].forEach(r => {
      ctx.beginPath();
      ctx.arc(radarCenterX, radarCenterY, r, 0, Math.PI * 2);
      ctx.stroke();
    });
    ctx.restore();

    // 2. Inter-node Tactical Vector Grid
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 140) {
          const alpha = (1 - dist / 140) * 0.45;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(124, 176, 171, ${alpha})`;
          ctx.lineWidth = 0.75;
          ctx.stroke();
        }
      }

      // Cursor magnetic tethering
      if (mouse.isHovering) {
        const mdx = particles[i].x - mouse.x;
        const mdy = particles[i].y - mouse.y;
        const mdist = Math.sqrt(mdx * mdx + mdy * mdy);

        if (mdist < 190) {
          const malpha = (1 - mdist / 190) * 0.85;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.strokeStyle = `rgba(124, 176, 171, ${malpha})`;
          ctx.lineWidth = 1.2;
          ctx.stroke();
        }
      }
    }

    // 3. Render Particles
    particles.forEach(p => {
      p.update();
      p.draw();
    });

    // 4. Cursor Tactical Crosshair HUD
    if (mouse.isHovering && mouse.x > 0 && mouse.y > 0) {
      ctx.save();
      // Outer Target Reticle
      ctx.strokeStyle = 'rgba(124, 176, 171, 0.7)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(mouse.x, mouse.y, 22, 0, Math.PI * 2);
      ctx.stroke();

      // Crosshair tick marks
      ctx.beginPath();
      ctx.moveTo(mouse.x - 30, mouse.y);
      ctx.lineTo(mouse.x - 12, mouse.y);
      ctx.moveTo(mouse.x + 12, mouse.y);
      ctx.lineTo(mouse.x + 30, mouse.y);
      ctx.moveTo(mouse.x, mouse.y - 30);
      ctx.lineTo(mouse.x, mouse.y - 12);
      ctx.moveTo(mouse.x, mouse.y + 12);
      ctx.lineTo(mouse.x, mouse.y + 30);
      ctx.stroke();

      // Center dot
      ctx.fillStyle = '#7CB0AB';
      ctx.beginPath();
      ctx.arc(mouse.x, mouse.y, 3, 0, Math.PI * 2);
      ctx.fill();

      // Coordinate HUD text
      ctx.font = '10px JetBrains Mono, monospace';
      ctx.fillStyle = 'rgba(124, 176, 171, 0.9)';
      ctx.fillText(`TAC-POS: [${Math.round(mouse.x)}, ${Math.round(mouse.y)}]`, mouse.x + 28, mouse.y - 10);
      ctx.fillText(`SECTOR-ALPHA // ACTIVE`, mouse.x + 28, mouse.y + 4);
      ctx.restore();
    }

    // 5. Interactive Click Dispatch Shockwaves
    for (let i = pings.length - 1; i >= 0; i--) {
      const ping = pings[i];
      ping.radius += 3.5;
      ping.opacity = 1 - (ping.radius / ping.maxRadius);

      if (ping.opacity <= 0) {
        pings.splice(i, 1);
        continue;
      }

      ctx.save();
      ctx.beginPath();
      ctx.arc(ping.x, ping.y, ping.radius, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(16, 185, 129, ${ping.opacity * 0.9})`;
      ctx.lineWidth = 2;
      ctx.stroke();

      // Expanding secondary wave
      if (ping.radius > 20) {
        ctx.beginPath();
        ctx.arc(ping.x, ping.y, ping.radius - 18, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(124, 176, 171, ${ping.opacity * 0.5})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      // Ping badge
      ctx.font = '11px JetBrains Mono, monospace';
      ctx.fillStyle = `rgba(16, 185, 129, ${ping.opacity})`;
      ctx.fillText(`✓ ${ping.tag}`, ping.x + 15, ping.y - 15);
      ctx.restore();
    }

    requestAnimationFrame(animate);
  }
  animate();
}

/* =========================================================================
   3. ANIMATED METRICS COUNTER
   ========================================================================= */
function initMetricsCounter() {
  const counters = document.querySelectorAll('.counter');
  let animated = false;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !animated) {
        animated = true;
        counters.forEach(counter => {
          const target = parseFloat(counter.getAttribute('data-target'));
          const isDecimal = target % 1 !== 0;
          const duration = 1500;
          const steps = 50;
          const stepTime = duration / steps;
          let current = 0;
          const increment = target / steps;

          const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
              counter.textContent = isDecimal ? target.toFixed(1) : Math.round(target);
              clearInterval(timer);
            } else {
              counter.textContent = isDecimal ? current.toFixed(1) : Math.round(current);
            }
          }, stepTime);
        });
      }
    });
  }, { threshold: 0.2 });

  const heroSection = document.getElementById('hero');
  if (heroSection) observer.observe(heroSection);
}

/* =========================================================================
   4. SERVICES FILTER TABS
   ========================================================================= */
function initServiceTabs() {
  const tabButtons = document.querySelectorAll('.service-tab-btn');
  const serviceCards = document.querySelectorAll('.service-card');

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      tabButtons.forEach(b => b.classList.remove('active-tab'));
      btn.classList.add('active-tab');

      const filter = btn.getAttribute('data-filter');
      serviceCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.style.display = 'flex';
          card.style.animation = 'fadeIn 0.3s ease forwards';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* =========================================================================
   5. SERVICE SPECIFICATIONS MODAL
   ========================================================================= */
const guardBlueprints = {
  uniformed: {
    title: 'Armed & Unarmed Uniformed Security Officers',
    code: 'POST-SPEC-UNIFORMED-01',
    sla: '100% Guaranteed Post Fill Rate SLA',
    description: 'Bulwark SEC provides highly trained, licensed armed and unarmed security guards for commercial high-rises, corporate campuses, industrial warehouses, gated communities, and construction sites. All officers follow strict customized Post Orders.',
    deliverables: [
      'Standing Lobby & Gatehouse Access Verification',
      'Electronic Wand & NFC Checkpoint Tour Logging',
      'Visitor Credentialing & Contractor Escort Protocols',
      'Daily Activity Reports (DAR) & Immediate Incident Logging'
    ],
    qualifications: 'State BSIS/SIA Guard Card, CPR/First-Aid Certified, Conflict De-escalation & Tactical Defense Training'
  },
  executive: {
    title: 'Executive Close Protection & Bodyguard Details (CPO)',
    code: 'POST-SPEC-EXEC-02',
    sla: 'Discreet Global Armed Escort < 24 Hr Deployment',
    description: 'Bespoke close personal protection for corporate executives, high-net-worth families, visiting dignitaries, and celebrities. Low-profile plainclothes or overt tactical armed security details with advance route reconnaissance.',
    deliverables: [
      'Dedicated Close Protection Officer (CPO) Bodyguards',
      'Armored Motorcade Escort & Tactical Evasive Driving',
      'Venue Advance Reconnaissance & Threat Assessment',
      'Residential Security Teams (RST) for Private Compounds'
    ],
    qualifications: 'Former Special Operations / Diplomatic Security Service, Defensive Driving Certified, Concealed Weapon Endorsements'
  },
  campus: {
    title: 'Corporate Campus & Front-Desk Concierge Security',
    code: 'POST-SPEC-CAMPUS-03',
    sla: 'White-Glove Customer Service & High-Security Hybrid',
    description: 'A polished blend of premium front-of-house hospitality concierge and vigilant security deterrence for Class-A corporate headquarters, tech campuses, and financial institutions.',
    deliverables: [
      'Front-Desk Concierge Security & Access Badge Issuance',
      'Loading Dock Vehicle Inspection & Manifest Verification',
      'CCTV Monitoring & Alarm Control Station Operators',
      'Emergency Fire & Evacuation Warden Coordination'
    ],
    qualifications: 'Corporate Concierge Customer Excellence, Fire Life Safety (FLS) Director Endorsement, Access System Certified'
  },
  patrol: {
    title: 'Marked Mobile Patrol Fleet & Rapid Alarm Response',
    code: 'POST-SPEC-PATROL-04',
    sla: '< 15 Min Guaranteed Patrol Response SLA',
    description: 'Marked, high-visibility security vehicles conducting randomized night and weekend property inspections, locking/unlocking gates, physical door-shaking checks, and rapid response to burglar/fire alarms.',
    deliverables: [
      'GPS-Tracked Real-Time Vehicle Patrol Proof of Service',
      'Randomized Physical Checkpoint Sweeps & Lighting Audits',
      'Trespasser Warning, Eviction & Law Enforcement Coordination',
      'Emergency Alarm Verification to Eliminate False Police Fines'
    ],
    qualifications: 'Emergency Vehicle Operation (EVOC) Certified, Armed Patrol Officer License, Bodycam Equipped'
  },
  event: {
    title: 'Special Event & High-Profile Crowd Management',
    code: 'POST-SPEC-EVENT-05',
    sla: 'Scalable Guard Forces (10 to 200+ Officers)',
    description: 'Comprehensive physical security personnel deployment for shareholder meetings, conventions, concerts, galas, and sporting events. Professional crowd control, perimeter integrity, and VIP protection.',
    deliverables: [
      'Magnetometer (Walk-Through Metal Detector) & Bag Screening',
      'Backstage, Green Room & VIP Area Access Control',
      'Trained Crowd Management & Ejection Specialists',
      'Medical Emergency Triage & Perimeter Evacuation Routing'
    ],
    qualifications: 'Crowd Management Safety Certified, Threat Screening & Magnetometer Operators, First-Aid Response'
  },
  k9: {
    title: 'Canine (K-9) Patrol & Explosive Detection Teams',
    code: 'POST-SPEC-K9-06',
    sla: 'Certified Handler & Dog Deployments',
    description: 'Highly trained canine handler teams for explosive scent detection, firearms location, and high-visibility physical deterrence at critical transit hubs, arenas, shipping ports, and corporate campuses.',
    deliverables: [
      'Vapor Wake & Static Explosive Detection Sweeps',
      'High-Visibility Perimeter Canine Patrol Deterrence',
      'Cargo, Vehicle & Baggage Scent Inspection',
      'Search & Rescue / Perimeter Intrusion Detection'
    ],
    qualifications: 'NAPWDA / USPCA Certified Handlers, Regular Odor Recognition Proficiency Testing'
  }
};

function initServiceModal() {
  const modal = document.getElementById('service-detail-modal');
  const modalContent = document.getElementById('service-modal-content');
  const closeBtn = document.getElementById('close-service-modal-btn');
  const openButtons = document.querySelectorAll('.open-service-modal-btn');

  function openServiceModal(serviceKey) {
    const data = guardBlueprints[serviceKey] || guardBlueprints.uniformed;
    modalContent.innerHTML = `
      <div class="space-y-4">
        <div class="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
          <span class="text-xs font-mono font-bold text-brand-600 dark:text-brand-400">${data.code}</span>
          <span class="text-xs font-mono font-bold text-tactical-emerald bg-tactical-emerald/10 px-2 py-0.5 rounded border border-tactical-emerald/30">${data.sla}</span>
        </div>
        <h3 class="font-display font-bold text-2xl text-slate-900 dark:text-white">${data.title}</h3>
        <p class="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">${data.description}</p>
        
        <div class="space-y-2 pt-2">
          <h4 class="text-xs font-mono font-bold uppercase text-slate-700 dark:text-slate-300">Guard Duties & Key Deliverables</h4>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600 dark:text-slate-400">
            ${data.deliverables.map(item => `
              <div class="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 flex items-center gap-2">
                <svg class="w-4 h-4 text-brand-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/></svg>
                <span>${item}</span>
              </div>
            `).join('')}
          </div>
        </div>

        <div class="p-3 rounded-xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-mono">
          <span class="text-slate-500 uppercase block mb-1">Officer Training & Licensing Mandates:</span>
          <span class="text-slate-800 dark:text-slate-200 font-semibold">${data.qualifications}</span>
        </div>

        <div class="pt-4 flex items-center justify-end gap-3">
          <button onclick="document.getElementById('service-detail-modal').classList.remove('opacity-100', 'pointer-events-auto'); document.getElementById('service-detail-modal').classList.add('opacity-0', 'pointer-events-none');" class="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all">Close</button>
          <a href="#contact" onclick="document.getElementById('service-detail-modal').classList.remove('opacity-100', 'pointer-events-auto'); document.getElementById('service-detail-modal').classList.add('opacity-0', 'pointer-events-none');" class="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold shadow-lg shadow-brand-600/30 transition-all">Request Guard Staffing</a>
        </div>
      </div>
    `;

    modal.classList.remove('opacity-0', 'pointer-events-none');
    modal.classList.add('opacity-100', 'pointer-events-auto');
  }

  openButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const serviceKey = btn.getAttribute('data-service');
      openServiceModal(serviceKey);
    });
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      modal.classList.remove('opacity-100', 'pointer-events-auto');
      modal.classList.add('opacity-0', 'pointer-events-none');
    });
  }

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.remove('opacity-100', 'pointer-events-auto');
      modal.classList.add('opacity-0', 'pointer-events-none');
    }
  });
}

/* =========================================================================
   6. INTERACTIVE PATROL OPERATIONS MAP & GUARD DISPATCH
   ========================================================================= */
function initPatrolOperationsMap() {
  const socStream = document.getElementById('live-soc-stream');
  const inspectCity = document.getElementById('inspect-city');
  const inspectStatus = document.getElementById('inspect-status');
  const inspectTraffic = document.getElementById('inspect-traffic');
  const threatNodes = document.querySelectorAll('.threat-node');
  const simulateProbeBtn = document.getElementById('trigger-simulate-attack');
  const threatLevelIndicator = document.getElementById('threat-level-indicator');

  const standardBtn = document.getElementById('posture-standard-btn');
  const overdriveBtn = document.getElementById('posture-overdrive-btn');
  const lockdownBtn = document.getElementById('posture-lockdown-btn');
  const postureButtons = [standardBtn, overdriveBtn, lockdownBtn];

  function setPosture(activeBtn, levelText, levelColorClass, toastMsg) {
    postureButtons.forEach(b => {
      if (b) b.classList.remove('active-posture', 'text-white');
    });
    if (activeBtn) {
      activeBtn.classList.add('active-posture', 'text-white');
    }
    if (threatLevelIndicator) {
      threatLevelIndicator.textContent = `SECTOR STATUS: ${levelText}`;
      threatLevelIndicator.className = levelColorClass;
    }
    showToast(toastMsg, 'info');
  }

  if (standardBtn) {
    standardBtn.addEventListener('click', () => {
      setPosture(standardBtn, 'SECURE (ALL POSTS MANNED)', 'text-tactical-emerald', 'Standard Guard Shift Active: Routine Scheduled Patrols');
    });
  }

  if (overdriveBtn) {
    overdriveBtn.addEventListener('click', () => {
      setPosture(overdriveBtn, 'INCREASED PRESENCE (EXTRA GUARDS)', 'text-amber-400', 'Surge Guard Deployment: Additional Roving Officers Dispatched');
    });
  }

  if (lockdownBtn) {
    lockdownBtn.addEventListener('click', () => {
      setPosture(lockdownBtn, 'TACTICAL LOCKDOWN (ENTRY SEALED)', 'text-red-500', 'TACTICAL FACILITY LOCKDOWN: Armed Officers Securing All Access Gates');
    });
  }

  threatNodes.forEach(node => {
    node.addEventListener('click', () => {
      const city = node.getAttribute('data-city');
      const status = node.getAttribute('data-status');
      const traffic = node.getAttribute('data-traffic');

      if (inspectCity) inspectCity.textContent = city;
      if (inspectStatus) inspectStatus.textContent = status;
      if (inspectTraffic) inspectTraffic.textContent = traffic;

      showToast(`Inspecting Guard Station: ${city} (${status})`, 'info');
    });
  });

  if (simulateProbeBtn) {
    simulateProbeBtn.addEventListener('click', () => {
      const simulatedEvents = [
        { type: 'Unauthorized Perimeter Trespasser', node: 'NYC Tower Post', action: 'APPREHENDED BY GUARD' },
        { type: 'Loading Dock Alarm Trigger', node: 'Singapore Logistics Post', action: 'PATROL UNIT ON SCENE' },
        { type: 'VIP Convoy Departure Escort', node: 'Zurich Vaults Post', action: 'CLOSE PROTECTION ACTIVE' },
        { type: 'Unscheduled Visitor Infiltration Attempt', node: 'London HQ Post', action: 'TURNED AWAY AT LOBBY' }
      ];
      const randomEvent = simulatedEvents[Math.floor(Math.random() * simulatedEvents.length)];

      addGuardLog(randomEvent.type, randomEvent.node, randomEvent.action, true);
      showToast(`Guard Action: ${randomEvent.type} at ${randomEvent.node} - ${randomEvent.action}!`, 'success');
    });
  }

  const initialLogs = [
    { time: '13:54:30', text: 'Officer Vance #402: North Gate Vehicle Checkpoint Cleared', status: 'VERIFIED' },
    { time: '13:53:15', text: 'Patrol Vehicle Alpha-2: Industrial Park Perimeter Sweep Complete', status: 'SECURE' },
    { time: '13:51:44', text: 'K9 Handler Team Delta: Cargo Bay Sweep Nominal', status: 'ALL CLEAR' },
    { time: '13:49:10', text: 'Lobby Concierge Guard: Visitor Credential Logged', status: 'AUTHORIZED' },
    { time: '13:47:00', text: 'Supervisor Field Check: Post #104 Guard on Duty & Alert', status: 'VERIFIED' }
  ];

  function renderGuardLogs() {
    if (!socStream) return;
    socStream.innerHTML = initialLogs.map(log => `
      <div class="p-2 rounded bg-slate-900/80 border border-slate-800/80 flex items-center justify-between text-[11px]">
        <div class="flex items-center gap-2">
          <span class="text-slate-500">${log.time}</span>
          <span class="text-slate-300">${log.text}</span>
        </div>
        <span class="px-1.5 py-0.5 rounded font-bold text-[10px] bg-tactical-emerald/20 text-tactical-emerald border border-tactical-emerald/30">${log.status}</span>
      </div>
    `).join('');
  }
  renderGuardLogs();

  function addGuardLog(text, node, status, isEmergency = false) {
    if (!socStream) return;
    const now = new Date();
    const timeStr = now.toTimeString().split(' ')[0];
    const logItem = document.createElement('div');
    logItem.className = `p-2 rounded ${isEmergency ? 'bg-amber-950/40 border border-amber-800/80' : 'bg-slate-900/80 border border-slate-800/80'} flex items-center justify-between text-[11px] animate-pulse`;
    logItem.innerHTML = `
      <div class="flex items-center gap-2">
        <span class="text-slate-500">${timeStr}</span>
        <span class="text-slate-200 font-semibold">[${node}] ${text}</span>
      </div>
      <span class="px-1.5 py-0.5 rounded font-bold text-[10px] bg-tactical-emerald/20 text-tactical-emerald border border-tactical-emerald/30">${status}</span>
    `;
    socStream.prepend(logItem);

    if (socStream.children.length > 8) {
      socStream.removeChild(socStream.lastElementChild);
    }
  }

  setInterval(() => {
    const nodes = ['NYC Post', 'Zurich Post', 'London Post', 'Singapore Post', 'Tokyo Post'];
    const events = [
      { msg: 'NFC Patrol Checkpoint Scanned', status: 'CONFIRMED' },
      { msg: 'Facility Perimeter Gate Locked', status: 'SECURE' },
      { msg: 'Roving Foot Patrol Completed', status: 'ALL CLEAR' },
      { msg: 'Guard Shift Handover Logged', status: 'VERIFIED' }
    ];
    const randomNode = nodes[Math.floor(Math.random() * nodes.length)];
    const randomEvt = events[Math.floor(Math.random() * events.length)];
    addGuardLog(randomEvt.msg, randomNode, randomEvt.status, false);
  }, 10000);
}

/* =========================================================================
   7. GUARD STAFFING & COVERAGE ESTIMATOR
   ========================================================================= */
function initGuardStaffingCalculator() {
  const scaleButtons = document.querySelectorAll('.scale-btn');
  const sectorButtons = document.querySelectorAll('.sector-btn');
  const controlCheckboxes = document.querySelectorAll('.calc-check');
  const scoreDisplay = document.getElementById('calc-score-display');
  const tierDisplay = document.getElementById('calc-tier-display');

  let baseGuards = 2;
  let hoursMultiplier = 24;

  function calculateStaffing() {
    let addOns = 0;
    controlCheckboxes.forEach(cb => {
      if (cb.checked) addOns += 1;
    });

    let totalGuards = baseGuards;
    if (hoursMultiplier === 24) {
      totalGuards = Math.max(3, baseGuards * 2 + addOns);
      if (scoreDisplay && tierDisplay) {
        scoreDisplay.textContent = `${totalGuards} OFFICERS / 24-HR ROTATION`;
        scoreDisplay.className = 'font-display font-black text-2xl sm:text-3xl text-brand-600 dark:text-brand-400 mt-1';
        tierDisplay.textContent = 'Bulwark 24/7 Dedicated Static & Patrol Detail';
      }
    } else if (hoursMultiplier === 12) {
      totalGuards = Math.max(2, baseGuards + addOns);
      if (scoreDisplay && tierDisplay) {
        scoreDisplay.textContent = `${totalGuards} OFFICERS (12-HR SHIFT)`;
        scoreDisplay.className = 'font-display font-black text-2xl sm:text-3xl text-amber-500 mt-1';
        tierDisplay.textContent = 'Bulwark Overnight & Weekend Coverage Team';
      }
    } else {
      totalGuards = Math.max(1, baseGuards);
      if (scoreDisplay && tierDisplay) {
        scoreDisplay.textContent = `${totalGuards} CONCIERGE OFFICER (8-HR)`;
        scoreDisplay.className = 'font-display font-black text-2xl sm:text-3xl text-tactical-emerald mt-1';
        tierDisplay.textContent = 'Bulwark Business Hours Front-Desk Concierge';
      }
    }
  }

  scaleButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      scaleButtons.forEach(b => b.classList.remove('active-calc-btn'));
      btn.classList.add('active-calc-btn');
      baseGuards = parseInt(btn.getAttribute('data-points'), 10);
      calculateStaffing();
    });
  });

  sectorButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      sectorButtons.forEach(b => b.classList.remove('active-calc-btn'));
      btn.classList.add('active-calc-btn');
      hoursMultiplier = parseInt(btn.getAttribute('data-points'), 10);
      calculateStaffing();
    });
  });

  controlCheckboxes.forEach(cb => {
    cb.addEventListener('change', calculateStaffing);
  });

  calculateStaffing();
}

/* =========================================================================
   8. CLIENT GUARD PORTAL MODAL
   ========================================================================= */
function initGuardPortalModal() {
  const modal = document.getElementById('portal-modal');
  const openBtn = document.getElementById('open-portal-btn');
  const mobileOpenBtn = document.getElementById('mobile-open-portal-btn');
  const closeBtn = document.getElementById('close-portal-modal-btn');
  const portalForm = document.getElementById('portal-form');
  const authStatus = document.getElementById('portal-auth-status');
  const submitBtn = document.getElementById('portal-submit-btn');

  function openPortal() {
    if (!modal) return;
    modal.classList.remove('opacity-0', 'pointer-events-none');
    modal.classList.add('opacity-100', 'pointer-events-auto');
  }

  function closePortal() {
    if (!modal) return;
    modal.classList.remove('opacity-100', 'pointer-events-auto');
    modal.classList.add('opacity-0', 'pointer-events-none');
    if (authStatus) authStatus.classList.add('hidden');
  }

  if (openBtn) openBtn.addEventListener('click', openPortal);
  if (mobileOpenBtn) mobileOpenBtn.addEventListener('click', openPortal);
  if (closeBtn) closeBtn.addEventListener('click', closePortal);

  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closePortal();
    });
  }

  if (portalForm) {
    portalForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const totp = document.getElementById('portal-totp').value.trim();

      if (totp.length < 6) {
        showToast('Please enter your 6-digit Guard Shift PIN.', 'error');
        return;
      }

      submitBtn.disabled = true;
      submitBtn.innerHTML = `
        <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <span>Loading Guard Tour Reports...</span>
      `;

      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = `
          <span>Access Live Guard Reports</span>
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
        `;

        if (authStatus) {
          authStatus.classList.remove('hidden');
          authStatus.className = 'text-center text-xs font-mono py-2 rounded-lg bg-tactical-emerald/20 text-tactical-emerald border border-tactical-emerald/40';
          authStatus.textContent = 'ACCESS GRANTED: Guard Tour Logs & Post Orders Loaded.';
        }

        showToast('Client Portal Authenticated. Daily Activity Reports (DAR) ready.', 'success');

        setTimeout(() => {
          closePortal();
        }, 1800);
      }, 1100);
    });
  }
}

/* =========================================================================
   9. HIRE GUARDS / CONTACT FORM
   ========================================================================= */
function initContactForm() {
  const form = document.getElementById('contact-form');
  const successBanner = document.getElementById('form-success-banner');
  const submitBtn = document.getElementById('submit-contact-btn');

  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('contact-name').value.trim();
    const email = document.getElementById('contact-email').value.trim();
    const phone = document.getElementById('contact-phone').value.trim();
    const message = document.getElementById('contact-message').value.trim();

    let isValid = true;

    const errName = document.getElementById('err-name');
    const errEmail = document.getElementById('err-email');
    const errPhone = document.getElementById('err-phone');
    const errMessage = document.getElementById('err-message');

    if (!name) {
      errName.classList.remove('hidden');
      isValid = false;
    } else {
      errName.classList.add('hidden');
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      errEmail.classList.remove('hidden');
      isValid = false;
    } else {
      errEmail.classList.add('hidden');
    }

    if (!phone || phone.length < 7) {
      errPhone.classList.remove('hidden');
      isValid = false;
    } else {
      errPhone.classList.add('hidden');
    }

    if (!message || message.length < 5) {
      errMessage.classList.remove('hidden');
      isValid = false;
    } else {
      errMessage.classList.add('hidden');
    }

    if (!isValid) {
      showToast('Please correct highlighted fields before submitting.', 'error');
      return;
    }

    submitBtn.disabled = true;
    submitBtn.innerHTML = `
      <svg class="animate-spin -ml-1 mr-2 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      <span>Dispatching Guard Proposal Request...</span>
    `;

    setTimeout(() => {
      submitBtn.disabled = false;
      submitBtn.innerHTML = `
        <span>Submit Guard Coverage Request</span>
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
      `;

      form.reset();
      if (successBanner) {
        successBanner.classList.remove('hidden');
      }
      showToast('Guard Staffing Request Dispatched to Central Operations.', 'success');
    }, 1300);
  });
}

/* =========================================================================
   10. MOBILE NAVIGATION DRAWER
   ========================================================================= */
function initMobileNavigation() {
  const menuBtn = document.getElementById('mobile-menu-btn');
  const closeBtn = document.getElementById('close-drawer-btn');
  const drawer = document.getElementById('mobile-drawer');
  const backdrop = document.getElementById('drawer-backdrop');
  const drawerLinks = document.querySelectorAll('.drawer-link');

  function openDrawer() {
    drawer.classList.remove('translate-x-full', 'pointer-events-none');
    drawer.classList.add('translate-x-0', 'pointer-events-auto');
    backdrop.classList.remove('opacity-0');
    backdrop.classList.add('opacity-100');
  }

  function closeDrawer() {
    drawer.classList.remove('translate-x-0', 'pointer-events-auto');
    drawer.classList.add('translate-x-full', 'pointer-events-none');
    backdrop.classList.remove('opacity-100');
    backdrop.classList.add('opacity-0');
  }

  if (menuBtn) menuBtn.addEventListener('click', openDrawer);
  if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
  if (backdrop) backdrop.addEventListener('click', closeDrawer);

  drawerLinks.forEach(link => {
    link.addEventListener('click', closeDrawer);
  });
}

/* =========================================================================
   11. SCROLLSPY
   ========================================================================= */
function initScrollSpy() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    let current = '';
    const scrollPos = window.pageYOffset + 150;

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active-nav');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active-nav');
      }
    });
  });
}

/* =========================================================================
   12. LIVE UTC CLOCK & TOAST NOTIFICATION UTILITY
   ========================================================================= */
function initLiveClock() {
  const clockEl = document.getElementById('live-utc-clock');
  function updateClock() {
    if (!clockEl) return;
    const now = new Date();
    const utcHours = String(now.getUTCHours()).padStart(2, '0');
    const utcMinutes = String(now.getUTCMinutes()).padStart(2, '0');
    const utcSeconds = String(now.getUTCSeconds()).padStart(2, '0');
    clockEl.textContent = `UTC ${utcHours}:${utcMinutes}:${utcSeconds}`;
  }
  updateClock();
  setInterval(updateClock, 1000);
}

function showToast(message, type = 'info') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  const bgColor = type === 'success' ? 'bg-emerald-600' : type === 'error' ? 'bg-red-600' : 'bg-slate-900 dark:bg-slate-800';
  const iconSvg = type === 'success' 
    ? '<svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>'
    : type === 'error'
    ? '<svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>'
    : '<svg class="w-4 h-4 text-brand-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>';

  toast.className = `p-4 rounded-xl text-white font-mono text-xs shadow-2xl flex items-center gap-3 border border-white/10 ${bgColor} transform translate-y-4 opacity-0 transition-all duration-300 pointer-events-auto`;
  toast.innerHTML = `
    <div class="flex-shrink-0">${iconSvg}</div>
    <div class="flex-grow">${message}</div>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.classList.remove('translate-y-4', 'opacity-0');
  }, 10);

  setTimeout(() => {
    toast.classList.add('translate-y-4', 'opacity-0');
    setTimeout(() => {
      if (container.contains(toast)) container.removeChild(toast);
    }, 300);
  }, 3500);
}
