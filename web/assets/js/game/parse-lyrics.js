const regexList = ['[^ぁ-ん', 'ァ-ン', '一-龥', 'a-z', 'A-Z', '\\d', ' ', "々%&@&=+ー～'-]"];//\.
const regex = regexList.join('');

class ParseLrc{

	constructor(){

	}


	parseTextEncord(event) {
		const b = event.currentTarget.result;
		const u8 = new Uint8Array(b);
		const du8 = Encoding.detect(u8); // (A)
		const cu8 = Encoding.convert(u8, "UFT8", du8);
		const su8 = Encoding.codeToString(cu8); // (B)

		return su8;
	}


	//読み込んだlrc形式の歌詞を成型
	timeConvert(lyrics) {
		let displayLyrics = []
		let comparisonLyrics = []

		for (let i = 0; i < lyrics.length; i++) {
			let timeArray = lyrics[i].match(/\[\d\d:\d\d.\d\d\]/g)

			let charArray = this.formatLyricsForGame(lyrics[i].replace(/\[\d\d:\d\d.\d\d\]/g, '@@timestamp@@')).split('@@timestamp@@');
			let lyricsArray = this.formatLyricsForGame(lyrics[i].replace(/\[\d\d:\d\d.\d\d\]/g, '')).split(' ').filter(x => x !== "");

			if(timeArray){

				for(let i=0;i<timeArray.length;i++){
					const timeTag = timeArray[i].match(/\d\d/g)
			
					const minute = +timeTag[0]
					const second = +timeTag[1]
					const minSec = +timeTag[2]
	
					const time = minute * 60 + second + minSec * 0.01
					timeArray[i] = time
				}

				const previousArray = displayLyrics[displayLyrics.length-1]
				if(previousArray){
					const previousTime = previousArray['time'][previousArray['time'].length - 1]

					if(previousTime != timeArray[0]){
						previousArray['time'].push(timeArray[0])
						previousArray['char'].push('')
					}
				}
	
				displayLyrics.push({'time':timeArray, 'char':charArray})
				comparisonLyrics.push(lyricsArray)
			}

		}

		return [displayLyrics, comparisonLyrics];
	}


	formatLyricsForGame(text){
		//残す文字を正規表現で下の配列に記入
		text = text.replace(/<style>[\s\S]*?<\/style>/, ""); //styleタグ全体削除
		text = text.replace(/[（\(].*?[\)）]/g, ""); //()（）の歌詞を削除
		text = text.replace(/<.*>/, ""); //HTMLタグを削除

		text = text.normalize('NFKC').toLowerCase(); // 全角英数字を半角に変換
		text = text.replace(new RegExp(regex, 'g'), ""); //regexListに含まれていない文字を削除
		// text = text.replace(/([a-z])(\.)/g, "$1");　//ピリオド
		text = text.replace(/([a-z])(-)/g, "$1"); //ハイフン
		
		return text;
	}

}

let parseLrc = new ParseLrc()