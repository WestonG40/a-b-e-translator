const americanToBritishSpelling = require('./american-to-british-spelling');
const americanToBritishTitles   = require('./american-to-british-titles');
const britishToAmericanSpelling = require('./british-to-american-spelling');
const britishToAmericanTitles   = require('./british-to-american-titles');

function translate(text, locale) {
  if (text === '') {
    return { error: 'No text to translate' };
  }

  let translation = text;
  let changed = false;

  let spellMap, titleMap, timePattern, timeReplace;

  if (locale === 'american-to-british') {
    spellMap     = americanToBritishSpelling;
    titleMap     = americanToBritishTitles;
    timePattern  = /(\d{1,2}):(\d{2})/g;
    timeReplace  = '$1.$2';
  } else if (locale === 'british-to-american') {
    spellMap     = britishToAmericanSpelling;
    titleMap     = britishToAmericanTitles;
    timePattern  = /(\d{1,2})\.(\d{2})/g;
    timeReplace  = '$1:$2';
  } else {
    return { error: 'Invalid value for locale field' };
  }

  // 1. Titles (e.g. "Mr." → "Mr")
  Object.entries(titleMap).forEach(([src, dest]) => {
    const re = new RegExp(`\\b${src}\\b`, 'gi');
    translation = translation.replace(re, (match) => {
      changed = true;
      // dest comes preformatted (with or without dot)
      return `<span class="highlight">${dest}</span>`;
    });
  });

  // 2. Spelling & terms (longest first to avoid substring collisions)
  Object.keys(spellMap)
    .sort((a, b) => b.length - a.length)
    .forEach((src) => {
      const dest = spellMap[src];
      const re = new RegExp(`\\b${src}\\b`, 'gi');
      translation = translation.replace(re, () => {
        changed = true;
        return `<span class="highlight">${dest}</span>`;
      });
    });

  // 3. Time formats
  translation = translation.replace(timePattern, (match) => {
    changed = true;
    const replaced = match.replace(timePattern, timeReplace);
    return `<span class="highlight">${replaced}</span>`;
  });

  if (!changed) {
    return {
      text,
      translation: 'Everything looks good to me!'
    };
  }

  return { text, translation };
}

module.exports = { translate };
