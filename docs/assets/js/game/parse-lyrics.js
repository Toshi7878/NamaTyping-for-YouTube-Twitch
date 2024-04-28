const regexList = ['[^-ぁ-んゔ', 'ァ-ンヴ', '一-龥', '\\w', '\\d', ' ', "々%&@&=+ー～~\u00C0-\u00FF",];
const Hangul = ['\uAC00-\uD7AF\u1100-\u11FF\u3130-\u318F\uFFA0-\uFFDC\uFFA0-\uFFDC'];
const cyrillicAlphabet = ['\u0400-\u04FF]']

class ParseLrc{

	constructor(){
		this.customRegex = lrcSettingData['lrc-regex-switch'].data ? [this.escapeAllCharacters(lrcSettingData['lrc-regex'].data)] : [""]
		this.regex = regexList.concat(Hangul).concat(this.customRegex).concat(cyrillicAlphabet).join('');
	}

	escapeAllCharacters(string) {
		return string.replace(/./g, '\\$&');
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

			let charArray = this.formatLyricsForLrc(lyrics[i].replace(/\[\d\d:\d\d.\d\d\]/g, '@@timestamp@@')).split('@@timestamp@@');
			let lyricsArray = this.formatLyricsForLrc(lyrics[i].replace(/\[\d\d:\d\d.\d\d\]/g, '')).split(' ').filter(x => x !== "");

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
				
				const comparison = parseLrc.insertSpacesEng(lyricsArray)

				comparisonLyrics.push(comparison)
			}

		}

		return [displayLyrics, comparisonLyrics];
	}

	joinLyrics(lyrics){
		
		if(!Array.isArray(lyrics)){return;}
		
		let str = ''

		for(let i=0;i<lyrics.length;i++){
			str += lyrics[i][0]
		}

		return str;
	}


	formatLyricsForLrc(text){
		//残す文字を正規表現で下の配列に記入
		text = text.replace(/<style>[\s\S]*?<\/style>/, ""); //styleタグ全体削除

		if(!/\(/.test(lrcSettingData['lrc-regex'].data)){
			text = text.replace(/[（\(]/g, " "); //左括弧をスペースに変更
		}

		text = text.replace(/<.*>/, ""); //HTMLタグを削除

		text = this.formatSymbols(text) //記号整形

		if(lrcSettingData["lrc-eng-case-sensitive"].data){
			text = text.normalize('NFKC') //全角を半角に変換
		}else{
			text = text.normalize('NFKC').toLowerCase() //全角を半角に変換 & 小文字に変換;
		}

		text = text.replace(new RegExp(parseLrc.regex, 'g'), ""); //regexListに含まれていない文字を削除

		return text;
	}

	formatSymbols(text){
		//記号整形
		return text
			.replace(/…/g,"...")
			.replace(/‥/g,"..")
			.replace(/･/g,"・")
			.replace(/〜/g,"～")
			.replace(/｢/g,"「")
			.replace(/｣/g,"」")
			.replace(/､/g,"、")
			.replace(/｡/g,"。")
			.replace(/－/g,"ー");
	}


	insertSpacesEng(comparison){

		if(!lrcSettingData['lrc-eng-space'].data){return comparison}

		for(let i=0;i<comparison.length;i++){

			const IS_ALL_HANKAKU = /^[!-~]*$/.test(comparison[i])
			const IS_NEXT = comparison[i+1]

			if(IS_ALL_HANKAKU){
		
				if(IS_NEXT && /^[!-~]*$/.test(IS_NEXT[0])){
					comparison[i] = comparison[i] + " "
				}
				
			}
			
		}

		return comparison;

	}
}

let parseLrc