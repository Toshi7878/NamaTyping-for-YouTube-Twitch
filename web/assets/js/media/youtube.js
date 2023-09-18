

class YouTube {

	constructor(id) {
		this.player
		this.id = id
		
		const bottomMenu = document.getElementById("bottom-menu")
		const bottom = (parseFloat(getComputedStyle(bottomMenu).bottom) + bottomMenu.clientHeight) * 0.8
	
		const topMenu = document.getElementById("top-menu")
		const top = (parseFloat(getComputedStyle(topMenu).top) + topMenu.clientHeight) * 0.8


		document.getElementById("player-speed").classList.remove('d-none')
		document.getElementById("video-box").insertAdjacentHTML('beforeend', `<div id="player" style="bottom:${bottom.toString()}px;height:${(window.innerHeight - (top + bottom)).toString()}px;"></div>`)
		this.onYouTubeIframeAPIReady(id)
	}


	onYouTubeIframeAPIReady(id) {
		playerEvent = new PlayerEvent(YouTubePlayerState)
	
		this.player = new YT.Player('player', {
	
			playerVars: {
				controls: 0,
				disablekb: 1,
			},
	
			videoId: id,
	
			events: {
				'onReady': playerEvent.onPlayerReady,
				'onStateChange': playerEvent.onPlayerStateChange.bind(playerEvent)
				//'onPlaybackQualityChange': youtube.onPlayerPlaybackQualityChange,
				//'onPlaybackRateChange': youtube.onPlayerPlaybackRateChange,
			}
	
		});
	}
	
}

let youtube