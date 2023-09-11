const startButton = document.getElementById("start-button")

startButton.addEventListener('click', event => {
	game.isFinished = false

	if (game.platform == 'LocalMedia') {
		localMedia.player.currentTime = 0
		localMedia.player.play()
	}else if(game.platform == 'YouTube'){
		youtube.player.seekTo(0)
		youtube.player.playVideo()
	}else if(game.platform == 'SoundCloud'){
		soundCloud.player.seekTo(0);
		soundCloud.player.play()
	}
})