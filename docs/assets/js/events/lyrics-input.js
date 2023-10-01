const lyricsInput = document.getElementById('lyrics-input')


lyricsInput.addEventListener('keydown', event => {

	//変換確定時に発火しないようkeyCodeを使用
	if (event.keyCode === 13 && chat) {


		const chatData = {
				'name': '名無し',
				'id':'solo',
				'comment': event.target.value
		}

		chat.checkPhraseMatch(chatData)
		event.target.value = ''
	}

})

lyricsInput.addEventListener('focus', event => {
	event.target.removeAttribute('placeholder')
})

const lyricsInputToggleBtn = document.getElementById("solo-play")
const bottomMenu = document.getElementById("bottom-menu")

async function loadSoloPlayOption(){
	const TOGGLE_DATA = await db.notes.get('solo-play')
		
	if(TOGGLE_DATA && TOGGLE_DATA.data){
		lyricsInputToggleBtn.parentElement.classList.add('checked-button')
		lyricsInput.parentElement.style.display = 'block'
		bottomMenu.style.bottom = String(lyricsInput.parentElement.clientHeight+10)+'px'
		lyricsInputToggleBtn.checked = true
	}

}
loadSoloPlayOption()


lyricsInputToggleBtn.addEventListener('change', event => {

	toggleCheckbox(event.target)
	adjustWordArea()
	adjustMedia()

})

function toggleCheckbox(element){
		db.notes.put({id:element.id, data:element.checked});
	
		if(element.checked){		
			element.parentElement.classList.add('checked-button')
			lyricsInput.parentElement.style.display = 'block'
			bottomMenu.style.bottom = String(lyricsInput.parentElement.clientHeight+10)+'px'
	
		}else{
			element.parentElement.classList.remove('checked-button')
			lyricsInput.parentElement.style.display = 'none'
			bottomMenu.style.bottom = '15px'
		}
}