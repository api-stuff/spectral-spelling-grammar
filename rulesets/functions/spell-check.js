const SpellChecker = require('spellchecker');

export default (input) => { // eslint-disable-line consistent-return
  const words = input.split(/(\w+)/g);
  const misspeltWords = words
    .filter((word) => SpellChecker.isMisspelled(word));

  if (misspeltWords.length > 0) {
    return [{
      message: `Misspelt words found in text: ${misspeltWords.join(', ')}`,
    }];
  }
};
