class LocalMedia {

	constructor(src, img='') {
		document.getElementById("video-box").insertAdjacentHTML('beforeend', `
		<video id='video' src="${src}" poster="${img}">
		`)
	}

}

let localMedia