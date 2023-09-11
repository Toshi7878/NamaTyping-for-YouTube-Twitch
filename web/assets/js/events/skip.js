document.getElementById("skip").addEventListener('click', event => {

	if(timer && game.isStart && document.getElementById("skip").textContent.includes('SKIP')){
		const SKIP_REMAIN_TIME = (timer.count == 0 ? 8 : 10)
		const NEXT_LYRICS_TIME = game.displayLyrics[timer.count]['time'][0]
		const SKIP_TIME = (NEXT_LYRICS_TIME - 8) + (1 - timer.speed)

		if (game.platform == 'LocalMedia') {
			localMedia.player.currentTime = SKIP_TIME
		}else if(game.platform == 'YouTube'){
			youtube.player.seekTo(SKIP_TIME)
		}else if(game.platform == 'SoundCloud'){
			soundCloud.player.seekTo(SKIP_TIME*1000);
		}

		document.getElementById("skip").textContent = ''
	}

})
