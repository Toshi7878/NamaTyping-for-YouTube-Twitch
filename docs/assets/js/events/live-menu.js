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
		})

		RESULT_URL_BTN.addEventListener('click', e => {
			if (navigator.clipboard) {
				const LIVE_ID = extractYouTubeVideoId(LIVE_ID_BOX.value)
				return navigator.clipboard.writeText(`https://namatyping-result.onrender.com/?${LIVE_ID}`).then(() => {
					const jsFrame = new JSFrame();
					jsFrame.showToast({
						width:500,
						align:'top',
						style: {
							borderRadius: '2px',
							backgroundColor: '#198754b8',
		
						},
						html: `<span style="color:white;font-weight;bold;">クリップボードにリザルト履歴URLをコピーしました。</span>`
					});
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
	const regex = /[?&]v=([^?&]+)/;
	const match = url.match(regex);

	// Check if a match is found
	if (match && match[1]) {
		return match[1];
	} else if(url.length == 11){
		// No match found or invalid URL
		return url;
	}
}

