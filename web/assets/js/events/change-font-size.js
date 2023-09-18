const LYRICS_AREA = document.getElementById("lyrics-container")
const FONT_SIZE_INCREMENT = 2.5


async function loadFontSize(){
	let LOAD_FONT_SIZE = await db.notes.get('font-size')

	if(LOAD_FONT_SIZE){
		LYRICS_AREA.style.fontSize = String(LOAD_FONT_SIZE.data) + 'px'
		LYRICS_AREA.style.lineHeight = String(LOAD_FONT_SIZE.data + 15) + 'px'
	
		if(LOAD_FONT_SIZE.data >= 65){
			document.getElementById("font-size-arrow-top").classList.remove("arrow-highlight")
		}else if(LOAD_FONT_SIZE.data <= 20){
			document.getElementById("font-size-arrow-down").classList.remove("arrow-highlight")
		}

	}

}

loadFontSize()

document.getElementById("font-size-arrow-top").addEventListener('click', event => {
	const FONT_SIZE = parseFloat(getComputedStyle(LYRICS_AREA).fontSize)

	if(FONT_SIZE >= 65){return;}

	LYRICS_AREA.style.fontSize = (FONT_SIZE + FONT_SIZE_INCREMENT).toString() + 'px'
	LYRICS_AREA.style.lineHeight = ((FONT_SIZE + FONT_SIZE_INCREMENT) + 15).toString() + 'px'

	if(FONT_SIZE >= 60){
		event.target.classList.remove("arrow-highlight")
	}

	event.target.nextElementSibling.classList.add("arrow-highlight")
	db.notes.put({id: 'font-size', data:FONT_SIZE + FONT_SIZE_INCREMENT});
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
	db.notes.put({id: 'font-size', data:FONT_SIZE - FONT_SIZE_INCREMENT});
})
