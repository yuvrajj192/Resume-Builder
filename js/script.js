/* ============================================
   ResumeForge - script.js
   All JavaScript logic for the Resume Builder
   ============================================ */

// ---- Global State ----
let currentTemplate = 'classic';
let photoDataUrl = '';
let skills = [];
let data = {
  experience: [],
  education: [],
  projects: [],
  certifications: []
};
let counters = {
  experience: 0,
  education: 0,
  projects: 0,
  certifications: 0
};

// ============================================
// INITIALIZATION
// ============================================
function init() {
  addEntry('experience');
  addEntry('education');
  addEntry('projects');
  update();
}

// ============================================
// PHOTO UPLOAD
// ============================================
function handlePhoto(e) {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (ev) => {
    photoDataUrl = ev.target.result;

    const preview = document.getElementById('photoPreview');
    const placeholder = document.getElementById('photoPlaceholder');

    preview.src = photoDataUrl;
    preview.style.display = 'block';
    placeholder.style.display = 'none';

    update();
  };
  reader.readAsDataURL(file);
}

// ============================================
// SKILLS MANAGEMENT
// ============================================
function addSkill() {
  const input = document.getElementById('skillInput');
  const val = input.value.trim();

  if (!val || skills.includes(val)) return;

  skills.push(val);
  input.value = '';
  renderSkillChips();
  update();
}

function removeSkill(skillName) {
  skills = skills.filter(s => s !== skillName);
  renderSkillChips();
  update();
}

function renderSkillChips() {
  const container = document.getElementById('skills-list');
  container.innerHTML = skills.map(s => `
    <div class="skill-chip">
      ${s}
      <button onclick="removeSkill('${s}')">×</button>
    </div>
  `).join('');
}

// ============================================
// DYNAMIC ENTRY MANAGEMENT (Experience, Education, etc.)
// ============================================
function addEntry(type) {
  const id = `${type}_${++counters[type]}`;
  data[type].push({ id });

  const container = document.getElementById(`${type}-list`);
  const card = document.createElement('div');
  card.className = 'entry-card';
  card.id = `card_${id}`;

  let fields = '';

  if (type === 'experience') {
    fields = `
      <div class="form-row">
        <div class="form-group">
          <label>Job Title</label>
          <input type="text" placeholder="Software Engineer" oninput="updateEntry('${id}', 'title', this.value)"/>
        </div>
        <div class="form-group">
          <label>Company</label>
          <input type="text" placeholder="Google Inc." oninput="updateEntry('${id}', 'subtitle', this.value)"/>
        </div>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label>Start Date</label>
          <input type="text" placeholder="Jan 2022" oninput="updateEntry('${id}', 'start', this.value)"/>
        </div>
        <div class="form-group">
          <label>End Date</label>
          <input type="text" placeholder="Present" oninput="updateEntry('${id}', 'end', this.value)"/>
        </div>
      </div>
      <div class="form-group">
        <label>Description</label>
        <textarea placeholder="Describe your responsibilities and achievements..." oninput="updateEntry('${id}', 'desc', this.value)"></textarea>
      </div>
    `;
  }

  else if (type === 'education') {
    fields = `
      <div class="form-row">
        <div class="form-group">
          <label>Degree</label>
          <input type="text" placeholder="B.Tech Computer Science" oninput="updateEntry('${id}', 'title', this.value)"/>
        </div>
        <div class="form-group">
          <label>Institution</label>
          <input type="text" placeholder="IIT Bombay" oninput="updateEntry('${id}', 'subtitle', this.value)"/>
        </div>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label>Start Year</label>
          <input type="text" placeholder="2020" oninput="updateEntry('${id}', 'start', this.value)"/>
        </div>
        <div class="form-group">
          <label>End Year</label>
          <input type="text" placeholder="2024" oninput="updateEntry('${id}', 'end', this.value)"/>
        </div>
      </div>
      <div class="form-group">
        <label>CGPA / Grade</label>
        <input type="text" placeholder="8.5 / 10" oninput="updateEntry('${id}', 'desc', this.value)"/>
      </div>
    `;
  }

  else if (type === 'projects') {
    fields = `
      <div class="form-row">
        <div class="form-group">
          <label>Project Name</label>
          <input type="text" placeholder="Resume Builder App" oninput="updateEntry('${id}', 'title', this.value)"/>
        </div>
        <div class="form-group">
          <label>Tech Stack</label>
          <input type="text" placeholder="HTML, CSS, JS" oninput="updateEntry('${id}', 'subtitle', this.value)"/>
        </div>
      </div>
      <div class="form-group">
        <label>Date / Duration</label>
        <input type="text" placeholder="Jan 2024" oninput="updateEntry('${id}', 'start', this.value)"/>
      </div>
      <div class="form-group">
        <label>Description</label>
        <textarea placeholder="Describe what the project does and your role..." oninput="updateEntry('${id}', 'desc', this.value)"></textarea>
      </div>
    `;
  }

  else if (type === 'certifications') {
    fields = `
      <div class="form-row">
        <div class="form-group">
          <label>Certification Name</label>
          <input type="text" placeholder="AWS Solutions Architect" oninput="updateEntry('${id}', 'title', this.value)"/>
        </div>
        <div class="form-group">
          <label>Issuing Organization</label>
          <input type="text" placeholder="Amazon" oninput="updateEntry('${id}', 'subtitle', this.value)"/>
        </div>
      </div>
      <div class="form-group">
        <label>Date</label>
        <input type="text" placeholder="March 2023" oninput="updateEntry('${id}', 'start', this.value)"/>
      </div>
    `;
  }

  card.innerHTML = `
    <button class="remove-btn" onclick="removeEntry('${type}', '${id}')">✕</button>
    ${fields}
  `;

  container.appendChild(card);
}

function updateEntry(id, field, value) {
  const type = id.split('_')[0];
  const entry = data[type].find(e => e.id === id);
  if (entry) {
    entry[field] = value;
    update();
  }
}

function removeEntry(type, id) {
  data[type] = data[type].filter(e => e.id !== id);
  const card = document.getElementById(`card_${id}`);
  if (card) card.remove();
  update();
}

// ============================================
// TEMPLATE SWITCHING
// ============================================
function setTemplate(t) {
  currentTemplate = t;
  document.querySelectorAll('.tab-btn').forEach((btn, i) => {
    btn.classList.toggle('active', ['classic', 'modern', 'minimal'][i] === t);
  });
  update();
}

// ============================================
// HELPER: Get input value safely
// ============================================
function getVal(id) {
  return document.getElementById(id)?.value || '';
}

// ============================================
// HELPER: Render entry list for a section
// ============================================
function renderEntries(type) {
  return data[type]
    .filter(e => e.title || e.subtitle)
    .map(e => {
      const dateStr = e.start
        ? (e.end ? `${e.start} – ${e.end}` : e.start)
        : '';
      return { ...e, dateStr };
    });
}

// ============================================
// MAIN RENDER FUNCTION (Live Preview)
// ============================================
function update() {
  // Collect form values
  const firstName = getVal('firstName');
  const lastName  = getVal('lastName');
  const name      = `${firstName} ${lastName}`.trim() || 'Your Name';
  const role      = getVal('jobTitle') || 'Your Job Title';
  const email     = getVal('email');
  const phone     = getVal('phone');
  const location  = getVal('location');
  const linkedin  = getVal('linkedin');
  const summary   = getVal('summary');

  // Photo HTML
  const photoHTML = photoDataUrl
    ? `<img class="r-photo" src="${photoDataUrl}" alt="Profile Photo"/>`
    : `<div class="r-photo-placeholder">👤</div>`;

  // Contact row
  const contactItems = [
    email    && `<span>✉ ${email}</span>`,
    phone    && `<span>📞 ${phone}</span>`,
    location && `<span>📍 ${location}</span>`,
    linkedin && `<span>🔗 ${linkedin}</span>`,
  ].filter(Boolean).join('');

  // ---- Render by template ----
  let html = '';

  // ==========================================
  // CLASSIC TEMPLATE
  // ==========================================
  if (currentTemplate === 'classic') {

    const expHTML = renderEntries('experience').map(e => `
      <div class="r-entry">
        <div class="r-entry-header">
          <div>
            <div class="r-entry-title">${e.title || ''}</div>
            <div class="r-entry-subtitle">${e.subtitle || ''}</div>
          </div>
          <div class="r-entry-date">${e.dateStr}</div>
        </div>
        ${e.desc ? `<div class="r-entry-desc">${e.desc}</div>` : ''}
      </div>
    `).join('');

    const eduHTML = renderEntries('education').map(e => `
      <div class="r-entry">
        <div class="r-entry-header">
          <div>
            <div class="r-entry-title">${e.title || ''}</div>
            <div class="r-entry-subtitle">${e.subtitle || ''}</div>
          </div>
          <div class="r-entry-date">${e.dateStr}</div>
        </div>
        ${e.desc ? `<div class="r-entry-desc">${e.desc}</div>` : ''}
      </div>
    `).join('');

    const projHTML = renderEntries('projects').map(e => `
      <div class="r-entry">
        <div class="r-entry-header">
          <div>
            <div class="r-entry-title">${e.title || ''}</div>
            <div class="r-entry-subtitle">${e.subtitle || ''}</div>
          </div>
          <div class="r-entry-date">${e.dateStr}</div>
        </div>
        ${e.desc ? `<div class="r-entry-desc">${e.desc}</div>` : ''}
      </div>
    `).join('');

    const certHTML = renderEntries('certifications').map(e => `
      <div class="r-entry">
        <div class="r-entry-title">${e.title || ''}</div>
        <div class="r-entry-subtitle">${e.subtitle || ''} ${e.start ? '· ' + e.start : ''}</div>
      </div>
    `).join('');

    const skillBarsHTML = skills.map((s, i) => `
      <div class="skill-bar-item">
        <div class="skill-bar-label">${s}</div>
        <div class="skill-bar">
          <div class="skill-bar-fill" style="width:${75 + (i % 4) * 6}%"></div>
        </div>
      </div>
    `).join('');

    html = `
      <div class="r-header">
        ${photoHTML}
        <div>
          <div class="r-name">${name}</div>
          <div class="r-role">${role}</div>
          <div class="r-contact">${contactItems}</div>
        </div>
      </div>
      <div class="r-body">
        <div class="r-main">
          ${summary ? `<div class="r-section"><div class="r-section-title">Summary</div><div class="r-summary">${summary}</div></div>` : ''}
          ${expHTML  ? `<div class="r-section"><div class="r-section-title">Work Experience</div>${expHTML}</div>` : ''}
          ${projHTML ? `<div class="r-section"><div class="r-section-title">Projects</div>${projHTML}</div>` : ''}
        </div>
        <div class="r-sidebar">
          ${eduHTML      ? `<div class="r-section"><div class="r-section-title">Education</div>${eduHTML}</div>` : ''}
          ${skills.length ? `<div class="r-section"><div class="r-section-title">Skills</div>${skillBarsHTML}</div>` : ''}
          ${certHTML     ? `<div class="r-section"><div class="r-section-title">Certifications</div>${certHTML}</div>` : ''}
        </div>
      </div>
    `;
  }

  // ==========================================
  // MODERN TEMPLATE
  // ==========================================
  else if (currentTemplate === 'modern') {

    const expHTML = renderEntries('experience').map(e => `
      <div class="r-entry">
        <div class="r-entry-title">${e.title || ''}</div>
        <div class="r-entry-date">${e.dateStr}</div>
        <div class="r-entry-subtitle">${e.subtitle || ''}</div>
        ${e.desc ? `<div class="r-entry-desc">${e.desc}</div>` : ''}
      </div>
    `).join('');

    const eduHTML = renderEntries('education').map(e => `
      <div class="r-entry">
        <div class="r-entry-title">${e.title || ''}</div>
        <div class="r-entry-date">${e.dateStr}</div>
        <div class="r-entry-subtitle">${e.subtitle || ''}</div>
        ${e.desc ? `<div class="r-entry-desc">${e.desc}</div>` : ''}
      </div>
    `).join('');

    const projHTML = renderEntries('projects').map(e => `
      <div class="r-entry">
        <div class="r-entry-title">${e.title || ''}</div>
        <div class="r-entry-date">${e.dateStr}</div>
        <div class="r-entry-subtitle">${e.subtitle || ''}</div>
        ${e.desc ? `<div class="r-entry-desc">${e.desc}</div>` : ''}
      </div>
    `).join('');

    const certHTML = renderEntries('certifications').map(e => `
      <div class="r-entry">
        <div class="r-entry-title">${e.title || ''}</div>
        <div class="r-entry-subtitle">${e.subtitle || ''} ${e.start ? '· ' + e.start : ''}</div>
      </div>
    `).join('');

    const skillChipsHTML = `
      <div class="skill-chips">
        ${skills.map(s => `<span class="skill-chip-r">${s}</span>`).join('')}
      </div>
    `;

    html = `
      <div class="r-header">
        <div class="r-header-inner">
          ${photoHTML}
          <div>
            <div class="r-name">${name}</div>
            <div class="r-role">${role}</div>
            <div class="r-contact">${contactItems}</div>
          </div>
        </div>
      </div>
      <div class="r-body">
        ${summary ? `<div class="r-section"><div class="r-section-title">🎯 Summary</div><div class="r-summary">${summary}</div></div>` : ''}
        <div class="r-columns">
          <div>
            ${expHTML  ? `<div class="r-section"><div class="r-section-title">💼 Experience</div>${expHTML}</div>` : ''}
            ${projHTML ? `<div class="r-section"><div class="r-section-title">🚀 Projects</div>${projHTML}</div>` : ''}
          </div>
          <div>
            ${eduHTML      ? `<div class="r-section"><div class="r-section-title">🎓 Education</div>${eduHTML}</div>` : ''}
            ${skills.length ? `<div class="r-section"><div class="r-section-title">⚡ Skills</div>${skillChipsHTML}</div>` : ''}
            ${certHTML     ? `<div class="r-section"><div class="r-section-title">🏆 Certifications</div>${certHTML}</div>` : ''}
          </div>
        </div>
      </div>
    `;
  }

  // ==========================================
  // MINIMAL TEMPLATE
  // ==========================================
  else if (currentTemplate === 'minimal') {

    const expHTML = renderEntries('experience').map(e => `
      <div class="r-entry">
        <div class="r-entry-title">${e.title || ''}</div>
        <div class="r-entry-subtitle">${e.subtitle || ''}</div>
        <div class="r-entry-date">${e.dateStr}</div>
        ${e.desc ? `<div class="r-entry-desc">${e.desc}</div>` : ''}
      </div>
    `).join('');

    const eduHTML = renderEntries('education').map(e => `
      <div class="r-entry">
        <div class="r-entry-title">${e.title || ''}</div>
        <div class="r-entry-subtitle">${e.subtitle || ''}</div>
        <div class="r-entry-date">${e.dateStr}</div>
        ${e.desc ? `<div class="r-entry-desc">${e.desc}</div>` : ''}
      </div>
    `).join('');

    const projHTML = renderEntries('projects').map(e => `
      <div class="r-entry">
        <div class="r-entry-title">${e.title || ''}</div>
        <div class="r-entry-subtitle">${e.subtitle || ''}</div>
        <div class="r-entry-date">${e.dateStr}</div>
        ${e.desc ? `<div class="r-entry-desc">${e.desc}</div>` : ''}
      </div>
    `).join('');

    const certHTML = renderEntries('certifications').map(e => `
      <div class="r-entry">
        <div class="r-entry-title">${e.title || ''}</div>
        <div class="r-entry-subtitle">${e.subtitle || ''} ${e.start ? '· ' + e.start : ''}</div>
      </div>
    `).join('');

    const skillListHTML = `
      <div class="skill-list">
        ${skills.map(s => `<div class="skill-item">${s}</div>`).join('')}
      </div>
    `;

    html = `
      <div class="r-header">
        ${photoHTML}
        <div>
          <div class="r-name">${name}</div>
          <div class="r-role">${role}</div>
          <div class="r-contact">${contactItems}</div>
        </div>
      </div>
      <div class="r-body">
        <div class="r-left">
          ${summary ? `<div class="r-section"><div class="r-section-title">About</div><div class="r-summary">${summary}</div></div>` : ''}
          ${expHTML  ? `<div class="r-section"><div class="r-section-title">Experience</div>${expHTML}</div>` : ''}
          ${projHTML ? `<div class="r-section"><div class="r-section-title">Projects</div>${projHTML}</div>` : ''}
        </div>
        <div class="r-right">
          ${eduHTML      ? `<div class="r-section"><div class="r-section-title">Education</div>${eduHTML}</div>` : ''}
          ${skills.length ? `<div class="r-section"><div class="r-section-title">Skills</div>${skillListHTML}</div>` : ''}
          ${certHTML     ? `<div class="r-section"><div class="r-section-title">Certifications</div>${certHTML}</div>` : ''}
        </div>
      </div>
    `;
  }

  // Apply HTML to resume preview
  const resume = document.getElementById('resumePreview');
  resume.className = `resume ${currentTemplate}`;
  resume.innerHTML = html;
}

// ============================================
// DOWNLOAD AS PDF
// ============================================
function downloadPDF() {
  const resume = document.getElementById('resumePreview');
  const firstName = getVal('firstName');
  const lastName  = getVal('lastName');
  const filename  = `${firstName}_${lastName}_Resume`.trim() || 'My_Resume';

  // Temporarily remove CSS transform for clean PDF export
  resume.style.transform = 'none';
  resume.style.margin = '0';

  const options = {
    margin: 0,
    filename: `${filename}.pdf`,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2, useCORS: true, logging: false },
    jsPDF: { unit: 'px', format: [794, 1123], orientation: 'portrait' }
  };

  html2pdf()
  .set(options)
  .from(resume)
  .save()
  .then(async () => {
    // Restore UI
    resume.style.transform = '';
    resume.style.margin = '';

    try {
      // Convert resume to blob
      const pdfBlob = await html2pdf().from(resume).outputPdf('blob');

      // Get resume data
      const resumeData = getResumeData();

      // Save to history
      await StorageManager.saveToHistory(
        resumeData,
        pdfBlob,
        currentTemplate
      );

      console.log("✅ Saved to history");
    } catch (err) {
      console.error("❌ History save failed:", err);
    }
  });
}

// ============================================
// START THE APP
// ============================================
init();
