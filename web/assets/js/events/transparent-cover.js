const transparentCover = document.getElementById("transparent-cover")

transparentCover.addEventListener('click',async (event) => {
	if(!game){return;}	


	if (game.platform == 'LocalMedia') {

		if(!localMedia.player.paused){
			localMedia.player.pause()
		}else{
			localMedia.player.play()
		}

	}else if(game.platform == 'YouTube'){

		if(youtube.player.getPlayerState() == 1){
			youtube.player.pauseVideo()
		}else{
			youtube.player.playVideo()
		}
	}else if(game.platform == 'SoundCloud'){
		const isPaused = await isSoundCloudPlayerPaused();
		if(!isPaused){
			soundCloud.player.pause()
		}else{
			soundCloud.player.play()

		}
	}
})



function isSoundCloudPlayerPaused() {
	return new Promise((resolve, reject) => {
	  soundCloud.player.isPaused((isPaused) => {
		if (isPaused !== null) {
		  resolve(isPaused);
		} else {
		  reject(new Error('Failed to determine the player state.'));
		}
	  });
	});
  }