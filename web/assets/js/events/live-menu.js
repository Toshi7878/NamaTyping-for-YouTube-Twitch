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

		const ID = await await db.notes.get('live-id')

		if (location.host == 'localhost:8080' && ID) {
			LIVE_ID_BOX.value = ID.data
			ToggleBtn.resultHistoryButton(LIVE_ID_BOX.value)
		}

		LIVE_ID_BOX.addEventListener('input', e => {
			db.notes.put({id: 'live-id', data:e.target.value});
			ToggleBtn.resultHistoryButton(e.target.value)
		})

		RESULT_URL_BTN.addEventListener('click', e => {
			if (navigator.clipboard) {

				return navigator.clipboard.writeText(`https://toshi7878.github.io/NamaTyping-for-YouTube-Twitch/?${LIVE_ID_BOX.value}`).then(() => {
					alert('クリップボードにリザルト履歴URLをコピーしました。')
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


