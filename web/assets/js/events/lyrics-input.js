const lyricsInput = document.getElementById('lyrics-input')


lyricsInput.addEventListener('keydown', event => {

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

const lyricsInputToggleBtn = document.getElementById("solo-play")
const lyricsInputToggle = localStorage.getItem('solo-play')
const bottomMenu = document.getElementById("bottom-menu")

	if(lyricsInputToggle == 'true'){
		lyricsInputToggleBtn.parentElement.classList.add('checked-button')
		lyricsInput.parentElement.style.display = 'block'
		bottomMenu.style.bottom = String(lyricsInput.parentElement.clientHeight+10)+'px'
	}


lyricsInputToggleBtn.addEventListener('change', event => {

	localStorage.setItem('solo-play',event.target.checked)

	if(event.target.checked){		
		event.target.parentElement.classList.add('checked-button')
		lyricsInput.parentElement.style.display = 'block'
		bottomMenu.style.bottom = String(lyricsInput.parentElement.clientHeight+10)+'px'

	}else{
		event.target.parentElement.classList.remove('checked-button')
		lyricsInput.parentElement.style.display = 'none'
		bottomMenu.style.bottom = '15px'
	}

	adjustWordArea()
	adjustMedia()

})