const typingtubeID = document.getElementById('typing-tube-id')

if (location.host == 'localhost:8080') {
	typingtubeID.style.display = 'block'
}

typingtubeID.addEventListener('keydown', event => {
	const ID = event.target.value.match(/\d+$/)

	if (ID && event.key == 'Enter' && location.host == 'localhost:8080') {
		const TYPING_TUBE = new TypingTube(ID[0])
		TYPING_TUBE.pythonSendURL(event).then(TYPING_TUBE.setTypingTubeData.bind(TYPING_TUBE))
		event.target.value = ''
		event.target.placeholder = 'Loading...'
	}

})





class TypingTube {

	constructor(id) {
		this.id = id
	}


	async pythonSendURL(event) {
		let result = await eel.getTypingTubeEvent(this.id)();
		return result;
	}


	setTypingTubeData(data) {
		parseJson = new ParseJson(data)
		document.getElementById('typing-tube-id').placeholder = 'ID here'
	}

}