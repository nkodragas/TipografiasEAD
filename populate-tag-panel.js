import { extractYearsAndTags } from './utils.js';

export function populateTagPanel(fontsArr, onTagSelect, selectedTags = []) {
  const tagList = document.getElementById('tag-list');
  const { tags } = extractYearsAndTags(fontsArr);

  tagList.innerHTML =
    `<button class="tag-btn${selectedTags.length === 0 ? " active" : ""}" data-tag="">All</button>` +
    tags
      .map(
        tag =>
          `<button class="tag-btn${selectedTags.includes(tag) ? " active" : ""}" data-tag="${tag}">${tag}</button>`
      )
      .join('');

  tagList.querySelectorAll('.tag-btn').forEach(btn => {
    btn.addEventListener('click', () => onTagSelect(btn.dataset.tag));
  });
}