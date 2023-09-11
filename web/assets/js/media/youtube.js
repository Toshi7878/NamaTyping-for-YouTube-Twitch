
function onYouTubeIframeAPIReady() {
	playerEvent = new PlayerEvent(YouTubePlayerState)

	youtube.player = new YT.Player('player', {

		playerVars: {
			controls: 0,
			disablekb: 1,
		},

		videoId: youtube.id,

		events: {
			'onReady': playerEvent.onPlayerReady,
			'onStateChange': playerEvent.onPlayerStateChange.bind(playerEvent)
			//'onPlaybackQualityChange': youtube.onPlayerPlaybackQualityChange,
			//'onPlaybackRateChange': youtube.onPlayerPlaybackRateChange,
		}

	});
}



class YouTube {

	constructor(id) {
		this.player
		this.id = id

		if (!youtube) {
			//createElementでiframe_apiを読み込むとただちにonYouTubeIframeAPIReadyが実行される
			const tag = document.createElement('script');
			tag.src = "https://www.youtube.com/iframe_api";
			var firstScriptTag = document.getElementsByTagName('script')[0];
			firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

			/*iframe_apiが読み込まれると以下の関数が実行
				↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓
				onYouTubeIframeAPIReady()
			*/
		} else {
			//iframe_api追加済みの場合はcueVideoIdで動画を切り替え
			youtube.player.cueVideoById(id)
			document.getElementById("player").style.display = 'block'
		}
	}
}

let youtube