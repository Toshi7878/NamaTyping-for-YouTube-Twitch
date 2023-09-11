let volume = localStorage.getItem('volume') ? +localStorage.getItem('volume') : 50

document.getElementById('volume').value = volume
document.getElementById('volume').title = volume

document.getElementById('volume').addEventListener('input', event => {
	localStorage.setItem('volume', event.target.value)
	volume = event.target.value
	document.getElementById('volume').title = volume


	if (game.platform == 'LocalMedia') {
		localMedia.player.volume = (volume / 100) * 0.5
	}else if(game.platform == 'YouTube'){
		youtube.player.setVolume(volume)
	}else if(game.platform == 'SoundCloud'){
		soundCloud.player.setVolume(volume)
	}

})