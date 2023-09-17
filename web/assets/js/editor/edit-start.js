

class Editor {

	constructor(){

	}

	

	addKeyDownEvent(){
		document.addEventListener('keydown', this.addLyricsEvent)
		document.addEventListener('click', this.seekEvent)
	}

	removeKeyDownEvent(){
		document.removeEventListener('keydown', this.addLyricsEvent)
	}

	addLyricsEvent(event){


		if(event.key == 'Tab' && event.target.contentEditable != 'true'){
	
			if(event.shiftKey){
	
				if(game.displayLyrics.length > 1 && game.displayLyrics[game.displayLyrics.length-1]['time'].length == 0){
					const previousArray = game.displayLyrics[game.displayLyrics.length-2]
		
					if(previousArray){
							previousArray['time'].push(timer.headTime)
							previousArray['char'].push('')
					}
				}
	
			}else{
				const TEXT_BOX = document.getElementById("add-lyrics-box")
				let headLyrics = TEXT_BOX.value.split(/[\n\s]/)[0]
				let lyrics = TEXT_BOX.value.split(/\n/)
				const space = TEXT_BOX.value[headLyrics.length]
		
				if(game.displayLyrics.length > 1 && game.displayLyrics[game.displayLyrics.length-1]['time'].length == 0){
					const previousArray = game.displayLyrics[game.displayLyrics.length-2]
		
					if(previousArray){
							previousArray['time'].push(timer.headTime)
							previousArray['char'].push('')
					}
				}else if(game.displayLyrics.length == 0){
					game.displayLyrics.push({"time": [],"char": [""]})
				}
		
				if(space == '\n' || !space){
					game.displayLyrics[game.displayLyrics.length-1]['time'].push(timer.headTime)
					game.displayLyrics[game.displayLyrics.length-1]['char'].push(headLyrics)
					game.displayLyrics.push({"time": [],"char": [""]})
					lyrics = lyrics.slice(1)
				}else if(TEXT_BOX.value[headLyrics.length] == ' ' || TEXT_BOX.value[headLyrics.length] == '　'){
					headLyrics = headLyrics + ' '
					game.displayLyrics[game.displayLyrics.length-1]['time'].push(timer.headTime)
					game.displayLyrics[game.displayLyrics.length-1]['char'].push(headLyrics)
					lyrics[0] = lyrics[0].slice(headLyrics.length)
				}
		
		
				TEXT_BOX.value = lyrics.join('\n')
				TEXT_BOX.scrollTop = 0;
			}
	
			new Lyrics(game.displayLyrics, 'EditMode')
		
			if(timer){
				timer.updateLyrics(timer.count)
			}
	
			event.preventDefault()
		}

		if(event.key == 'ArrowLeft'){
			MediaControl.seek(timer.headTime-3)
			event.preventDefault()
		}else if(event.key == 'ArrowRight'){
			MediaControl.seek(timer.headTime+3)
			event.preventDefault()
		}
	
	}

	seekEvent(event){
		const seekTime = event.target.dataset.startTime

		if(seekTime && event.ctrlKey)
		MediaControl.seek(seekTime)
	}

	editLayout(){
		this.resizeWordArea()

		document.getElementById("add-lyrics-container").style.display = 'block'
		document.getElementById("seek-range-container").classList.remove("d-none")
		document.getElementById("lyrics").classList.remove('game-mode')
		this.addKeyDownEvent()
	}

	resizeWordArea(){
		const bottomMenu = document.getElementById("bottom-menu")
		const bottom = (parseFloat(getComputedStyle(bottomMenu).bottom) + bottomMenu.clientHeight) * 0.8

		const topMenu = document.getElementById("top-menu")
		const top = (parseFloat(getComputedStyle(topMenu).top) + topMenu.clientHeight) * 0.8

		const WORD_AREA = document.getElementById("word-area")
		WORD_AREA.style.top = ``
		WORD_AREA.style.bottom = `${bottom.toString()}px`
		WORD_AREA.style.height = `${(window.innerHeight - (top + bottom)).toString()}px`
	}
}


class NewCreate extends Editor {

	constructor(){
		super()
		document.getElementById("get-create-param-btn").addEventListener('click', event => {
			const urlParam = document.getElementById("edit-url").value
			this.sendURLtoGetParamData(urlParam).then(this.setParam.bind(this))
			document.getElementById("edit-url").value = ''
			document.getElementById("edit-url").placeholder = 'データ取得中'
		})

		document.getElementById("create-start-btn").addEventListener('click', this.newCreateStart.bind(this))
	}

	async sendURLtoGetParamData(urlParam){
			let result = await eel.sendURLtoGetParamData(urlParam)();
			return result;
	}

	setParam(result){
		this.platform = result['platform']
		document.getElementById("edit-url").placeholder = ''
		document.getElementById("edit-id").value = result['id']
		document.getElementById("edit-title").value = result['title']
		document.getElementById("edit-artist").value = result['artist']
		document.getElementById("create-start-btn").removeAttribute('disabled')
	}

	newCreateStart(event){
			const ID = document.getElementById("edit-id").value
			const TITLE = document.getElementById("edit-title").value
			const ARTIST = document.getElementById("edit-artist").value
			this.setData = {'platform':this.platform, 'movieURL':ID, 'title':TITLE, 'artist':ARTIST,'gameLyricsData':[[],[]], 'edit':true}
			timer = new EditTimer()
			game = new Game(this.setData)

			this.editLayout()
			editMenu.frame.closeFrame();
	}

}



class JsonEditor extends Editor {

	constructor(){
		super()
		this.editStart()
	}

	editStart(){
		const ID = parseJson.json['movieURL']
		const TITLE = parseJson.json['title']
		const ARTIST = parseJson.json['artist']
		this.setData = {'platform':parseJson.json['platform'], 'movieURL':ID, 'title':TITLE, 'artist':ARTIST,'gameLyricsData':[game.displayLyrics,[]], 'edit':true}
		timer = new EditTimer()
		game = new Game(this.setData)

		this.editLayout()
	}
}

let editor