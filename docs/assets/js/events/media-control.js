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

	static speedChange(speed){
		if (game.platform == 'LocalMedia') {
			localMedia.player.playbackRate = speed
		}else if(game.platform == 'YouTube'){
			youtube.player.setPlaybackRate(speed)
		}else if(game.platform == 'SoundCloud'){

		}
	}

	static volumeChange(volume){
		if (game.platform == 'LocalMedia') {
			localMedia.player.volume = (volume / 100) * 0.5
		}else if(game.platform == 'YouTube'){
			youtube.player.setVolume(volume)
		}else if(game.platform == 'SoundCloud'){
			soundCloud.player.setVolume(volume)
		}
	}

}


class MediaData {

	static async getIsPlay(){

		if (game.platform == 'LocalMedia') {

			if(!localMedia.player.paused){
				return false;
			}else{
				return true;
			}
	
		}else if(game.platform == 'YouTube'){
	
			if(youtube.player.getPlayerState() == 1){
				return false;
			}else{
				return true;
			}

		}else if(game.platform == 'SoundCloud'){
			const isPaused = await new Promise((resolve) => { soundCloud.player.isPaused(isPaused => resolve(isPaused)); });

			if(!isPaused){
				return false;
			}else{
				return true;
			}

		}

	}

	static async getCurrentTime(){
		if (game.platform == 'LocalMedia') {
			return localMedia.player.currentTime;
		}else if(game.platform == 'YouTube'){
			return youtube.player.getCurrentTime();
		}else if(game.platform == 'SoundCloud'){
			return await new Promise(resolve => { soundCloud.player.getPosition(currentTime => resolve(currentTime / 1000)); });
		}
	}

	static async getDuration(){
		if (game.platform == 'LocalMedia') {
			return localMedia.player.duration;
		}else if(game.platform == 'YouTube'){
			return youtube.player.getDuration();
		}else if(game.platform == 'SoundCloud'){
			return await new Promise(resolve => { soundCloud.player.getDuration(duration => resolve(duration / 1000)); });
		}
	}


}