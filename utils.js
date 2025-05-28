export function extractYearsAndTags(fontsArr) {
  const yearSet = new Set();
  const tagSet = new Set();
  fontsArr.forEach(f => {
    yearSet.add(f.year);
    (f.tags || []).forEach(tag => tagSet.add(tag));
  });
  return {
    years: Array.from(yearSet).sort(),
    tags: Array.from(tagSet).sort(),
  };
}