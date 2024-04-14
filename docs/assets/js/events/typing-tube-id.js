document.body.addEventListener("paste", pasteEvent, false);

function pasteEvent(event) {

		if(document.activeElement.type == 'text' || game && game.isStart){return;}
		const clipboardData = (event.clipboardData || window.clipboardData).getData('text');

		if(requestLimitter){
			showToast(`<span style="color:white;font-weight;bold;">${requestLimitter.count}秒後に再リクエスト可</span>`, '#ffc71db8')
		}else{
			getMap(clipboardData)
		}
}

class RequestLimitter {
	
	constructor(reqDate){
		this.reqDate = reqDate
		this.count = 9
		this.setInterval = setInterval(this.requestLimitter.bind(this))
	}

	requestLimitter(){
		const NOW_DATE = new Date().getTime()
		const LIMIT = 9 - ( (NOW_DATE-this.reqDate)/1000)
		if(this.count - LIMIT > 1){
			this.count--
		}else if(this.count < 0){
			clearInterval(this.setInterval)
			requestLimitter = null
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
		//Lrcデータ読み込み用regex正規表現を初期化
		parseLrc = new ParseLrc()
		
		if(result.data){
			parseJson = new ParseJson(result.data)
		}else{
			showToast(`<span style="color:white;font-weight;bold;">データの取得に失敗しました</span>`, '#ffc71db8')
		}

		if(result.isAccess){
			requestLimitter = new RequestLimitter(new Date().getTime())
		}
	}

}


function getMap(value){

		if(!value.match('https://typing-tube.net/movie')){return;}
		const ID = value.match(/\d+$/)
		const IS_OK = ID && location.host == 'localhost:8080'
	
		if (IS_OK) {
	
			if(isNaN(Number(ID[0]))){
				return;
			}
	
			const TYPING_TUBE = new TypingTube(ID[0])
			TYPING_TUBE.pythonSendURL(event).then(TYPING_TUBE.setTypingTubeData.bind(TYPING_TUBE))
		}
}