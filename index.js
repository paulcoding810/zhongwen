import { ZhongwenDictionary } from "./dict.js";
import { parseEntry } from "./utils.js";

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
  const entry = dict.wordSearch("喜欢");
  console.log(parseEntry(entry));
}

main();
