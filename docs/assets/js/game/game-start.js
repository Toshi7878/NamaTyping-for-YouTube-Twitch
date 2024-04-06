class Load {
	
	static SPEED_RANGE = {
		'LocalMedia':{
			'max':5,
			'step':0.01,
			'min':0
		},
		'YouTube':{
			'max':2,
			'step':0.25,
			'min':0.25
		}
	}

	constructor(setData) {
		document.getElementById('folder-input').value = '';
		this.platform = setData['platform']
		this.displayLyrics = setData['gameLyricsData'][0]
		this.comparisonLyrics = setData['gameLyricsData'][1]
		this.title = setData['title']
		this.isStart = false;
		this.isFinished = false;
		this.isObserve = false
		this.isEdit = setData['edit']

		new Lyrics(setData['gameLyricsData'][0], setData['edit'])

		deleteMedia(setData['edit'])
		this.setMedia(setData)
	}

	setMedia(setData){

		if(this.platform == 'YouTube'){
			youtube = new YouTube(setData['movieURL'])
			this.applySpeedRange(this.platform)
		}else if(this.platform == 'SoundCloud'){
			soundCloud = new SoundCloud(setData['movieURL'])
			soundCloud.player = SC.Widget(document.getElementById("sc-widget"));
			playerEvent = new PlayerEvent(SoundCloudPlayerState, this.platform)
		}else if(this.platform == 'LocalMedia'){
			localMedia = new LocalMedia(lrcFolder.mediaFile, lrcFolder.imgFile)
			localMedia.player = document.getElementById("video")
			playerEvent = new PlayerEvent(HTMLMediaPlayerState, this.platform)
			this.applySpeedRange(this.platform)
		}
	}

	applySpeedRange(platform){
		const SPEED_RANGE_ELEMENT = document.getElementById("speed")

		SPEED_RANGE_ELEMENT.min = Load.SPEED_RANGE[platform]['min']
		SPEED_RANGE_ELEMENT.max = Load.SPEED_RANGE[platform]['max']
		SPEED_RANGE_ELEMENT.step = Load.SPEED_RANGE[platform]['step']
		document.getElementById("speed-label").textContent = Number(+document.getElementById("speed").value).toFixed(2)
	}

}

class Game extends Load {


	start() {
		this.isStart = true;
		deleteResult()

		timer = new Timer()
		timer.updateNextLyrics(0)
		timer.addTimerEvent() //歌詞更新タイマーイベントを追加

		ToggleBtn.disableStartButton()

		this.setMusicTitle()
		const LiveID = extractYouTubeVideoId(document.getElementById("live-id").value)
		const LivePlatform = document.getElementById("live-platform").selectedOptions[0].textContent

		if (location.host == 'localhost:8080' && LiveID) {
			//Python側でライブチャットの監視を開始
			this.isObserve = this.startLiveChatObserver(LiveID, LivePlatform)
			showToast(`<span style="color:white;font-weight;bold;">Liveチャット接続完了</span>`, '#198754b8')
		}else{
			showToast(`<span style="color:white;font-weight;bold;">Liveチャット未接続</span>`, '#ffc71db8')
		}

		chat = new Chat()
		this.startTimeStamp = new Date().getTime()
	}

	async startLiveChatObserver(id, livePlatform) {
		let result = await eel.startChatObserver(id, livePlatform)();
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

class Edit extends Load {

	constructor(setData) {
		super(setData)
		document.getElementById("lyrics").classList.add('d-block')
	}

	
	start() {
		this.isStart = true;
		timer = new EditTimer()
	}
}