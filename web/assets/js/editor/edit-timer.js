
class EditTimer extends Timer{

	constructor(){
		super()
		document.getElementById("game-time").style.display = 'none'
		document.getElementById("edit-time").style.display = 'block'
	}


	update() {

		this.updateTime()

		if(this.count >= 1 && game.displayLyrics[this.count-1]){
			this.updateWipe()
		}



	}

	
	updateTime(){
		document.getElementById("current-second-time").textContent = timer.headTime.toFixed(2)
		document.getElementById("seek-range").value = timer.headTime

	}


	updateWipe(){
		let max = 0
		let now = 0
		if(!this.wipeElements[this.wipeCount]){return;}

		if(timer.headTime > game.displayLyrics[this.count-1]['time'][this.wipeCount]){
			this.wipeElements[this.wipeCount].removeAttribute('style')
			this.wipeElements[this.wipeCount].classList.remove('wipe-now')
			this.wipeCount++

			if(!this.wipeElements[this.wipeCount]){return;}
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
			now = game.displayLyrics[this.count]['time'][0]  - timer.headTime
		}else{
			now = LineTimeArray[this.wipeCount] - timer.headTime
		}

		const wipeProgress = 100 - (Math.round((now / max) * 100 * 1000) / 1000);

		this.wipeElements[this.wipeCount].setAttribute('style',
			`background:-webkit-linear-gradient(0deg, #ffa500 ${String(wipeProgress)}%, white 0%);
			-webkit-background-clip:text;`)
	}


	lyricsRenderReset(){
		const headElement = document.getElementsByClassName("head-lyrics")
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

	}


	updateLyrics(count) {
		const NEXT_HEAD = document.getElementById(`lyrics-${count}`)
		if(!NEXT_HEAD){return;}
		
		this.lyricsRenderReset()


		NEXT_HEAD.classList.add('head-lyrics')
		this.shadowElements = NEXT_HEAD.getElementsByClassName("shadow-layer")[0].children
		this.wipeElements = NEXT_HEAD.getElementsByClassName("wipe-layer")[0].children
		this.wipeCount = 0
	}	

}

let editTimer