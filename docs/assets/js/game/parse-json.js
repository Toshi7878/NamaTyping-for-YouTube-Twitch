class ParseJson{

	constructor(jsonData){
		this.json = jsonData
		this.manageMediaData()
		document.getElementById("edit-button").parentElement.classList.remove('d-none')
	}


	async manageMediaData(){
		const title = `${this.json['title']}${this.json['artist'] ? ' / ' + this.json['artist'] : ''}`
		const movieURL = this.json['movieURL']
		let gameLyricsData
		let platform


		if(this.json['lrc']){
			gameLyricsData = parseLrc.timeConvert(this.json['lrc'].split('\r\n'))
			platform = this.json['platform']
		}else if(this.json['map']){
			gameLyricsData = this.parseTypingTubeData(this.json['map'])
			platform = "YouTube"
		}

		if(this.json['repl']){

		}else{
			repl = new Repl()
			await repl.getReplData(gameLyricsData[1].flat().join(''))
			gameLyricsData[1] = repl.marge(gameLyricsData[1])
		}

		const setData = {'movieURL':movieURL, 'platform':platform, 'title':title, 'gameLyricsData':gameLyricsData}

		game = new Game(setData)
	}

	parseTypingTubeData(lyrics_array) {
		const minTime = 5;
		let charArray = [];
		let timeArray = [];
		let displayLyrics = []
		let comparisonLyrics = [];

		for (let i = 0; i < lyrics_array.length; i++) {

			lyrics_array[i][1] = this.deleteRubyTag(lyrics_array[i][1])

			const formatedLyricsLine = this.formatLyricsForMap(lyrics_array[i][1])


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

				const comparison = parseLrc.insertSpacesEng(charArray.join('').split(' ').filter(x => x !== ""))
				
				comparisonLyrics.push(comparison)

				//初期化
				charArray = [];
				timeArray = [];
			}
			

		}

		return [displayLyrics, comparisonLyrics];
	}

	deleteRubyTag(lyric) {
		const ruby_convert = lyric.match(/<*ruby(?: .+?)?>.*?<.*?\/ruby*>/g)
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

	formatLyricsForMap(text){
		//残す文字を正規表現で下の配列に記入
		text = text.replace(/<[^>]*?style>[\s\S]*?<[^>]*?\/style[^>]*?>/g, ""); //styleタグ全体削除
		text = text.replace(/[（\(].*?[\)）]/g, ""); //()（）の歌詞を削除
		text = text.replace(/<[^>]*>(.*?)<[^>]*?\/[^>]*>/g, "$1")//HTMLタグの中の文字を取り出す

		text = text.replace(/<[^>]*>/, ""); //単体のHTMLタグを削除

		if(lrcSettingData["lrc-eng-case-sensitive"].data){
			text = text.normalize('NFKC') //全角を半角に変換
		}else{
			text = text.normalize('NFKC').toLowerCase() //全角を半角に変換 & 小文字に変換;
		}

		text = text.replace(new RegExp(parseLrc.regex, 'g'), ""); //regexListに含まれていない文字を削除
		
		return text;
	}
}

let parseJson