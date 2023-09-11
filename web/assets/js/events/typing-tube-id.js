const typingtubeID = document.getElementById('typing-tube-id')

if (location.host == 'localhost:8080') {
	typingtubeID.style.display = 'block'
}

typingtubeID.addEventListener('keydown', event => {
	const ID = event.target.value.match(/\d+$/)

	if (ID && event.key == 'Enter' && location.host == 'localhost:8080') {
		typingtube = new TypingTube(ID[0])
		typingtube.pythonSendURL(event).then(typingtube.setTypingTubeData.bind(typingtube))
		event.target.value = ''
		event.target.placeholder = 'Loading...'
	}

})





class TypingTube {

	constructor(id) {
		this.id = id
	}


	async pythonSendURL(event) {
		let result = await eel.getTypingTubeEvent(this.id)();
		return result;
	}


	setTypingTubeData(data) {
		const parseJson = new ParseJson(data)
		document.getElementById('typing-tube-id').placeholder = 'ID here'
	}


	//TypingTubeの短いラインをminStrLength以上になるように成形。
	parseLyricsData(lyrics_array) {
		const minStrLength = 15
		const minTime = 5;
		let charArray = [];
		let timeArray = [];
		let displayLyrics = []
		let comparisonLyrics = [];

		for (let i = 0; i < lyrics_array.length; i++) {

			lyrics_array[i][1] = this.deleteRubyTag(lyrics_array[i][1])

			const formatedLyricsLine = parseLrc.formatLyricsForGame(lyrics_array[i][1])



				if(formatedLyricsLine && lyrics_array[i][2].replace(/\s/g, '') != ''){


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

}

let typingtube