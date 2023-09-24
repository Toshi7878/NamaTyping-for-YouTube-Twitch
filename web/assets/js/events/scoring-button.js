const scoreButton = document.getElementById("score-button")

scoreButton.addEventListener('click', event => {

	if (chat) {
		seekEnd()
		scoring = new Scoring()
		setTimeout(scoring.displayResult.bind(scoring), 1000)
		scoring.sendFireStore(Object.assign({}, JSON.parse(JSON.stringify(chat.users))))

	}
	
})


function seekEnd() {
	disableScoreButton()
	resetLyricsArea()
	timer.updatePlayerClock(totalTime.duration)
	timer.removeTimerEvent()
	game.isStart = false
	if(!game.isEdit){
		game.isFinished = true
	}
	
	if (location.host == 'localhost:8080' && game.isObserve) {
		//Python側でライブチャットの監視を中止
		game.stopChatObserver()
	}

}