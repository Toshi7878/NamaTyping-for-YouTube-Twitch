const startButton = document.getElementById("start-button")

startButton.addEventListener('click', event => {
	game.isFinished = false
	MediaControl.seek(0)
	MediaControl.play()

})