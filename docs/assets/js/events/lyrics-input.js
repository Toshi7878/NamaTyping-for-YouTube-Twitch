const lyricsInput = document.getElementById('lyrics-input')
const lyricsTextArea = document.getElementById('lyrics-textarea')


class LyricsInput {

	constructor(){
		lyricsInput.addEventListener('keydown', this.submitEmulateComment.bind(this))
		lyricsInput.addEventListener('focus', this.removePlaceholder)
		lyricsTextArea.addEventListener('keydown', this.submitEmulateComment.bind(this))
		lyricsTextArea.addEventListener('focus', this.removePlaceholder)

	}

	submitEmulateComment(event){

		//変換確定時に発火しないようkeyCodeを使用
		if (event.keyCode === 13) {

			if(event.target.tagName == 'TEXTAREA'){

				if(settingData.userSubmitType.data == 0){

					if(event.shiftKey){
						//Shift+Enterで改行
						setTimeout( () => document.getElementById("lyrics-textarea").scrollTop = 99999999999999, 1)
						return;
					}
	
				}else if(settingData.userSubmitType.data == 1){

					if(!event.ctrlKey){
						//Ctrlキーを押していなかったら改行
						setTimeout(() => document.getElementById("lyrics-textarea").scrollTop = 99999999999999, 1)
						return;
					}
				}

			}

			if(chat){
				this.submit(event.target.value)
			}

			event.target.value = ''
			event.preventDefault()
		}
	
	}

	removePlaceholder(event){
		event.target.removeAttribute('placeholder')
	}


	submit(comment){
		const chatData = {
			'name': settingData.emulateName.data,
			'id':'solo',
			'comment': comment
		}

		chat.checkPhraseMatch(chatData)
	}

}

new LyricsInput()

const bottomMenu = document.getElementById("bottom-menu")



class soloPlayToggle {
	
	constructor(){
		this.lyricsInputToggleBtn = document.getElementById("solo-play")

		this.loadSoloPlayOption()
		this.lyricsInputToggleBtn.addEventListener('change', this.toggleEvent.bind(this))

	}

	async loadSoloPlayOption(){
		let TOGGLE_DATA

		if (location.host == 'localhost:8080') {
			TOGGLE_DATA = {data:iniData['solo-play'] === 'True' ? true:false};
		}else{
			TOGGLE_DATA = await db.notes.get('solo-play') || {id:'solo-play',data:true}
		}
			
		if(TOGGLE_DATA.data){
			this.lyricsInputToggleBtn.parentElement.classList.add('checked-button')
			this.lyricsInputToggleBtn.checked = true
			lyricsInput.parentElement.classList.remove('d-none')
			bottomMenu.style.bottom = String(lyricsInput.parentElement.clientHeight)+'px'
		}else{
			this.lyricsInputToggleBtn.parentElement.classList.remove('checked-button')
			this.lyricsInputToggleBtn.checked = false
		}
	
	}

	toggleEvent(event){
		this.toggleCheckbox(event.target)
		Resize.resize()
	}

	async toggleCheckbox(element){
		
		if (location.host == 'localhost:8080') {
			await eel.saveSetting(element.id,element.checked)();
		}

		db.notes.put({id:element.id, data:element.checked});
	
		if(element.checked){		
			element.parentElement.classList.add('checked-button')
			lyricsInput.parentElement.classList.remove('d-none')
			bottomMenu.style.bottom = String(lyricsInput.parentElement.offsetHeight)+'px'
	
		}else{
			element.parentElement.classList.remove('checked-button')
			lyricsInput.parentElement.classList.add('d-none')
			bottomMenu.style.bottom = '15px'
		}
	}
	
}
if (location.host != 'localhost:8080') {
	new soloPlayToggle()
}

