export function filterFonts(fontsArr, year, tagsArr, teacher) {
  return fontsArr.filter(f => {
    const yearMatch = !year || f.year === year;
    const tagMatch =
      !tagsArr || tagsArr.length === 0 ||
      (f.tags && tagsArr.some(tag =>
        f.tags.some(t => t.toLowerCase() === tag.toLowerCase())
      ));
    const teacherMatch = !teacher || f.teacher === teacher;
    return yearMatch && tagMatch && teacherMatch;
  });
}