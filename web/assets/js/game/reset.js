function resetLyricsArea() {

	if (timer) {
		document.getElementById("lyrics").classList.remove('d-block')
		timer.lyricsRenderReset()
		timer.clockSet(['00', '00'])
	}
}


function deleteResult() {
	document.getElementById("result").textContent = ''

}


function deleteMedia(editMode) {
	const video = document.getElementById("video")

	if (video) {
		video.remove()
	}

	if (document.getElementById("player") != null) {
		document.getElementById("player").remove()
	}

	if(document.getElementById("sc-widget") != null){
		document.getElementById("sc-widget").remove()
	}
	
	if(!editMode){
		resetLyricsArea()
	}

	deleteResult()

	if(timer){
		timer.removeTimerEvent()
	}

	if (game && game.isObserve) {
		//Python側でライブチャットの監視を停止
		game.stopChatObserver()
	}

	document.getElementById("title").textContent = ''
	document.getElementById("music-title-container").classList.remove("next-fade-in")
}