import fonts from './catalogue.js';

const output = document.getElementById('output');
fonts.forEach(font => {
  const div = document.createElement('div');
  div.innerHTML = `
    <strong>${font.author}</strong> (${font.year})<br>
    ${font.name ? `Font: ${font.name}<br>` : ''}
    ${font.file ? `<a href="${font.file}">Download Font</a><br>` : ''}
    ${font.specimen ? 
      (Array.isArray(font.specimen) 
        ? font.specimen.map(s => `<a href="${s}">${s}</a>`).join('<br>') 
        : `<a href="${font.specimen}">${font.specimen}</a>`) 
      : ''
    }
    <hr>
  `;
  output.appendChild(div);
});