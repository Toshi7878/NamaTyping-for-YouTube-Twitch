function resetLyricsArea() {
	document.getElementById("lyrics-3").innerHTML = '&#8203;'
	document.getElementById("lyrics-2").innerHTML = '&#8203;'
	document.getElementById("lyrics-layer-1").innerHTML = '&#8203;'
	document.getElementById("lyrics-layer-2").innerHTML = '&#8203;'
	document.getElementById("next-label").style.visibility = 'hidden'
	document.getElementById("next").innerHTML = '&#8203;'
	document.getElementById("skip").textContent = ''


	if (timer) {
		timer.clockSet(['00', '00'])
	}
}


function deleteResult() {
	document.getElementById("result").textContent = ''

}


function deleteMedia() {
	const video = document.getElementById("video")

	if (video) {
		video.remove()
	}

	if (youtube && youtube.player) {
		youtube.player.stopVideo()
		document.getElementById("player").style.display = 'none'
	}

	if(document.getElementById("sc-widget") != null){
		document.getElementById("sc-widget").remove()
	}

	resetLyricsArea()
	deleteResult()

	if(timer){
		timer.removeTimerEvent()
	}

	const LiveID = document.getElementById("live-id").value

	if (game && game.isObserve) {
		//Python側でライブチャットの監視を停止
		game.stopChatObserver()
	}

	document.getElementById("title").textContent = ''
	document.getElementById("music-title-container").classList.remove("next-fade-in")
}