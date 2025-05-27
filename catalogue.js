// Example data structure – update with your real folder structure and font files!
const fonts = [
  {
    year: "2020",
    author: "Jane Doe",
    file: "2020/JaneDoe/ExampleFont.ttf",
    name: "ExampleFont"
  },
  {
    year: "2021",
    author: "John Smith",
    file: "2021/JohnSmith/AnotherFont.ttf",
    name: "AnotherFont"
  }
  // Add more fonts here
];

function createFontFace(font) {
  const fontFace = new FontFace(font.name, `url(${font.file})`);
  document.fonts.add(fontFace);
  fontFace.load();
}

function renderCatalogue() {
  const container = document.getElementById('catalogue');
  fonts.forEach(font => {
    createFontFace(font);
    const div = document.createElement('div');
    div.className = 'font-sample';
    div.innerHTML = `
      <div class="font-title">${font.name}</div>
      <div class="font-meta">${font.year} &mdash; ${font.author}</div>
      <div class="preview" style="font-family:'${font.name}', sans-serif;">The quick brown fox jumps over the lazy dog</div>
      <a href="${font.file}" download>Download</a>
    `;
    container.appendChild(div);
  });
}

renderCatalogue();