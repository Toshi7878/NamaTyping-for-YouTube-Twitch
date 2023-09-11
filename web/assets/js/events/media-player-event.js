const YouTubePlayerState = [1, 0, 2, 3, -1]
const HTMLMediaPlayerState = ['playing', 'ended', 'pause', 'seeking', 'canplay']
const SoundCloudPlayerState = ['play', 'finish', 'pause', 'seek', 'ready']

class PlayerEvent {

	constructor(playerStateNames) {

		//YouTube or HTML MediaTagのStateEvent名
		this.playerStateNames = playerStateNames

		if (this.playerStateNames[0] == 'playing') {
			localMedia.player.addEventListener("canplay", this.onPlayerStateChange.bind(this));
			localMedia.player.addEventListener('playing', this.onPlayerStateChange.bind(this))
			localMedia.player.addEventListener('pause', this.onPlayerStateChange.bind(this))
			localMedia.player.addEventListener('ended', this.onPlayerStateChange.bind(this))
			localMedia.player.addEventListener('seeking', this.onPlayerStateChange.bind(this))
		}else if(this.playerStateNames[0] == 'play'){
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

		if (game.platform == 'LocalMedia') {
			localMedia.player.volume = (volume / 100) * 0.5
		}else if(game.platform == 'YouTube'){
			youtube.player.setVolume(volume)
		}else if(game.platform == 'SoundCloud'){
			soundCloud.player.setVolume(volume)
		}

		disableScoreButton()
		totalTime = new TotalTime()
	}

	//動画 音楽プレイヤーの状態が変更された
	onPlayerStateChange(event) {
		let state

		if (game.platform == 'LocalMedia') {
			state = event.type
		}else if(game.platform == 'YouTube'){
			state = event.data
		}else if(game.platform == 'SoundCloud'){
			state = event
		}


		switch (state) {
			case this.playerStateNames[0]: //再生
				console.log("再生")
		
				if(!game.isFinished){
					
					if (!game.isStart) {
						game.start() //初めて再生されたらゲームスタート
		
					} else {
						timer.addTimerEvent()
					}
					
				}
				
				break;

			case this.playerStateNames[1]: //動画終了
				console.log("動画終了")
				timer.removeTimerEvent()
				game.isFinished = true
		
				//videoタグのポスターを再表示
				if (game.platform == 'LocalMedia') {
					localMedia.player.poster = lrcFolder.imgFile
				}else if(game.platform == 'YouTube'){
					youtube.player.stopVideo()
				}

				break;

			case this.playerStateNames[2]: //一時停止
				console.log("一時停止")
				timer.removeTimerEvent()
				break;

			case this.playerStateNames[3]: //再生時間移動
				console.log("シーク")
		
				if(game.isStart && !game.isFinished){
					let time
					
					if (game.platform == 'LocalMedia') {
						time = localMedia.player.currentTime;
					}else if(game.platform == 'YouTube'){
						time = youtube.player.getCurrentTime();
					}else if(game.platform == 'SoundCloud'){
						soundCloud.player.getPosition(currentTime => time = (currentTime / 1000));
					}
		
					if(time){
						getLyricsCount(time)
					}
				}

				break;

			case this.playerStateNames[4]: //	未スタート、他の動画に切り替えた時など

				let startTime
				if (game.platform == 'LocalMedia') {
					startTime = localMedia.player.currentTime;
				}else if(game.platform == 'YouTube'){
					startTime = youtube.player.getCurrentTime();
				}


				if (startTime === 0	&& !game.isFinished) {
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
		if (game.platform == 'LocalMedia') {
			this.duration = localMedia.player.duration
		}else if(game.platform == 'YouTube'){
			this.duration = youtube.player.getDuration()
		}else if(game.platform == 'SoundCloud'){
			this.duration = await new Promise((resolve) => {

				soundCloud.player.getDuration((duration) => {

					if (duration !== null) {
						resolve(duration / 1000);
					}

				});

			});
		}
		if(!game.isEdit){
			const TOTAL_TIME = this.duration / (timer ? timer.speed : 1);
			const TOTAL_TIME_MM = ("00" + parseInt(parseInt(TOTAL_TIME) / 60)).slice(-2)
			const TOTAL_TIME_SS = ("00" + (parseInt(TOTAL_TIME) - TOTAL_TIME_MM * 60)).slice(-2)
	
			this.set([TOTAL_TIME_MM, TOTAL_TIME_SS])
		}else{
			document.getElementById("total-second-time").textContent = this.duration.toFixed(2)
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
	}

	timer.updateLyrics(timer.count - 1)

}