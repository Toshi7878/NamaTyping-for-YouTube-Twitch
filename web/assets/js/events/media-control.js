class MediaControl {

	static play(){
		if (game.platform == 'LocalMedia') {
			localMedia.player.play()
		}else if(game.platform == 'YouTube'){
			youtube.player.playVideo()
		}else if(game.platform == 'SoundCloud'){
			soundCloud.player.play()
		}
	}

	static pause(){
		if (game.platform == 'LocalMedia') {
			localMedia.player.pause()
		}else if(game.platform == 'YouTube'){
			youtube.player.pauseVideo()
		}else if(game.platform == 'SoundCloud'){
			soundCloud.player.pause()
		}
	}

	static seek(seekTime){
		if (game.platform == 'LocalMedia') {
			localMedia.player.currentTime = seekTime
		}else if(game.platform == 'YouTube'){
			youtube.player.seekTo(seekTime)
		}else if(game.platform == 'SoundCloud'){
			soundCloud.player.seekTo(seekTime*1000);
		}
	}

}