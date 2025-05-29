import fonts from './catalogue.js';
import { filterFonts } from './tag-filter.js';
import { populateTagPanel } from './populate-tag-panel.js';
import { extractYearsAndTags } from './utils.js';

// UI elements
const fontColor = document.getElementById('fontColor');
const bgColor = document.getElementById('bgColor');
const fontSize = document.getElementById('fontSize');
const fontSizeValue = document.getElementById('fontSizeValue');
const letterSpacing = document.getElementById('letterSpacing');
const letterSpacingValue = document.getElementById('letterSpacingValue');
const yearFilter = document.getElementById('yearFilter');
const teacherFilter = document.getElementById('teacherFilter');
const asignaturaFilter = document.getElementById('AsignaturaFilter');
const previewTextInput = document.getElementById('previewText');
const output = document.getElementById('output');

let selectedTags = [];

// Styles for preview
let previewStyles = {
  color: fontColor.value,
  background: bgColor.value,
  fontSize: fontSize.value + 'px',
  letterSpacing: letterSpacing.value + 'em'
};

// Preview text value
const defaultPreviewText = "A quick brown fox jumps over the lazy dog";
let previewText = previewTextInput.value = defaultPreviewText;

// --- Utility functions ---
function getSpecimenImage(font) {
  return `${font.year}/${font.author}/thumb.png`;
}
function makeSpecimenDisplay(font) {
  const img = getSpecimenImage(font);
  return `<img class="specimen-thumb" src="${img}" alt="Specimen for ${font.name}" title="Specimen for ${font.name}">`;
}
function isPdf(file) {
  return typeof file === "string" && file.toLowerCase().endsWith('.pdf');
}
function makePdfDisplay(specimen, fontName = "") {
  if (!specimen) return '';
  if (Array.isArray(specimen)) {
    return specimen.filter(isPdf).map(
      pdf => `<a class="specimen-link" href="${pdf}" target="_blank" rel="noopener">PDF specimen: ${fontName || pdf.split('/').pop()}</a>`
    ).join(' ');
  } else if (isPdf(specimen)) {
    return `<a class="specimen-link" href="${specimen}" target="_blank" rel="noopener">PDF specimen: ${fontName || specimen.split('/').pop()}</a>`;
  }
  return '';
}
function makeTags(tags) {
  if (!tags || tags.length === 0) return '';
  return `<span class="font-tags">${tags.map(tag => `<span class="font-tag">${tag}</span>`).join('')}</span>`;
}
function registerFont(fontFile, fontName, uniqueSuffix) {
  const fontId = `Font_${fontName.replace(/\W+/g, '')}_${uniqueSuffix}`;
  if (document.getElementById(fontId)) return fontId;
  const style = document.createElement('style');
  style.id = fontId;
  style.textContent = `
    @font-face {
      font-family: '${fontId}';
      src: url('${fontFile}');
    }
  `;
  document.head.appendChild(style);
  return fontId;
}
function groupFonts(fontsArr) {
  const years = {};
  fontsArr.forEach(entry => {
    if (!years[entry.year]) years[entry.year] = {};
    if (!years[entry.year][entry.author]) years[entry.year][entry.author] = [];
    years[entry.year][entry.author].push(entry);
  });
  return years;
}
function populateFilters(fontsArr) {
  const { years } = extractYearsAndTags(fontsArr);
  yearFilter.innerHTML = `<option value="">All years</option>` +
    years.map(y => `<option value="${y}">${y}</option>`).join('');
}

// --- Main rendering function ---
function renderCatalogue(filteredFonts) {
  output.innerHTML = '';
  const years = groupFonts(filteredFonts);
  Object.keys(years).sort().forEach(year => {
    const yearDiv = document.createElement('div');
    yearDiv.className = 'year-block';
    yearDiv.innerHTML = `<div class="year-title">${year}</div>`;
    Object.keys(years[year]).sort().forEach(author => {
      const authorDiv = document.createElement('div');
      authorDiv.className = 'author-block';
      authorDiv.innerHTML = `<div class="author-title">${author}</div>`;
      const fontEntries = years[year][author].filter(e => e.file || e.name);
      if (fontEntries.length === 0) return;
      const fontList = document.createElement('div');
      fontList.className = 'font-list';
      if (fontEntries.length === 1) fontList.classList.add('single-column');
      fontEntries.forEach((font, idx) => {
        const fontDiv = document.createElement('div');
        fontDiv.className = 'font-item';
        if (fontEntries.length === 1) fontDiv.classList.add('single-column');

        // Font preview
        let preview = '';
        if (font.file && (font.file.endsWith('.otf') || font.file.endsWith('.ttf'))) {
          const fam = registerFont(font.file, font.name || 'Font', year + author + idx);
          preview = `<span class="font-preview" contenteditable="true"
            spellcheck="false"
            style="font-family: '${fam}', sans-serif; color: ${previewStyles.color}; background: ${previewStyles.background}; font-size: ${previewStyles.fontSize}; letter-spacing: ${previewStyles.letterSpacing};"
            >${previewText}</span>`;
        }

        // Dropdown menu for download/thumb/pdf
        const dropdown = `
          <details class="font-dropdown">
            <summary class="font-dropdown-summary">More</summary>
            <div class="font-dropdown-content">
              ${font.file ? `<a class="font-link" href="${font.file}" download>Download font</a><br>` : ''}
              ${makeSpecimenDisplay(font)}
              ${makePdfDisplay(font.specimen, font.name)}
            </div>
          </details>
        `;

        fontDiv.innerHTML = `
          <div class="font-row-main">
            ${font.name ? `<a class="font-name" href="${font.year}/${font.author}/${font.name}/index.html" target="_blank">${font.name}</a>` : ''}
          </div>
          ${preview}
          ${dropdown}
          ${makeTags(font.tags)}
        `;
        fontList.appendChild(fontDiv);
      });
      authorDiv.appendChild(fontList);
      yearDiv.appendChild(authorDiv);
    });
    output.appendChild(yearDiv);
  });
}

// --- Update previews (styles and text) ---
function updatePreviews(updateText = false) {
  previewStyles.color = fontColor.value;
  previewStyles.background = bgColor.value;
  previewStyles.fontSize = fontSize.value + 'px';
  previewStyles.letterSpacing = letterSpacing.value + 'em';
  fontSizeValue.textContent = fontSize.value;
  letterSpacingValue.textContent = letterSpacing.value;
  document.querySelectorAll('.font-preview').forEach(el => {
    el.style.color = previewStyles.color;
    el.style.background = previewStyles.background;
    el.style.fontSize = previewStyles.fontSize;
    el.style.letterSpacing = previewStyles.letterSpacing;
    if (updateText) el.textContent = previewText;
  });
}

// --- Tag selection (multi-select) ---
function onTagSelect(tag) {
  if (!tag) {
    selectedTags = [];
  } else {
    if (selectedTags.includes(tag)) {
      selectedTags = selectedTags.filter(t => t !== tag);
    } else {
      selectedTags.push(tag);
    }
  }
  populateTagPanel(fonts, onTagSelect, selectedTags);
  applyFilters();
}

// --- Filtering ---
function applyFilters() {
  const year = yearFilter.value;
  const teacher = teacherFilter.value;
  const asignatura = asignaturaFilter.value;
  let filtered = fonts;
  // Asignatura filter: optional, only filter if set
  if (asignatura) {
    filtered = filtered.filter(f => f.asignatura === asignatura);
  }
  filtered = filterFonts(filtered, year, selectedTags, teacher);
  renderCatalogue(filtered);
  updatePreviews(true);
}

// --- Animated loading text with random fonts ---

// Helper to get all font families from your catalogue
function getAllFontFamilies(fontsArr) {
  // Only include fonts with a file (so they are registered)
  return fontsArr
    .filter(f => f.file && (f.file.endsWith('.otf') || f.file.endsWith('.ttf')))
    .map((f, idx) => registerFont(f.file, f.name || 'Font', 'loading' + idx));
}

// Animate loading text
function animateLoadingText(fontsArr) {
  const overlay = document.getElementById('loading-overlay');
  const textDiv = overlay.querySelector('.loading-text');
  if (!textDiv) return;
  const loadingText = textDiv.textContent;
  const fontFamilies = getAllFontFamilies(fontsArr);

  // Replace text with spans
  textDiv.innerHTML = loadingText.split('').map((char, i) =>
    `<span class="loading-char" data-idx="${i}">${char === ' ' ? '&nbsp;' : char}</span>`
  ).join('');

  function randomFont() {
    return fontFamilies[Math.floor(Math.random() * fontFamilies.length)];
  }

  // Animate: change font-family of each char every 200ms
  let interval = setInterval(() => {
    textDiv.querySelectorAll('.loading-char').forEach(span => {
      span.style.fontFamily = `'${randomFont()}', sans-serif`;
    });
  }, 200);

  // Stop animation when overlay is hidden
  const observer = new MutationObserver(() => {
    if (overlay.style.opacity === "0" || overlay.style.display === "none") {
      clearInterval(interval);
      observer.disconnect();
    }
  });
  observer.observe(overlay, { attributes: true, attributeFilter: ['style'] });
}

// Call this right after fonts are loaded/registered, before hiding overlay
animateLoadingText(fonts);

// --- Event listeners ---
fontColor.addEventListener('input', () => updatePreviews(false));
bgColor.addEventListener('input', () => updatePreviews(false));
fontSize.addEventListener('input', () => updatePreviews(false));
letterSpacing.addEventListener('input', () => updatePreviews(false));
yearFilter.addEventListener('change', applyFilters);
teacherFilter.addEventListener('change', applyFilters);
asignaturaFilter.addEventListener('change', applyFilters);
previewTextInput.addEventListener('input', () => {
  previewText = previewTextInput.value;
  updatePreviews(true);
});

// Create and append the reset button right after previewTextInput is defined
const previewTextReset = document.createElement('button');
previewTextReset.textContent = 'Reset';
previewTextReset.type = 'button';
previewTextReset.style.marginLeft = '0.5em';
previewTextInput.parentNode.appendChild(previewTextReset);

// Now add the event listener
previewTextReset.addEventListener('click', () => {
  previewTextInput.value = defaultPreviewText;
  previewText = defaultPreviewText;
  updatePreviews(true);
});

// --- Initial setup ---
populateTagPanel(fonts, onTagSelect, selectedTags);
populateFilters(fonts);
renderCatalogue(fonts);
updatePreviews(true);

// Hide loading overlay
setTimeout(() => {
  const overlay = document.getElementById('loading-overlay');
  overlay.style.opacity = 0;
  setTimeout(() => overlay.style.display = 'none', 500);
}, 2000);