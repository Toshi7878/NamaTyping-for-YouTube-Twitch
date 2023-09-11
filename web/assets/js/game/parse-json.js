class ParseJson {

	constructor(jsonData){
		this.json = jsonData
		this.manageMediaData()
	}


	manageMediaData(){
		const title = `${this.json['title']}${this.json['artist'] ? ' / ' + this.json['artist'] : ''}`
		const movieURL = this.json['movieURL']
		let gameLyricsData
		let platform


		if(this.json['lrc']){
			gameLyricsData = parseLrc.timeConvert(this.json['lrc'].split('\r\n'))
			platform = this.json['platform']
		}else if(this.json['map']){
			typingtube = new TypingTube()
			gameLyricsData = typingtube.parseLyricsData(this.json['map'])
			platform = "YouTube"
		}

		const setData = {'movieURL':movieURL, 'platform':platform, 'title':title, 'gameLyricsData':gameLyricsData}

		game = new Game(setData)
	}

}