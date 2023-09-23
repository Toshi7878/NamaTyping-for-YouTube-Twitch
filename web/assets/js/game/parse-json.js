class ParseJson {

	constructor(jsonData){
		this.json = jsonData
		this.manageMediaData()
		document.getElementById("edit-button").parentElement.classList.remove('d-none')
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
			gameLyricsData = parseLrc.parseTypingTubeData(this.json['map'])
			platform = "YouTube"
		}

		if(this.json['repl']){

		}else{
			repl = new Repl(gameLyricsData[1].join(''))
		}

		const setData = {'movieURL':movieURL, 'platform':platform, 'title':title, 'gameLyricsData':gameLyricsData}

		game = new Game(setData)
	}

}

let parseJson