document.addEventListener('DOMContentLoaded', function() {
  // Listen for clicks on font names
  document.getElementById('main').addEventListener('click', function(e) {
    const fontNameEl = e.target.closest('.font-name');
    if (fontNameEl) {
      const fontName = fontNameEl.dataset.font;
      showFontCharactersPage(fontName);
      window.scrollTo(0, 0);
    }
    // Back button in char page
    if (e.target.classList.contains('char-back')) {
      showMainList();
      window.scrollTo(0, 0);
    }
  });

  // For accessibility: Enter key on font name
  document.getElementById('main').addEventListener('keydown', function(e) {
    if (
      e.target.classList.contains('font-name') &&
      (e.key === 'Enter' || e.key === ' ')
    ) {
      e.preventDefault();
      const fontName = e.target.dataset.font;
      showFontCharactersPage(fontName);
      window.scrollTo(0, 0);
    }
  });

  function showMainList() {
    // Reload the initial font list (you could save this HTML elsewhere if dynamic)
    document.getElementById('main').innerHTML = `
      <div class="font-list">
        <div class="font-item">
          <span class="font-name" data-font="Rubik" tabindex="0">Rubik</span>
          <span class="font-preview" style="font-family:'Rubik'">The quick brown fox 123 !@#</span>
        </div>
        <div class="font-item">
          <span class="font-name" data-font="Roboto" tabindex="0">Roboto</span>
          <span class="font-preview" style="font-family:'Roboto'">The quick brown fox 123 !@#</span>
        </div>
        <div class="font-item">
          <span class="font-name" data-font="Oswald" tabindex="0">Oswald</span>
          <span class="font-preview" style="font-family:'Oswald'">The quick brown fox 123 !@#</span>
        </div>
      </div>
    `;
  }

  window.showFontCharactersPage = function(fontName) {
    // Character set: A-Z, a-z, 0-9, symbols
    const chars = [];
    for (let i = 32; i < 127; i++) {
      chars.push(String.fromCharCode(i));
    }
    // Build HTML
    const charHTML = chars.map(c =>
      `<span class="char-sample" style="font-family:'${fontName}',sans-serif">${c}</span>`
    ).join('');
    const pageHTML = `
      <div class="char-page">
        <h2 style="font-family:'${fontName}',sans-serif;">${fontName} – Character Set</h2>
        <div class="char-set">${charHTML}</div>
        <button type="button" class="char-back">Back</button>
      </div>
    `;
    document.getElementById('main').innerHTML = pageHTML;
  };
});