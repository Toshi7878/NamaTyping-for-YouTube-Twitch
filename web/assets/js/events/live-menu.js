/**
 * 配信ID欄を保持
 */
class Live {

	constructor() {
		this.liveIdSetLocalStorage()
		this.StreamPlatformSetLocalStorage()
	}

	liveIdSetLocalStorage(){
		const liveIDBox = document.getElementById("live-id")
		const ID = localStorage.getItem('live-id')

		if (location.host == 'localhost:8080' && ID) {
			liveIDBox.value = ID
		}

		liveIDBox.addEventListener('input', e => {
			localStorage.setItem('live-id', e.target.value)
		})
	}

	StreamPlatformSetLocalStorage(){
		const platformBox = document.getElementById("live-platform")
		const selectedPlatform = localStorage.getItem('live-platform')
		platformBox.selectedIndex = selectedPlatform

		platformBox.addEventListener('change', e => {
			localStorage.setItem('live-platform', e.target.selectedIndex)
		})
	}
}

let live = new Live()

if (location.host == 'localhost:8080') {
	document.getElementById("live-id").removeAttribute('disabled')
	document.getElementById("live-platform").removeAttribute('disabled')
}


