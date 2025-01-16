let tones = {
  1: "&#772;",
  2: "&#769;",
  3: "&#780;",
  4: "&#768;",
  5: "",
};

let utones = {
  1: "\u0304",
  2: "\u0301",
  3: "\u030C",
  4: "\u0300",
  5: "",
};

function parseEntry(entry) {
  const match = entry.data[0][0].match(
    /^([^\s]+?)\s+([^\s]+?)\s+\[(.*?)\]?\s*\/(.+)\//
  );
  return {
    traditional: match[1],
    simplified: match[2],
    pinyin: match[3],
    pinyin2: getTones(match[3]),
    meaning: match[4],
  };
}

function getTones(p) {
  const a = p.split(/[\s·]+/);
  let tones = "";
  for (let index = 0; index < a.length; index++) {
    const syllable = a[index];
    const vowels = parse(syllable);
    const t = tonify(vowels[2], vowels[4]);
    tones += vowels[1] + t[1] + vowels[3];
  }

  return tones;
}

function parse(s) {
  return s.match(/([^AEIOU:aeiou]*)([AEIOUaeiou:]+)([^aeiou:]*)([1-5])/);
}

function tonify(vowels, tone) {
  let html = "";
  let text = "";

  if (vowels === "ou") {
    html = "o" + tones[tone] + "u";
    text = "o" + utones[tone] + "u";
  } else {
    let tonified = false;
    for (let i = 0; i < vowels.length; i++) {
      let c = vowels.charAt(i);
      html += c;
      text += c;
      if (c === "a" || c === "e") {
        html += tones[tone];
        text += utones[tone];
        tonified = true;
      } else if (i === vowels.length - 1 && !tonified) {
        html += tones[tone];
        text += utones[tone];
        tonified = true;
      }
    }
    html = html.replace(/u:/, "&uuml;");
    text = text.replace(/u:/, "\u00FC");
  }

  return [html, text];
}

export { parseEntry, getTones, tonify };
