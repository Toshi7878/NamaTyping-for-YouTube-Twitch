class Game {

	constructor(setData) {
		this.platform = setData['platform']
		this.displayLyrics = setData['gameLyricsData'][0]
		this.comparisonLyrics = setData['gameLyricsData'][1]
		this.title = setData['title']
		this.isStart = false;
		this.isFinished = false;
		this.isObserve = false
		this.isEdit = setData['edit']

		new Lyrics(setData['gameLyricsData'][0], setData['edit'])

		deleteMedia()
		this.id = setData['movieURL']
		this.setMedia(setData)


	}

	setMedia(setData){
		if(this.platform == 'YouTube'){
			youtube = new YouTube(setData['movieURL'])
		}else if(this.platform == 'SoundCloud'){
			soundCloud = new SoundCloud(setData['movieURL'])
			soundCloud.player = SC.Widget(document.getElementById("sc-widget"));
			playerEvent = new PlayerEvent(SoundCloudPlayerState, this.platform)
		}else if(this.platform == 'LocalMedia'){
			localMedia = new LocalMedia(lrcFolder.mediaFile, lrcFolder.imgFile)
			localMedia.player = document.getElementById("video")
			playerEvent = new PlayerEvent(HTMLMediaPlayerState, this.platform)
		}
	}


	start() {
		this.isStart = true;
		deleteResult()


		if(this.isEdit){
			timer = new EditTimer()
		}else{
			timer = new Timer()
			timer.updateNextLyrics(0)
		}


		timer.addTimerEvent() //歌詞更新タイマーイベントを追加


		if(!this.isEdit){
			disableStartButton()
			this.setMusicTitle()
			const LiveID = document.getElementById("live-id").value
			const LivePlatform = document.getElementById("live-platform").selectedOptions[0].textContent
	
			if (location.host == 'localhost:8080' && LiveID) {
				//Python側でライブチャットの監視を開始
				this.isObserve = this.startLiveChatObserver(LiveID, LivePlatform)
			}
	
			chat = new Chat()
			scoring = new Scoring()
		}

	}

	

	async startLiveChatObserver(id, platform) {
		let result = await eel.startChatObserver(id, platform)();
		return result;
	}

	async stopChatObserver(){
		let result = await eel.stopChatObserver()();
		return result;
	}
	setMusicTitle(){
		document.getElementById("music-title-container").classList.remove("title-fade-in")
		document.getElementById("title").textContent = this.title

	}
}

let game