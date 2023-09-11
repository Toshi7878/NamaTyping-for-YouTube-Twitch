class Timer {

	constructor() {
		this.headTime = 0
		this.speedTime = 0
		this.count = 0
		this.updateClockCount = 0
		this.speed = 1
		this.isNextFadeIn = true
		this.correctLyrics = []

		this.wipeCount = 0
		this.shadowElements
		this.wipeElements

	}

	addTimerEvent() {
		createjs.Ticker.addEventListener("tick", this.playHeadUpdate.bind(this));
		createjs.Ticker.timingMode = createjs.Ticker.RAF;
	}


	removeTimerEvent() {
		createjs.Ticker.removeAllEventListeners('tick');
	}

	async getCurrentTime(){

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
		if(game.isEdit){
			editTimer.updateTime()
		}

		if (Math.abs(this.speedTime - this.updateClockCount) > 1) {
			if(!game.isEdit){
				this.updatePlayerClock(this.speedTime)
			}

			if (!this.isNextFadeIn && game.displayLyrics[this.count]){
				const NEXT_LYRICS_TIME = (game.displayLyrics[this.count]['time'][0] / this.speed)
				const SKIP_REMAIN_TIME = (this.count == 0 ? 8 : 20)
				const WIPE_END = timer.count ? game.displayLyrics[timer.count-1]['time'].length == timer.wipeCount : true

				if(NEXT_LYRICS_TIME - this.speedTime > SKIP_REMAIN_TIME && WIPE_END){
					document.getElementById("skip").textContent = `SKIP (${((NEXT_LYRICS_TIME - this.speedTime) - (SKIP_REMAIN_TIME-1)).toFixed()})`
				}else{
					document.getElementById("skip").textContent = ``
				}

			}

			this.updateClockCount = this.speedTime
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
		if(!this.wipeElements[this.wipeCount]){return;}

		if(this.headTime > game.displayLyrics[this.count-1]['time'][this.wipeCount]){
			this.wipeElements[this.wipeCount].removeAttribute('style')
			this.wipeCount++
			this.shadowElements[this.wipeCount].setAttribute('style',`color:#ffa500;`)
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


	updateLyrics(count) {

		for (let i = 1; i <= 3; i++) {

			if (count - (i - 1) >= 0) {
				const char = game.displayLyrics[count - (i - 1)]['char']

				if(i == 1){
					let charElements = ''

					for(let i=0;i<char.length;i++){
						charElements += `<span>${char[i]}</span>`
					}

					const layer1 = document.getElementById("lyrics-layer-1")
					layer1.innerHTML = charElements
					this.shadowElements = layer1.children

					const layer2 = document.getElementById("lyrics-layer-2")
					layer2.innerHTML = charElements
					this.wipeElements = layer2.children

					this.wipeCount = 0
				}else{
					document.getElementById("lyrics-" + String(i)).textContent = char.join('')
				}

			} else {

				if(i == 1){
					document.getElementById("lyrics-layer-1").textContent = ' '
					document.getElementById("lyrics-layer-2").textContent = ' '
				}else{
					document.getElementById("lyrics-" + String(i)).textContent = ' '
				}
			}

		}

		this.updateNextLyrics(count + 1)
		this.correctLyrics = this.updateCorrectLyrics(count + 1)

	}

	updateCorrectLyrics(count) {
		let correctLyrics = game.comparisonLyrics.slice(0, count)

		return correctLyrics.flat(Infinity);
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
		const CLOCK_TIME_SS = ("00" + (parseInt(time) - CLOCK_TIME_MM * 60)).slice(-2)

		this.clockSet([CLOCK_TIME_MM, CLOCK_TIME_SS])
	}


	clockSet(time) {
		const timeElements = document.getElementsByClassName("current-time")

		for (let i = 0; i < timeElements.length; i++) {
			timeElements[i].textContent = `${time[0]}:${time[1]}`
		}

	}

}

let timer