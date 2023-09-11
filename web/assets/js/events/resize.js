window.addEventListener('resize', e => {
	adjustWordArea()
	adjustMedia()
})

const resizeObserver = new ResizeObserver(adjustWordArea);
resizeObserver.observe(document.getElementById("word-area"));


function adjustWordArea(event) {
	const bottomMenu = document.getElementById("bottom-menu")
	const bottom = (parseFloat(getComputedStyle(bottomMenu).bottom) + bottomMenu.clientHeight) * 0.8
	const WORD_AREA_HEIGHT = document.getElementById("word-area").clientHeight

	if(event == undefined){
		document.getElementById("word-area").style.top = ``
		// document.getElementById("height-dragger").style.top = ``
	}
	document.getElementById("word-area").style.bottom = `${bottom.toString()}px`
	// document.getElementById("height-dragger").style.bottom = `${(WORD_AREA_HEIGHT + bottom).toString()}px`

}

const adjustMediaElement = ['video', 'player', 'sc-widget', 'transparent-cover']

function adjustMedia() {
	const bottomMenu = document.getElementById("bottom-menu")
	const bottom = (parseFloat(getComputedStyle(bottomMenu).bottom) + bottomMenu.clientHeight) * 0.8

	const topMenu = document.getElementById("top-menu")
	const top = (parseFloat(getComputedStyle(topMenu).top) + topMenu.clientHeight) * 0.8

	for(i=0;i<adjustMediaElement.length;i++){
		const player = document.getElementById(adjustMediaElement[i])

		if(player){
			player.style.bottom = `${bottom.toString()}px`
			player.style.height = `${(window.innerHeight - (top + bottom)).toString()}px`
		}

	}

}

adjustWordArea()
adjustMedia()
$("#word-area").resizable({handles:'n'});