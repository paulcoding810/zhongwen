import { ZhongwenDictionary } from "./dict.js";
import { parseEntry, isChineseCharacter } from "./utils.js";

async function loadDictData() {
  let wordDict = fetch("http://127.0.0.1:3000/data/cedict_ts.u8").then((r) =>
    r.text()
  );
  let wordIndex = fetch("http://127.0.0.1:3000/data/cedict.idx").then((r) =>
    r.text()
  );
  let grammarKeywords = fetch(
    "http://127.0.0.1:3000/data/grammarKeywordsMin.json"
  ).then((r) => r.json());
  let vocabKeywords = fetch(
    "http://127.0.0.1:3000/data/vocabularyKeywordsMin.json"
  ).then((r) => r.json());

  return Promise.all([wordDict, wordIndex, grammarKeywords, vocabKeywords]);
}

async function loadDictionary() {
  let [wordDict, wordIndex, grammarKeywords, vocabKeywords] =
    await loadDictData();
  return new ZhongwenDictionary(
    wordDict,
    wordIndex,
    grammarKeywords,
    vocabKeywords
  );
}

async function main() {
  const dict = await loadDictionary();

  parse(
    "从“南客北上”到“北雪南移”，冰雪经济日益成为我国经济新的增长点。“冷”与“热”交织、“冰”与“雪”共舞，冬季文旅消费新趋势层出不穷。热闹非凡的冰雪旅游、活力四射的冰雪运动、潜力无限的冰雪文创等产业如千帆竞发，不断打破地域和季节限制，冰雪热潮席卷全国。",
    dict
  );
}

function parse(text, dict) {
  // let t = text

  let offset = 0;
  let harr = [];
  let parr = [];

  while (offset < text.length) {
    const t = text.substring(offset, offset + 5);
    const c = t.charCodeAt(0);
    if (!isChineseCharacter(c)) {
      harr.push(t[0]);
      parr.push(t[0]);
      offset++;
      continue;
    }
    const entry = dict.wordSearch(t);
    if (!entry) {
      console.log(t + "not found");
      continue;
    }
    const word = parseEntry(entry);
    harr.push(word.simplified);
    parr.push(word.pinyin2);
    offset += word.simplified.length;
  }

  console.log(harr.join(" "));
  console.log(parr.join(" "));
}
main();
