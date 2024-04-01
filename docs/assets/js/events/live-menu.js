/**
 * 配信ID欄を保持
 */
class Live {

	constructor() {
		this.liveIdLoadData()
		this.streamPlatformLoadData()
	}

	async liveIdLoadData(){
		const LIVE_ID_BOX = document.getElementById("live-id")
		const RESULT_URL_BTN = document.getElementById("result-url-copy")

		if (location.host == 'localhost:8080') {
			ToggleBtn.resultHistoryButton(LIVE_ID_BOX.value)
		}

		LIVE_ID_BOX.addEventListener('input', e => {
			ToggleBtn.resultHistoryButton(e.target.value)

			extractYouTubeVideoId(e.target.value)
		})

		RESULT_URL_BTN.addEventListener('click', e => {
			if (navigator.clipboard) {
				const LIVE_ID = extractYouTubeVideoId(LIVE_ID_BOX.value)

				return navigator.clipboard.writeText(`https://namatyping-result.onrender.com/?${LIVE_ID}`).then(() => {
					showToast(`<span style="color:white;font-weight;bold;">クリップボードにリザルト履歴URLをコピーしました。</span>`,
					'#198754b8',500)
				})

			  }
			})
			
	}

	async streamPlatformLoadData(){
		const PLATFORM = document.getElementById("live-platform")
		const SELECT_PLATFORM = await db.notes.get('live-platform')
		
		if(SELECT_PLATFORM){
			PLATFORM.selectedIndex = SELECT_PLATFORM.data
		}

		PLATFORM.addEventListener('change', e => {
			db.notes.put({id: 'live-platform', data:e.target.selectedIndex});
		})
	}
}

let live = new Live()

if (location.host == 'localhost:8080') {
	document.getElementById("live-id").removeAttribute('disabled')
	document.getElementById("live-platform").removeAttribute('disabled')
}

function extractYouTubeVideoId(url) {
	const PLATFORM = document.getElementById("live-platform")

	const YOUTUBE_REGEX = /(?:youtu\.be|youtube).*(?:\/|v=)([a-zA-Z0-9_-]{11})/;
	const YOUTUBE = url.match(YOUTUBE_REGEX);

	const TWITCH_REGEX = /(?:https?:\/\/)?(?:www\.)?twitch\.tv\/(\w+)/;
	const TWITCH = url.match(TWITCH_REGEX);
	// Check if a match is found
	if (YOUTUBE && YOUTUBE[1]) {
		PLATFORM.selectedIndex = 0 //YouTube Live
		return YOUTUBE[1];
	}else if(TWITCH && TWITCH[1]){
		PLATFORM.selectedIndex = 1 //Twitch
		return TWITCH[1]
	} else {
		// No match found or invalid URL
		return url;
	}
}

