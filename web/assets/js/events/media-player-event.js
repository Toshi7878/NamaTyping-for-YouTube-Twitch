const YouTubePlayerState = {
	"1":"play",
	"0":"finish",
	"2":"pause",
	"3":"seek",
	"-1":"ready"
}

const HTMLMediaPlayerState = {
	"playing":"play",
	"ended":"finish",
	"pause":"pause",
	"seeking":"seek",
	"canplay":"ready"
}

const SoundCloudPlayerState = {
	"play":"play",
	"finish":"finish",
	"pause":"pause",
	"seek":"seek",
	"ready":"ready"
}

class PlayerEvent {

	constructor(playerStateNames, platform) {

		//YouTube or HTML MediaTagのStateEvent名
		this.playerStateNames = playerStateNames

		if (platform == "LocalMedia") {
			localMedia.player.addEventListener("canplay", this.onPlayerStateChange.bind(this));
			localMedia.player.addEventListener('playing', this.onPlayerStateChange.bind(this))
			localMedia.player.addEventListener('pause', this.onPlayerStateChange.bind(this))
			localMedia.player.addEventListener('ended', this.onPlayerStateChange.bind(this))
			localMedia.player.addEventListener('seeking', this.onPlayerStateChange.bind(this))
		}else if(platform == "SoundCloud"){
			soundCloud.player.bind(SC.Widget.Events.READY, () => playerEvent.onPlayerReady(SC.Widget.Events.READY));
			soundCloud.player.bind(SC.Widget.Events.PLAY, () => playerEvent.onPlayerStateChange(SC.Widget.Events.PLAY));
			soundCloud.player.bind(SC.Widget.Events.PAUSE, () => playerEvent.onPlayerStateChange(SC.Widget.Events.PAUSE));
			soundCloud.player.bind(SC.Widget.Events.FINISH, () => playerEvent.onPlayerStateChange(SC.Widget.Events.FINISH));
			soundCloud.player.bind(SC.Widget.Events.SEEK, () => playerEvent.onPlayerStateChange(SC.Widget.Events.SEEK));
		}

	}


	//動画 音楽プレイヤーが再生可能な状態になった
	onPlayerReady(event) {
		console.log("未スタート")
		adjustMedia()

		MediaControl.volumeChange(volume)

		disableScoreButton()
		totalTime = new TotalTime()
	}

	//動画 音楽プレイヤーの状態が変更された
	async onPlayerStateChange(event) {
		let state

		if (game.platform == 'LocalMedia') {
			state = this.playerStateNames[event.type]
		}else if(game.platform == 'YouTube'){
			state = this.playerStateNames[event.data]
		}else if(game.platform == 'SoundCloud'){
			state = this.playerStateNames[event]
		}

		toggleEditorBtn(state)

		switch (state) {
			case "play": //再生
				console.log("再生")
		
				if(!game.isFinished){
					
					if (!game.isStart && !game.isEdit) {
						game.start() //初めて再生されたらゲームスタート
					} else {
						timer.addTimerEvent()
					}
					
				}

				break;

			case "finish": //動画終了
				console.log("動画終了")
				timer.removeTimerEvent()

				if(!game.isEdit){
					game.isFinished = true
				}
		
				//videoタグのポスターを再表示
				if (game.platform == 'LocalMedia') {
					localMedia.player.poster = lrcFolder.imgFile
				}else if(game.platform == 'YouTube'){
					youtube.player.stopVideo()
				}

				break;

			case "pause": //一時停止
				console.log("一時停止")
				timer.removeTimerEvent()
				setTimeout(unfocusMediaPlayer,100)

				break;

			case "seek": //再生時間移動
				console.log("シーク")
				
				if(game.isStart && !game.isFinished){
					let time = await MediaData.getCurrentTime()
					getLyricsCount(time)
				}

				break;

			case "ready": //	未スタート、他の動画に切り替えた時など

			let time = await MediaData.getCurrentTime()



				if (time == 0	&& !game.isFinished) {

					if(game.platform == 'YouTube'){
						youtube.player.seekTo(0)
					}else{
						this.onPlayerReady()
					}

				}

				break;
		}
	}


}

let playerEvent

class TotalTime {

	constructor() {
		this.calc()
	}

	async calc() {
		this.duration = await MediaData.getDuration()

		if(!game.isEdit){
			const TOTAL_TIME = this.duration / (timer ? timer.speed : 1);
			const TOTAL_TIME_MM = ("00" + parseInt(parseInt(TOTAL_TIME) / 60)).slice(-2)
			const TOTAL_TIME_SS = ("00" + (parseInt(TOTAL_TIME) - TOTAL_TIME_MM * 60)).slice(-2)
	
			this.set([TOTAL_TIME_MM, TOTAL_TIME_SS])
		}else{
			document.getElementById("total-second-time").textContent = this.duration.toFixed(2)
			document.getElementById("seek-range").max = this.duration

		}

	}

	set(time) {
		const timeElements = document.getElementsByClassName("total-time")

		for (let i = 0; i < timeElements.length; i++) {
			timeElements[i].textContent = `${time[0]}:${time[1]}`
		}

	}

}

let totalTime


function getLyricsCount(time) {

	for (let i = 0; i < game.displayLyrics.length; i++) {

		if (game.displayLyrics[i]['time'][0] - time >= 0) {
			timer.count = i - 1
			timer.wipeCount = 0
			break;
		}

	}

	if (timer.count < 0) {
		timer.count = 0
	}else{
		timer.updateLyrics(timer.count - 1)
	}


}


function toggleEditorBtn(state){

	switch(state){
		case "play":
			document.getElementById("player-play").classList.add("d-none")
			document.getElementById("player-pause").classList.remove("d-none")
		break;

		case "pause":
		case "finish":
		case "ready":
			document.getElementById("player-play").classList.remove("d-none")
			document.getElementById("player-pause").classList.add("d-none")
		break;
	}

}

function unfocusMediaPlayer(){
	const isInputFocus = document.activeElement.id == 'lyrics-input' ? true : false

	if(document.activeElement.tagName == "IFRAME"){
		document.activeElement.blur()

		if(isInputFocus){
			document.getElementById("lyrics-input").focus()
		}
	}
}