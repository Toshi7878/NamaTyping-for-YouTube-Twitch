const lyricsInput = document.getElementById('lyrics-input')
const lyricsTextArea = document.getElementById('lyrics-textarea')


class LyricsInput {

	constructor(){

		
		lyricsInput.addEventListener('keydown', this.submitEmulateComment)
		lyricsInput.addEventListener('focus', this.removePlaceholder)
		lyricsTextArea.addEventListener('keydown', this.submitEmulateComment)
		lyricsTextArea.addEventListener('focus', this.removePlaceholder)

	}

	submitEmulateComment(event){

		//変換確定時に発火しないようkeyCodeを使用
		if (event.keyCode === 13 && chat) {

			if(event.target.tagName == 'TEXTAREA' && event.shiftKey){
				setTimeout( () => {
					const t = document.getElementById("lyrics-textarea");
					t.scrollTop = t.scrollHeight
				}, 2)
				return;
			}
	
	
			const chatData = {
					'name': settingData.emulateName.data,
					'id':'solo',
					'comment': event.target.value
			}
	
			chat.checkPhraseMatch(chatData)
			event.target.value = ''
			event.preventDefault()
		}
	
	}

	removePlaceholder(event){
		event.target.removeAttribute('placeholder')
	}

}

new LyricsInput()

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