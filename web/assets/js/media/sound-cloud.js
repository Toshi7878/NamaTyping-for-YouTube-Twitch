
class SoundCloud {

	constructor(trackNo){
		const bottomMenu = document.getElementById("bottom-menu")
		const bottom = (parseFloat(getComputedStyle(bottomMenu).bottom) + bottomMenu.clientHeight) * 0.8
	
		const topMenu = document.getElementById("top-menu")
		const top = (parseFloat(getComputedStyle(topMenu).top) + topMenu.clientHeight) * 0.8

		const URL = `https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/${String(trackNo)}`
		const OPTION = `&color=%23ff5500&visual=true`

		document.getElementById("video-box").insertAdjacentHTML('beforeend', `
		<iframe id="sc-widget" allow="autoplay" frameborder="no" src ="${URL + OPTION}"
		style="bottom:${bottom.toString()}px;height:${(window.innerHeight - (top + bottom)).toString()}px;"></iframe>`)
		document.getElementById("sc-widget").src = URL + OPTION
	}


}

let soundCloud