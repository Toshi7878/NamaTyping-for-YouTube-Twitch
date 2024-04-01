const regexList = ['[^ぁ-んゔ', 'ァ-ンヴ', '一-龥', 'a-z', 'A-Z', '\\d', ' ', "々%&@&=+ー～~'-]"];//\.
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
		// text = text.replace(/([a-z])(-)/g, "$1"); //ハイフン
		
		return text;
	}


	//TypingTubeの短いラインをminStrLength以上になるように成形。
	parseTypingTubeData(lyrics_array) {
		const minStrLength = 15
		const minTime = 5;
		let charArray = [];
		let timeArray = [];
		let displayLyrics = []
		let comparisonLyrics = [];

		for (let i = 0; i < lyrics_array.length; i++) {

			lyrics_array[i][1] = this.deleteRubyTag(lyrics_array[i][1])

			const formatedLyricsLine = parseLrc.formatLyricsForGame(lyrics_array[i][1])


			const isLyrics =  formatedLyricsLine != 'end' && lyrics_array[i][2].replace(/\s/g, '') != ''

			if(formatedLyricsLine && isLyrics){

				if (charArray.length != 0 && charArray[charArray.length-1] != '') {
					//位置フレーズの時間がminTime未満だったら次の歌詞を結合
					charArray[charArray.length-1] = charArray[charArray.length-1] + " "
				}

				charArray.push(formatedLyricsLine)
				timeArray.push(+lyrics_array[i][0])

			}

			let nextTime
			if(lyrics_array[i + 1]){
				nextTime = lyrics_array[i + 2] && lyrics_array[i + 1][2].replace(/\s/g, '') == '' ? +lyrics_array[i + 2][0] : +lyrics_array[i + 1][0]
			}


			//位置フレーズの時間がminTime以上
			if (charArray.length > 0 && (!lyrics_array[i + 1] || minTime < nextTime - timeArray[0])) {

				timeArray.push(lyrics_array[i+1] ? +lyrics_array[i+1][0] : timeArray[timeArray.length-1]+10) //要修正
				charArray.unshift('')
				charArray.push('')

				
				const previousArray = displayLyrics[displayLyrics.length-1]
				if(previousArray){
					const previousTime = previousArray['time'][previousArray['time'].length - 1]

					if(previousTime != timeArray[0]){
						previousArray['time'].push(timeArray[0])
						previousArray['char'].push('')
					}
				}


				displayLyrics.push({'time':timeArray, 'char':charArray})
				comparisonLyrics.push(charArray.join('').split(' ').filter(x => x !== ""))

				//初期化
				charArray = [];
				timeArray = [];
			}
			

		}

		return [displayLyrics, comparisonLyrics];
	}

	deleteRubyTag(lyric) {
		const ruby_convert = lyric.match(/<*ruby(?: .+?)?>.*?<*\/ruby*>/g)
		if (ruby_convert) {
			for (let v = 0; v < ruby_convert.length; v++) {
				const start = ruby_convert[v].indexOf(">") + 1
				const end = ruby_convert[v].indexOf("<rt>")
				const ruby = ruby_convert[v].slice(start, end)
				lyric = lyric.replace(ruby_convert[v], ruby)
			}
		}
		return lyric;
	}


	joinLyrics(lyrics){
		if(!Array.isArray(lyrics)){return;}
		
		let str = ''

		for(let i=0;i<lyrics.length;i++){
			str += lyrics[i][0]
		}

		return str;
	}

}

let parseLrc = new ParseLrc()