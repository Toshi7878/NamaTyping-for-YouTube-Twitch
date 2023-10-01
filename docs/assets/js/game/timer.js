class Timer {

	constructor() {
		this.headTime = 0
		this.speedTime = 0
		this.count = 0
		this.updateClockCount = 0
		this.speed = +document.getElementById("speed").value
		MediaControl.speedChange(this.speed)

		this.isNextFadeIn = true
		this.correctLyrics = []

		this.wipeCount = 0
		this.shadowElements
		this.wipeElements
		document.getElementById("lyrics").classList.add('d-block')
		this.lyricsRenderReset()


	}

	addTimerEvent() {
		createjs.Ticker.addEventListener("tick", this.playHeadUpdate.bind(this));
		createjs.Ticker.timingMode = createjs.Ticker.RAF;
	}


	removeTimerEvent() {
		createjs.Ticker.removeAllEventListeners('tick');
	}

	getCurrentTime(){

		if (game.platform == 'LocalMedia') {
			this.headTime = localMedia.player.currentTime;
		}else if(game.platform == 'YouTube'){
			this.headTime = youtube.player.getCurrentTime();
		}else if(game.platform == 'SoundCloud'){
			soundCloud.player.getPosition((currentTime) => {
				this.headTime = currentTime / 1000;
			});
		}

	}

	playHeadUpdate(event) {
		this.getCurrentTime()
		
		this.speedTime = this.headTime / this.speed

		this.update()

		if (game.displayLyrics[this.count] && this.headTime > game.displayLyrics[this.count]['time'][0]) {
			this.updateLyrics(this.count)
			this.count++

		}
	}


	update() {

		if (Math.abs(this.speedTime - this.updateClockCount) > 1) {
				this.updatePlayerClock(this.speedTime)

			if (!this.isNextFadeIn && game.displayLyrics[this.count]){
				const NEXT_LYRICS_TIME = (game.displayLyrics[this.count]['time'][0] / this.speed)
				const SKIP_REMAIN_TIME = (this.count == 0 ? 8 : 20)
				const WIPE_END = timer.count == 0 || timer.count >= 0 && game.displayLyrics[timer.count-1]['time'].length == timer.wipeCount+1 ? true : false

				console.log(`next ${NEXT_LYRICS_TIME - this.speedTime}`)
				if(NEXT_LYRICS_TIME - this.speedTime > SKIP_REMAIN_TIME && WIPE_END){
					document.getElementById("skip").textContent = `SKIP (${Math.floor((NEXT_LYRICS_TIME - this.speedTime) - (SKIP_REMAIN_TIME-1)).toFixed()})`
				}else{
					document.getElementById("skip").textContent = ``
				}

			}

			this.updateClockCount = Math.floor(this.speedTime)
		}

		if (!this.isNextFadeIn && game.displayLyrics[this.count]){
			const NEXT_LYRICS_TIME = (game.displayLyrics[this.count]['time'][0] / this.speed)

			if(NEXT_LYRICS_TIME - this.speedTime < 3) {
				document.getElementById("next").classList.add("next-fade-in")
				this.isNextFadeIn = true
			}

		}

		if(this.count >= 1 && game.displayLyrics[this.count-1]){
			this.updateWipe()
		}

	}

	updateWipe(){
		let max = 0
		let now = 0

		if(this.headTime > game.displayLyrics[this.count-1]['time'][this.wipeCount]){
			this.wipeElements[this.wipeCount].removeAttribute('style')
			this.wipeElements[this.wipeCount].classList.remove('wipe-now')
			this.wipeCount++
			this.shadowElements[this.wipeCount].classList.add('wipe-pass')
			this.wipeElements[this.wipeCount].classList.add('wipe-now')
		}

		const LineTimeArray = game.displayLyrics[this.count-1]['time']

		if(!LineTimeArray[this.wipeCount]){
			return;
		}

		if(this.wipeCount == 0){
			max = LineTimeArray[this.wipeCount]
		}else if(!LineTimeArray[this.wipeCount] && game.displayLyrics[this.count]){
			max = game.displayLyrics[this.count]['time'][0] - LineTimeArray[LineTimeArray.length-1]
		}else if(LineTimeArray.length == this.wipeCount+1 && game.displayLyrics[this.count]){
			max = game.displayLyrics[this.count]['time'][0] - LineTimeArray[this.wipeCount-1]
		}else{
			max = LineTimeArray[this.wipeCount] - LineTimeArray[this.wipeCount-1]
		}


		if(!LineTimeArray[this.wipeCount] && game.displayLyrics[this.count]){
			now = game.displayLyrics[this.count]['time'][0]  - this.headTime
		}else{
			now = LineTimeArray[this.wipeCount] - this.headTime
		}

		const wipeProgress = 100 - (Math.round((now / max) * 100 * 1000) / 1000);

		this.wipeElements[this.wipeCount].setAttribute('style',
			`background:-webkit-linear-gradient(0deg, #ffa500 ${String(wipeProgress)}%, white 0%);
			-webkit-background-clip:text;`)
	}


	lyricsRenderReset(){
		const headElement = document.getElementsByClassName("head-lyrics")
		const previousElements = document.getElementsByClassName("previous-lyrics")
		const wipePassElements = document.getElementsByClassName("wipe-pass")
		const wipeNowElement = document.getElementsByClassName("wipe-now")


		for(let i=0;i<headElement.length;i++){
			headElement[i].classList.remove("head-lyrics")
		}

		for(let i=0;i<wipePassElements.length;i++){
			wipePassElements[i].classList.remove("wipe-pass")
		}

		for(let i=0;i<wipeNowElement.length;i++){
			wipeNowElement[i].removeAttribute('style')
			wipeNowElement[i].classList.remove("wipe-now")
		}

		for(let i=0;i<previousElements.length;i++){
			previousElements[i].classList.remove("previous-lyrics")
		}

	}


	updateLyrics(count) {
		const NEXT_HEAD = document.getElementById(`lyrics-${count}`)
		this.lyricsRenderReset()
		
		NEXT_HEAD.classList.add('head-lyrics')

		for(let i=1;i<=2;i++){

			if(count-i >= 0){
				document.getElementById(`lyrics-${count-i}`).classList.add("previous-lyrics")
			}

		}

		this.updateNextLyrics(count + 1)
		this.correctLyrics = this.updateCorrectLyrics(count + 1)

		this.shadowElements = NEXT_HEAD.getElementsByClassName("shadow-layer")[0].children
		this.wipeElements = NEXT_HEAD.getElementsByClassName("wipe-layer")[0].children
		this.wipeCount = 0
		this.checkAdjustWordArea()
	}
	

	updateCorrectLyrics(count) {
		let correctLyrics = game.comparisonLyrics.slice(0, count)

		return correctLyrics.flat(1);
	}

	updateNextLyrics(count) {

		if (game.displayLyrics[count]) {
			this.isNextFadeIn = false
			document.getElementById("next").textContent = game.displayLyrics[count]['char'].join('')
			document.getElementById("next-label").style.visibility = 'visible'
		} else {
			document.getElementById("next").textContent = ''
			document.getElementById("next-label").style.visibility = 'hidden'

			this.displayMusicTitle()
		}
		
		document.getElementById("skip").textContent = ''
		document.getElementById("next").classList.remove("next-fade-in")


	}

	displayMusicTitle(){
		document.getElementById("music-title-container").classList.add("title-fade-in")
	}



	updatePlayerClock(time) {
		const CLOCK_TIME_MM = ("00" + parseInt(parseInt(time) / 60)).slice(-2)
		const CLOCK_TIME_SS = ("00" + Math.floor(parseInt(time) - CLOCK_TIME_MM * 60)).slice(-2)

		this.clockSet([CLOCK_TIME_MM, CLOCK_TIME_SS])
	}


	clockSet(time) {
		const timeElements = document.getElementsByClassName("current-time")

		for (let i = 0; i < timeElements.length; i++) {
			timeElements[i].textContent = `${time[0]}:${time[1]}`
		}

	}


	checkAdjustWordArea(){
		if(settingData.wordAreaAutoAdjustHeight && settingData.wordAreaAutoAdjustHeight.data == false){return;}

		const LYRICS_TOP_POSITION = document.getElementById("lyrics").getBoundingClientRect().top
		const WORD_AREA = document.getElementById("word-area")
		const WORD_AREA_TOP_POSITION = WORD_AREA.getBoundingClientRect().top
		const DEFAULT_HEIGHT = document.documentElement.clientHeight*0.43

		if(LYRICS_TOP_POSITION < WORD_AREA_TOP_POSITION || WORD_AREA.clientHeight > DEFAULT_HEIGHT && LYRICS_TOP_POSITION  - WORD_AREA_TOP_POSITION > 70){
			const ADJUST_HEIGHT = WORD_AREA_TOP_POSITION - LYRICS_TOP_POSITION + WORD_AREA.clientHeight + 40
			const MIN_HEIGHT = ADJUST_HEIGHT > DEFAULT_HEIGHT && LYRICS_TOP_POSITION ? ADJUST_HEIGHT : DEFAULT_HEIGHT
			WORD_AREA.style.height = `${MIN_HEIGHT}px`
			adjustWordArea()
			resizeEvent(null, MIN_HEIGHT)
		}

	}

}

let timer