const scoreButton = document.getElementById("score-button")

scoreButton.addEventListener('click', event => {

	if (chat) {
		scoring = new Scoring()
		seekEnd()
		setTimeout(scoring.displayResult.bind(scoring), 1000)

	}
	
})


function seekEnd() {
	ToggleBtn.disableScoreButton()
	resetLyricsArea()
	timer.updatePlayerClock(totalTime.duration)
	timer.removeTimerEvent()
	game.isStart = false

	if(game.displayLyrics[timer.count]){
		MediaControl.pause()
	}

	if(!game.isEdit){
		game.isFinished = true
	}
	
	if (location.host == 'localhost:8080' && game.isObserve) {
		//Python側でライブチャットの監視を中止
		game.stopChatObserver()

		const LiveID = extractYouTubeVideoId(document.getElementById("live-id").value)

		scoring.sendFireStore(LiveID, Object.assign({}, JSON.parse(JSON.stringify(chat.users))))

	}

}