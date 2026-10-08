/* Termux GUI Lite: lightweight, offline-first UI prototype.
   All package and shell interactions are local demonstrations; no Android files are touched. */

const BASE_WORKSPACE_MB = 260;
const BUDGET_MB = 700;

const apps = [
  {
    id: 'ubuntu-cli', name: 'Ubuntu CLI', category: 'System', size: 124, version: '24.04',
    subtitle: 'A focused Debian-style command line', description: 'A compact command-line workspace with essential Linux utilities and a clean starter profile.',
    icon: 'terminal', background: 'linear-gradient(135deg, #2d6248, #153d35)', foreground: '#e0ff8b', tint: 'rgba(104, 235, 157, .16)', featured: false
  },
  {
    id: 'file-vault', name: 'File Vault', category: 'Utility', size: 18, version: '1.8',
    subtitle: 'Browse project files with ease', description: 'A lightweight file workspace for your local projects, snippets, and exported builds.',
    icon: 'folder', background: 'linear-gradient(135deg, #285d55, #15353c)', foreground: '#9dfff0', tint: 'rgba(93, 225, 211, .14)', featured: false
  },
  {
    id: 'nano-pad', name: 'Nano Pad', category: 'Dev', size: 9, version: '2.4',
    subtitle: 'Distraction-free text and notes', description: 'Quick notes, markdown drafts, and terminal-friendly text editing without an oversized editor.',
    icon: 'code', background: 'linear-gradient(135deg, #4b4f92, #25274d)', foreground: '#e0e4ff', tint: 'rgba(142, 155, 255, .16)', featured: false
  },
  {
    id: 'git-pocket', name: 'Git Pocket', category: 'Dev', size: 16, version: '2.2',
    subtitle: 'Commit, branch, and sync', description: 'A compact dashboard for common Git actions, sized for lightweight mobile projects.',
    icon: 'box', background: 'linear-gradient(135deg, #784d36, #44271f)', foreground: '#ffe1b2', tint: 'rgba(248, 165, 105, .16)', featured: false
  },
  {
    id: 'xfce-pocket', name: 'Xfce Pocket', category: 'Desktop', size: 49, version: '4.20',
    subtitle: 'A tiny desktop session', description: 'A carefully selected Xfce starter set designed for a small screen and a smaller storage footprint.',
    icon: 'grid', background: 'linear-gradient(135deg, #4c447d, #242447)', foreground: '#d7d1ff', tint: 'rgba(154, 138, 255, .19)', featured: true
  },
  {
    id: 'code-studio', name: 'Code Studio', category: 'Dev', size: 34, version: '1.6',
    subtitle: 'Edit web projects on the go', description: 'A compact code workspace with file tabs, syntax-aware editing, and no unnecessary starter packs.',
    icon: 'code', background: 'linear-gradient(135deg, #285a63, #17343f)', foreground: '#b4f6ff', tint: 'rgba(96, 214, 236, .17)', featured: true
  },
  {
    id: 'web-lab', name: 'Web Lab', category: 'Dev', size: 27, version: '0.9',
    subtitle: 'Preview HTML, CSS, and JS', description: 'A tiny local preview kit for learning and building responsive web interfaces from your phone.',
    icon: 'terminal', background: 'linear-gradient(135deg, #566c32, #283c22)', foreground: '#ecff9e', tint: 'rgba(192, 231, 103, .17)', featured: true
  },
  {
    id: 'python-kit', name: 'Python Kit', category: 'Dev', size: 43, version: '3.13',
    subtitle: 'Scripts without the bloat', description: 'A lean Python starter environment for automations, learning exercises, and useful little tools.',
    icon: 'cpu', background: 'linear-gradient(135deg, #335982, #20334f)', foreground: '#b7ddff', tint: 'rgba(100, 173, 255, .16)', featured: false
  },
  {
    id: 'pixel-lab', name: 'Pixel Lab', category: 'Creative', size: 31, version: '1.3',
    subtitle: 'Sketch icons and color studies', description: 'A simple canvas and palette scratchpad for visual experiments, kept purposefully small.',
    icon: 'palette', background: 'linear-gradient(135deg, #7c3e65, #49243f)', foreground: '#ffd0e8', tint: 'rgba(245, 120, 191, .16)', featured: false
  },
  {
    id: 'secure-keys', name: 'Secure Keys', category: 'Utility', size: 12, version: '1.1',
    subtitle: 'Store local project secrets', description: 'A local-only scratch vault for development tokens and environment values in your demo workspace.',
    icon: 'shield', background: 'linear-gradient(135deg, #416c57, #263f35)', foreground: '#c7ffd9', tint: 'rgba(103, 238, 161, .16)', featured: false
  },
  {
    id: 'task-pulse', name: 'Task Pulse', category: 'Utility', size: 11, version: '1.0',
    subtitle: 'A quiet project checklist', description: 'A focused, offline task list for keeping small Linux projects moving forward.',
    icon: 'check', background: 'linear-gradient(135deg, #6a5a2f, #40371f)', foreground: '#ffeba5', tint: 'rgba(246, 205, 102, .16)', featured: false
  }
];

const themes = [
  { id: 'forest', name: 'Forest Terminal', detail: 'Mossy greens with a bright signal lime.', background: '#111d19', accent: '#d8ff69', text: '#edf6ef' },
  { id: 'ocean', name: 'Tidal Blue', detail: 'Cool blue focus for late-night builds.', background: '#111d2a', accent: '#83dcff', text: '#edf6ff' },
  { id: 'plum', name: 'Orbit Plum', detail: 'Warm violet shadows and soft amber hints.', background: '#211526', accent: '#f1a6ff', text: '#fcf0ff' },
  { id: 'sand', name: 'Solar Sand', detail: 'A mellow amber palette with low glare.', background: '#252016', accent: '#ffd578', text: '#fff8e8' }
];

const defaultInstalled = ['ubuntu-cli', 'file-vault', 'nano-pad', 'git-pocket'];
const saved = safelyReadState();
const state = {
  view: 'discover',
  installed: new Set(saved.installed?.filter((id) => apps.some((app) => app.id === id)) || defaultInstalled),
  category: 'All',
  query: '',
  sort: 'featured',
  theme: themes.some((theme) => theme.id === saved.theme) ? saved.theme : 'forest',
  motion: saved.motion !== false,
  contrast: saved.contrast === true,
  budget: saved.budget !== false
};

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

function safelyReadState() {
  try { return JSON.parse(localStorage.getItem('tuxlite-state')) || {}; } catch { return {}; }
}

function saveState() {
  try {
    localStorage.setItem('tuxlite-state', JSON.stringify({
      installed: [...state.installed], theme: state.theme, motion: state.motion,
      contrast: state.contrast, budget: state.budget
    }));
  } catch { /* local storage can be disabled in private previews */ }
}

function iconFor(app, className = '') {
  const style = `--icon-bg:${app.background};--icon-fg:${app.foreground};`;
  const inner = app.icon === 'code'
    ? '<span class="code-glyph">&lt;/&gt;</span>'
    : `<svg><use href="#${app.icon}"></use></svg>`;
  return `<span class="app-icon ${className}" style="${style}" aria-hidden="true">${inner}</span>`;
}

function getInstalledApps() {
  return apps.filter((app) => state.installed.has(app.id));
}

function getUsage() {
  return BASE_WORKSPACE_MB + getInstalledApps().reduce((total, app) => total + app.size, 0);
}

function getFreeSpace() {
  return Math.max(0, BUDGET_MB - getUsage());
}

function updateStorageUI() {
  const used = getUsage();
  const percent = Math.min(100, Math.round((used / BUDGET_MB) * 100));
  const free = getFreeSpace();
  const ring = $('.storage-ring');
  if (ring) ring.style.setProperty('--storage', percent);
  const panel = $('.storage-panel');
  if (panel) panel.style.setProperty('--storage-width', `${percent}%`);
  $('#storage-percent').textContent = percent;
  $('#storage-amount').textContent = `${used} / ${BUDGET_MB} MB`;
  $('#storage-message').textContent = `${free} MB stays free for your next tool.`;
  $('#metric-workspace').textContent = `${used} MB`;
  $('#installed-count').textContent = `${state.installed.size} tool${state.installed.size === 1 ? '' : 's'}`;
  $('#free-budget').textContent = `${free} MB`;
  $('#budget-state').textContent = state.budget ? 'On' : 'Off';
}

function renderQuickLaunches() {
  const root = $('#quick-launches');
  const selected = getInstalledApps().slice(0, 4);
  root.innerHTML = selected.map((app) => `
    <button class="quick-app" type="button" data-open-app="${app.id}" aria-label="Open ${app.name}">
      ${iconFor(app)}<span>${app.name}</span>
    </button>
  `).join('');
}

function renderFeatured() {
  const root = $('#featured-cards');
  const featured = apps.filter((app) => app.featured).slice(0, 4);
  root.innerHTML = featured.map((app) => {
    const installed = state.installed.has(app.id);
    return `
      <button class="featured-card" type="button" data-open-app="${app.id}" style="--card-tint:${app.tint}" aria-label="View ${app.name}">
        ${iconFor(app)}
        <h4>${app.name}</h4>
        <p>${app.subtitle}</p>
        <span class="featured-footer">
          <span>${app.size} MB</span>
          <span class="install-mini">${installed ? '<svg><use href="#check"></use></svg> Added' : '<svg><use href="#download"></use></svg> Add'}</span>
        </span>
      </button>
    `;
  }).join('');
}

function renderCategoryChips() {
  const categories = ['All', ...new Set(apps.map((app) => app.category))];
  $('#category-chips').innerHTML = categories.map((category) => `
    <button type="button" class="chip ${state.category === category ? 'active' : ''}" data-category="${category}">${category}</button>
  `).join('');
}

function getFilteredApps() {
  const query = state.query.trim().toLowerCase();
  let result = apps.filter((app) => {
    const matchesCategory = state.category === 'All' || app.category === state.category;
    const searchable = `${app.name} ${app.subtitle} ${app.category}`.toLowerCase();
    return matchesCategory && (!query || searchable.includes(query));
  });
  if (state.sort === 'size') result = [...result].sort((a, b) => a.size - b.size);
  if (state.sort === 'name') result = [...result].sort((a, b) => a.name.localeCompare(b.name));
  if (state.sort === 'featured') result = [...result].sort((a, b) => Number(state.installed.has(b.id)) - Number(state.installed.has(a.id)) || Number(b.featured) - Number(a.featured));
  return result;
}

function renderLibrary() {
  const root = $('#app-list');
  const list = getFilteredApps();
  if (!list.length) {
    root.innerHTML = '<div class="empty-list">No lightweight tool matches that search. Try another word.</div>';
    return;
  }
  root.innerHTML = list.map((app) => {
    const installed = state.installed.has(app.id);
    return `
      <article class="app-row" data-open-app="${app.id}" tabindex="0" role="button" aria-label="View ${app.name}">
        ${iconFor(app)}
        <div class="app-row-main">
          <h3>${app.name}</h3>
          <p>${app.subtitle}</p>
          <div class="app-meta"><span>${app.category}</span><span>${app.size} MB</span></div>
        </div>
        <button type="button" class="row-action ${installed ? 'installed' : ''}" data-row-action="${installed ? 'launch' : 'install'}" data-app-id="${app.id}">
          ${installed ? '<svg><use href="#play"></use></svg>Open' : 'Add'}
        </button>
      </article>
    `;
  }).join('');
}

function renderThemes() {
  const root = $('#theme-grid');
  root.innerHTML = themes.map((theme) => `
    <button class="theme-option ${state.theme === theme.id ? 'active' : ''}" type="button" data-theme-choice="${theme.id}"
      style="--sample-bg:${theme.background};--sample-accent:${theme.accent};--sample-text:${theme.text}">
      <span class="sample-orb"></span>
      <span class="selected-indicator"><svg><use href="#check"></use></svg></span>
      <span class="sample-code"><b>~/desk $</b> theme<br>ready_to_build</span>
      <strong>${theme.name}</strong><small>${theme.id === 'forest' ? 'Default palette' : 'Tap to apply'}</small>
    </button>
  `).join('');
}

function applyTheme(themeId, silent = false) {
  const theme = themes.find((item) => item.id === themeId) || themes[0];
  state.theme = theme.id;
  document.body.dataset.theme = theme.id;
  $('meta[name="theme-color"]').setAttribute('content', theme.background);
  $('#current-theme-name').textContent = theme.name;
  $('#current-theme-description').textContent = theme.detail;
  renderThemes();
  saveState();
  if (!silent) showToast(`${theme.name} applied`);
}

function navigate(view) {
  if (!['discover', 'library', 'terminal', 'themes', 'system'].includes(view)) return;
  state.view = view;
  $$('.view').forEach((section) => {
    const isCurrent = section.dataset.view === view;
    section.hidden = !isCurrent;
    section.classList.toggle('view-active', isCurrent);
  });
  $$('.nav-item').forEach((item) => item.classList.toggle('active', item.dataset.nav === view));
  if (view === 'library') {
    renderCategoryChips();
    renderLibrary();
    setTimeout(() => $('#app-search')?.focus({ preventScroll: true }), 170);
  }
  if (view === 'themes') renderThemes();
  updateStorageUI();
  window.scrollTo({ top: 0, behavior: state.motion ? 'smooth' : 'auto' });
}

function installApp(id) {
  const app = apps.find((item) => item.id === id);
  if (!app || state.installed.has(id)) return;
  const nextUsage = getUsage() + app.size;
  if (state.budget && nextUsage > BUDGET_MB) {
    showToast(`Not enough room for ${app.name}. Remove a tool or turn off the guardrail.`, 'warning');
    return;
  }
  state.installed.add(id);
  saveState();
  renderQuickLaunches();
  renderFeatured();
  renderLibrary();
  updateStorageUI();
  showToast(`${app.name} added — ${app.size} MB reserved`);
}

function uninstallApp(id) {
  const app = apps.find((item) => item.id === id);
  if (!app || !state.installed.has(id)) return;
  state.installed.delete(id);
  saveState();
  renderQuickLaunches();
  renderFeatured();
  renderLibrary();
  updateStorageUI();
  showToast(`${app.name} removed from this workspace`);
}

function launchApp(id) {
  const app = apps.find((item) => item.id === id);
  if (!app) return;
  if (app.id === 'ubuntu-cli') {
    navigate('terminal');
    setTimeout(() => $('#terminal-input')?.focus(), 180);
    showToast('Ubuntu CLI session restored');
    return;
  }
  showToast(`${app.name} opened in the Lite demo`);
}

function showAppModal(id) {
  const app = apps.find((item) => item.id === id);
  if (!app) return;
  const installed = state.installed.has(id);
  const modal = $('#app-modal');
  modal.innerHTML = `
    <button type="button" class="modal-close" data-close-modal aria-label="Close details"><svg><use href="#close"></use></svg></button>
    <div class="modal-head">
      ${iconFor(app)}
      <div><h2 id="modal-title">${app.name}</h2><p>${app.subtitle}</p></div>
    </div>
    <p class="modal-description">${app.description}</p>
    <div class="modal-details">
      <div><span>Download</span><strong>${app.size} MB</strong></div>
      <div><span>Version</span><strong>${app.version}</strong></div>
      <div><span>Category</span><strong>${app.category}</strong></div>
    </div>
    ${installed
      ? `<button class="modal-install" data-modal-action="launch" data-app-id="${app.id}"><svg><use href="#play"></use></svg> Open ${app.name}</button>
         <button class="modal-install secondary" data-modal-action="remove" data-app-id="${app.id}" style="margin-top:8px">Remove from workspace</button>`
      : `<button class="modal-install" data-modal-action="install" data-app-id="${app.id}"><svg><use href="#download"></use></svg> Add to workspace · ${app.size} MB</button>
         <p class="modal-note">${getFreeSpace()} MB remains within the Lite budget.</p>`}
  `;
  $('#modal-backdrop').hidden = false;
  modal.hidden = false;
  requestAnimationFrame(() => $('.modal-close', modal)?.focus());
}

function showSystemModal(kind) {
  const content = {
    notifications: {
      icon: 'bell', title: 'All clear', text: 'Your lightweight workspace is up to date. No background downloads are running.', action: 'Nice, thanks'
    },
    profile: {
      icon: 'cpu', title: 'Realme 9 4G', text: 'TuxLite is using the arm64 starter profile. This UI keeps its local workspace inside the 700 MB target.', action: 'View system', nav: 'system'
    },
    health: {
      icon: 'shield', title: 'System check complete', text: `Workspace healthy. ${getFreeSpace()} MB is currently free and the offline app shell is ready.`, action: 'Done'
    },
    about: {
      icon: 'info', title: 'About TuxLite', text: 'A Play Store-inspired, Android-first interface concept for selecting a small Linux workspace. Package actions and terminal commands in this demo are simulated locally.', action: 'Got it'
    },
    budget: {
      icon: 'box', title: 'Lite guardrail', text: state.budget ? 'The 700 MB budget is protecting this workspace. Turn it off only if you intentionally want to allow larger combinations.' : 'The budget guardrail is currently off. You can turn it back on any time.', action: state.budget ? 'Turn off budget' : 'Turn on budget', special: 'budget'
    },
    offline: {
      icon: 'download', title: 'Offline starter kit', text: 'The app shell is cached after its first visit. A native Android wrapper can package these same static assets without a network dependency.', action: 'Ready'
    }
  }[kind];
  if (!content) return;
  const modal = $('#app-modal');
  modal.innerHTML = `
    <button type="button" class="modal-close" data-close-modal aria-label="Close dialog"><svg><use href="#close"></use></svg></button>
    <div class="modal-head"><span class="modal-system-icon"><svg><use href="#${content.icon}"></use></svg></span><div><h2 id="modal-title">${content.title}</h2><p>Termux GUI Lite</p></div></div>
    <p class="modal-description">${content.text}</p>
    <button class="modal-install" data-system-action="${content.special || 'close'}" data-navigate="${content.nav || ''}">${content.action}</button>
  `;
  $('#modal-backdrop').hidden = false;
  modal.hidden = false;
  requestAnimationFrame(() => $('.modal-close', modal)?.focus());
}

function closeModal() {
  const modal = $('#app-modal');
  modal.hidden = true;
  $('#modal-backdrop').hidden = true;
  modal.innerHTML = '';
}

function showToast(message, kind = 'success') {
  const region = $('#toast-region');
  const toast = document.createElement('div');
  toast.className = 'toast';
  const icon = kind === 'warning' ? 'info' : 'check';
  toast.innerHTML = `<svg><use href="#${icon}"></use></svg><span>${message}</span>`;
  region.append(toast);
  window.setTimeout(() => {
    toast.classList.add('out');
    window.setTimeout(() => toast.remove(), 250);
  }, 2800);
}

function escapeHTML(value) {
  return value.replace(/[&<>"]/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[character]));
}

function terminalLine(html, className = '') {
  const output = $('#terminal-output');
  const line = document.createElement('p');
  if (className) line.className = className;
  line.innerHTML = html;
  output.append(line);
  while (output.children.length > 34) output.removeChild(output.firstElementChild);
  output.scrollTop = output.scrollHeight;
}

function runTerminal(rawCommand) {
  const raw = rawCommand.trim();
  if (!raw) return;
  const command = raw.toLowerCase();
  terminalLine(`<span class="prompt">r9@tuxlite</span><span class="colon">:</span><span class="path">~</span><span class="dollar"> $</span> <span class="command">${escapeHTML(raw)}</span>`);
  if (command === 'clear') {
    $('#terminal-output').innerHTML = '';
    return;
  }
  if (command === 'help') {
    terminalLine('safe commands: <span class="terminal-success">help</span>, <span class="terminal-success">neofetch</span>, <span class="terminal-success">pkg list</span>, <span class="terminal-success">pkg install &lt;tool&gt;</span>, <span class="terminal-success">theme [name]</span>, <span class="terminal-success">ls</span>, <span class="terminal-success">pwd</span>, clear', 'terminal-response');
  } else if (command === 'neofetch') {
    terminalLine('<span class="terminal-success">TuxLite 1.0</span> · arm64 · Realme 9 4G · workspace ' + getUsage() + ' MB / ' + BUDGET_MB + ' MB', 'terminal-response');
  } else if (command === 'pkg list' || command === 'pkg ls') {
    const names = getInstalledApps().map((app) => `${app.name} <span class="terminal-success">${app.version}</span>`).join(' · ');
    terminalLine(names || 'No tools installed yet.', 'terminal-response');
  } else if (command.startsWith('pkg install ')) {
    const target = command.replace('pkg install ', '').replace(/['"]/g, '').trim();
    const match = apps.find((app) => app.id === target || app.name.toLowerCase() === target || app.name.toLowerCase().replaceAll(' ', '-') === target);
    if (!match) {
      terminalLine(`Package <span class="terminal-error">${escapeHTML(target)}</span> is not in the Lite catalog. Try <span class="terminal-success">pkg list</span>.`, 'terminal-response');
    } else if (state.installed.has(match.id)) {
      terminalLine(`<span class="terminal-success">${match.name}</span> is already installed.`, 'terminal-response');
    } else {
      installApp(match.id);
      terminalLine(`<span class="terminal-success">added ${match.name}</span> (${match.size} MB)`, 'terminal-response');
    }
  } else if (command === 'theme') {
    terminalLine(`Available palettes: ${themes.map((theme) => `<span class="terminal-success">${theme.id}</span>`).join(', ')}. Use <span class="terminal-success">theme ocean</span>.`, 'terminal-response');
  } else if (command.startsWith('theme ')) {
    const themeId = command.split(/\s+/)[1];
    if (themes.some((theme) => theme.id === themeId)) {
      applyTheme(themeId);
      terminalLine(`<span class="terminal-success">palette switched to ${themeId}</span>`, 'terminal-response');
    } else {
      terminalLine(`No palette named <span class="terminal-error">${escapeHTML(themeId)}</span>.`, 'terminal-response');
    }
  } else if (command === 'ls') {
    terminalLine('<span class="terminal-success">projects</span>  <span class="terminal-success">notes</span>  <span class="terminal-success">bin</span>  README.md', 'terminal-response');
  } else if (command === 'pwd') {
    terminalLine('/data/data/com.termux.gui.lite/files/home/workspace', 'terminal-response');
  } else if (command === 'whoami') {
    terminalLine('r9', 'terminal-response');
  } else {
    terminalLine(`<span class="terminal-error">demo shell:</span> “${escapeHTML(raw)}” is not available. Type <span class="terminal-success">help</span>.`, 'terminal-response');
  }
}

function bindEvents() {
  document.addEventListener('click', (event) => {
    const nav = event.target.closest('[data-nav]');
    if (nav) { navigate(nav.dataset.nav); return; }

    const appCard = event.target.closest('[data-open-app]');
    if (appCard && !event.target.closest('[data-row-action]')) { showAppModal(appCard.dataset.openApp); return; }

    const action = event.target.closest('[data-row-action]');
    if (action) {
      const id = action.dataset.appId;
      if (action.dataset.rowAction === 'install') installApp(id);
      else launchApp(id);
      return;
    }

    const category = event.target.closest('[data-category]');
    if (category) { state.category = category.dataset.category; renderCategoryChips(); renderLibrary(); return; }

    const theme = event.target.closest('[data-theme-choice]');
    if (theme) { applyTheme(theme.dataset.themeChoice); return; }

    if (event.target.closest('[data-close-modal]') || event.target.id === 'modal-backdrop') { closeModal(); return; }

    const modalAction = event.target.closest('[data-modal-action]');
    if (modalAction) {
      const id = modalAction.dataset.appId;
      if (modalAction.dataset.modalAction === 'install') installApp(id);
      if (modalAction.dataset.modalAction === 'remove') uninstallApp(id);
      if (modalAction.dataset.modalAction === 'launch') launchApp(id);
      closeModal();
      return;
    }

    const systemAction = event.target.closest('[data-system-action]');
    if (systemAction) {
      if (systemAction.dataset.systemAction === 'budget') {
        state.budget = !state.budget;
        saveState();
        updateStorageUI();
        showToast(state.budget ? '700 MB guardrail enabled' : '700 MB guardrail paused', 'warning');
      }
      const destination = systemAction.dataset.navigate;
      closeModal();
      if (destination) navigate(destination);
      return;
    }
  });

  document.addEventListener('keydown', (event) => {
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
      event.preventDefault(); navigate('library'); setTimeout(() => $('#app-search')?.focus(), 190);
    }
    if (event.key === 'Escape') closeModal();
    const row = event.target.closest?.('.app-row[data-open-app]');
    if (row && (event.key === 'Enter' || event.key === ' ')) { event.preventDefault(); showAppModal(row.dataset.openApp); }
  });

  $('#app-search').addEventListener('input', (event) => { state.query = event.target.value; renderLibrary(); });
  $('#library-sort-button').addEventListener('click', () => {
    const next = { featured: 'size', size: 'name', name: 'featured' };
    state.sort = next[state.sort];
    renderLibrary();
    showToast(`Sorted by ${state.sort === 'featured' ? 'recommended' : state.sort}`);
  });
  $('#update-button').addEventListener('click', () => showToast('All Lite packages are current'));
  $('#notifications-button').addEventListener('click', () => showSystemModal('notifications'));
  $('#profile-button').addEventListener('click', () => showSystemModal('profile'));
  $('#health-check-button').addEventListener('click', () => showSystemModal('health'));
  $('#about-button').addEventListener('click', () => showSystemModal('about'));
  $('#budget-button').addEventListener('click', () => showSystemModal('budget'));
  $('#offline-button').addEventListener('click', () => showSystemModal('offline'));
  $('#dark-mode-button').addEventListener('click', () => {
    state.contrast = !state.contrast;
    document.body.classList.toggle('high-contrast', state.contrast);
    $('#contrast-toggle').classList.toggle('is-on', state.contrast);
    saveState();
    showToast(state.contrast ? 'High contrast enabled' : 'High contrast relaxed');
  });
  $('#contrast-button').addEventListener('click', () => {
    state.contrast = !state.contrast;
    document.body.classList.toggle('high-contrast', state.contrast);
    $('#contrast-toggle').classList.toggle('is-on', state.contrast);
    saveState();
  });
  $('#motion-button').addEventListener('click', () => {
    state.motion = !state.motion;
    document.body.classList.toggle('reduced-motion', !state.motion);
    $('#motion-toggle').classList.toggle('is-on', state.motion);
    saveState();
    showToast(state.motion ? 'Soft motion enabled' : 'Soft motion paused');
  });
  $('#clear-terminal').addEventListener('click', () => { $('#terminal-output').innerHTML = ''; $('#terminal-input').focus(); });
  $('#terminal-form').addEventListener('submit', (event) => {
    event.preventDefault();
    const input = $('#terminal-input');
    runTerminal(input.value);
    input.value = '';
    input.focus();
  });
  $$('.command-starters [data-command]').forEach((button) => button.addEventListener('click', () => {
    runTerminal(button.dataset.command);
    $('#terminal-input').focus();
  }));
}

function initialize() {
  document.body.classList.toggle('reduced-motion', !state.motion);
  document.body.classList.toggle('high-contrast', state.contrast);
  $('#motion-toggle').classList.toggle('is-on', state.motion);
  $('#contrast-toggle').classList.toggle('is-on', state.contrast);
  renderQuickLaunches();
  renderFeatured();
  renderCategoryChips();
  renderLibrary();
  applyTheme(state.theme, true);
  updateStorageUI();
  bindEvents();
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => navigator.serviceWorker.register('./sw.js').catch(() => {}));
  }
}

initialize();
