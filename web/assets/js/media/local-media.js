class LocalMedia {

	constructor(src, img='') {
		document.getElementById("video-box").insertAdjacentHTML('beforeend', `
		<video id='video' src="${src}" poster="${img}">
		`)

		document.getElementById("player-speed").classList.remove('d-none')

	}

}

let localMedia