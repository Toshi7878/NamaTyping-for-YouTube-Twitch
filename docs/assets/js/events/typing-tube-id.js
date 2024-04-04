const typingtubeID = document.getElementById('typing-tube-id')

typingtubeID.addEventListener('keydown', getMap)

typingtubeID.addEventListener('paste', getMap)

class RequestLimitter {
	
	constructor(reqDate){
		this.reqDate = reqDate
		this.count = 9
		typingtubeID.placeholder = this.count
		this.setInterval = setInterval(this.requestLimitter.bind(this))
	}

	requestLimitter(){
		const NOW_DATE = new Date().getTime()
		const LIMIT = 9 - ( (NOW_DATE-this.reqDate)/1000)
		console.log(LIMIT)
		if(this.count - LIMIT > 1){
			typingtubeID.placeholder = this.count
			this.count--
		}else if(this.count < 0){
			typingtubeID.placeholder = 'ID here'
			clearInterval(this.setInterval)
		}
	}
	
}
let requestLimitter

class TypingTube {

	constructor(id) {
		this.id = id
	}

	async pythonSendURL(event) {
		let result = await eel.getTypingTubeEvent(this.id)();
		return result;
	}

	setTypingTubeData(result) {
		if(result.data){
			parseJson = new ParseJson(result.data)
		}else{
			showToast(`<span style="color:white;font-weight;bold;">データの取得に失敗しました</span>`, '#ffc71db8')
		}

		if(result.isAccess){
			requestLimitter = new RequestLimitter(new Date().getTime())
		}else{
			typingtubeID.placeholder = 'ID here'
		}
	}

}



function getMap(event){
	const IS_KEY_DOWN = event.type == 'keydown' && event.key == 'Enter'
	const IS_PASTE = event.type == 'paste'

	const ID = event.target.value.match(/\d+$/)

	const placeholder = event.target.placeholder

	const IS_OK = ID && location.host == 'localhost:8080' && placeholder == 'ID here'

	if (IS_OK && (IS_PASTE || IS_KEY_DOWN)) {

		if(isNaN(Number(ID[0]))){
			showToast(`<span style="color:white;font-weight;bold;">無効なIDです</span>`, '#ffc71db8')
			return;
		}

		const TYPING_TUBE = new TypingTube(ID[0])
		TYPING_TUBE.pythonSendURL(event).then(TYPING_TUBE.setTypingTubeData.bind(TYPING_TUBE))
		event.target.value = ''
		event.target.placeholder = 'Loading...'
	}
}