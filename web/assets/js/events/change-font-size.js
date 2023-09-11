const LYRICS_AREA = document.getElementById("lyrics-container")
const LOCAL_STRAGE_FONT_SIZE = localStorage.getItem('font-size')
const FONT_SIZE_INCREMENT = 2.5

if(LOCAL_STRAGE_FONT_SIZE){
	LYRICS_AREA.style.fontSize = String(LOCAL_STRAGE_FONT_SIZE) + 'px'
	LYRICS_AREA.style.lineHeight = String(+LOCAL_STRAGE_FONT_SIZE + 15) + 'px'

	if(+LOCAL_STRAGE_FONT_SIZE >= 65){
		document.getElementById("font-size-arrow-top").classList.remove("arrow-highlight")
	}else if(+LOCAL_STRAGE_FONT_SIZE <= 20){
		document.getElementById("font-size-arrow-down").classList.remove("arrow-highlight")
	}
	
}


document.getElementById("font-size-arrow-top").addEventListener('click', event => {
	const FONT_SIZE = parseFloat(getComputedStyle(LYRICS_AREA).fontSize)

	if(FONT_SIZE >= 65){return;}

	LYRICS_AREA.style.fontSize = (FONT_SIZE + FONT_SIZE_INCREMENT).toString() + 'px'
	LYRICS_AREA.style.lineHeight = ((FONT_SIZE + FONT_SIZE_INCREMENT) + 15).toString() + 'px'

	if(FONT_SIZE >= 60){
		event.target.classList.remove("arrow-highlight")
	}

	event.target.nextElementSibling.classList.add("arrow-highlight")
	localStorage.setItem('font-size',FONT_SIZE + FONT_SIZE_INCREMENT)
})


document.getElementById("font-size-arrow-down").addEventListener('click', event => {
	const FONT_SIZE = parseFloat(getComputedStyle(LYRICS_AREA).fontSize)

	if(FONT_SIZE <= 20){return;}

	LYRICS_AREA.style.fontSize = (FONT_SIZE - FONT_SIZE_INCREMENT).toString() + 'px'
	LYRICS_AREA.style.lineHeight = ((FONT_SIZE - FONT_SIZE_INCREMENT) + 15).toString() + 'px'

	if(FONT_SIZE <= 25){
		event.target.classList.remove("arrow-highlight")
	}

	event.target.previousElementSibling.classList.add("arrow-highlight")
	localStorage.setItem('font-size',FONT_SIZE - FONT_SIZE_INCREMENT)
})
