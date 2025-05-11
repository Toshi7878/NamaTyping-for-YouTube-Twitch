class MargeRepl {
  sortRepl() {
    let sort = this.result.sort(
      (first, second) => second[0].length - first[0].length
    );

    let numRepl = [];

    for (let i = 0; i < sort.length; i++) {
      const isNUM = !isNaN(parseInt(sort[i][0]));

      if (isNUM) {
        numRepl.push(sort[i]);
        sort.splice(i, 1);
        i--;
      }
    }

    numRepl = numRepl.sort(
      (first, second) => parseInt(first[0]) - parseInt(second[0])
    );

    return numRepl.concat(sort);
  }

  marge(comparisonLyrics) {
    let replSort = this.sortRepl();

    for (let i = 0; i < comparisonLyrics.length; i++) {
      for (let j = 0; j < comparisonLyrics[i].length; j++) {
        if (/[一-龥]/.test(comparisonLyrics[i])) {
          for (let m = 0; m < replSort.length; m++) {
            comparisonLyrics[i][j] = comparisonLyrics[i][j].replace(
              RegExp(replSort[m][0], "g"),
              "\t@@" + m + "@@\t"
            );
          }
        }
      }
    }

    for (let i = 0; i < comparisonLyrics.length; i++) {
      for (let j = 0; j < comparisonLyrics[i].length; j++) {
        let line = comparisonLyrics[i][j].split("\t").filter((x) => x !== "");

        for (let m = 0; m < line.length; m++) {
          if (
            line[m].slice(0, 2) == "@@" &&
            line[m].slice(-2) == "@@" &&
            replSort[parseFloat(line[m].slice(2))]
          ) {
            line[m] = replSort[parseFloat(line[m].slice(2))];
          } else {
            line[m] = [line[m]];
          }
        }

        comparisonLyrics[i][j] = line;
      }
    }

    return comparisonLyrics;
  }
}

class Repl extends MargeRepl {
  constructor(data = []) {
    super();
    this.result = data;
  }

  async getReplData(lyrics) {
    this.result = await this.postMorphAPI(lyrics);
  }

  async postMorphAPI(SENTENCE) {
    try {
      const tokenizedWords = await postAwsLambdaMorphApi(SENTENCE);

      let repl = [];
      let uniqueList = [];

      for (let i = 0; i < tokenizedWords.lyrics.length; i++) {
        if (
          /[一-龥]/.test(tokenizedWords.lyrics[i]) &&
          !uniqueList.includes(tokenizedWords.readings[i])
        ) {
          uniqueList.push(tokenizedWords.readings[i]);
          repl.push([tokenizedWords.lyrics[i], tokenizedWords.readings[i]]);
        }
      }

      return repl;
    } catch (error) {
      console.error("Error:", error.message);
    }
  }

  kanaToHira(str) {
    return str.replace(/[\u30a1-\u30f6]/g, function (match) {
      var chr = match.charCodeAt(0) - 0x60;
      return String.fromCharCode(chr);
    });
  }
}

let repl;

async function postAwsLambdaMorphApi(sentence) {
  const BASE_URL =
    "https://wdso812r5e.execute-api.ap-northeast-1.amazonaws.com/dev/sudachi-full/parse";
  const SUDACHI_FULL_API_KEY = "bsdfas11b2c3d4e5f6g7h8i9j0k1l2m3n4o5p63421432";

  try {
    const response = await fetch(BASE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": SUDACHI_FULL_API_KEY,
      },
      body: JSON.stringify({ text: sentence }),
    });

    if (!response.ok) {
      throw new Error(`API エラー: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("形態素解析エラー:", error);
    throw new Error(
      "形態素解析中にエラーが発生しました。詳細はログを確認してください。"
    );
  }
}
