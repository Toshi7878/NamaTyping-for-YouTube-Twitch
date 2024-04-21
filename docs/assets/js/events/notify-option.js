

const CHECKBOX_ID = {
	'notify-comment':'notifyComment',
	'notify-scoring':'notifyScoring',
	'notify-username':'notifyUserName'
}
const NOTIFY = document.getElementById("notify")

class LoadNotifyOption{

	 async loadFontSize(){
		let LOAD_FONT_SIZE;

		if (location.host == 'localhost:8080') {
			LOAD_FONT_SIZE = {data:Number(iniData['notify-font-size'])};
		}else{
			LOAD_FONT_SIZE = await db.notes.get('notify-font-size')
		}
		if(LOAD_FONT_SIZE){
			NOTIFY.style.fontSize = String(LOAD_FONT_SIZE.data) + 'px'
			NOTIFY.style.lineHeight = String(LOAD_FONT_SIZE.data + 15) + 'px'
		
			if(LOAD_FONT_SIZE.data >= 65){
				document.getElementById("font-size-arrow-top").parentElement.classList.remove("arrow-highlight")
			}else if(LOAD_FONT_SIZE.data <= 20){
				document.getElementById("font-size-arrow-down").parentElement.classList.remove("arrow-highlight")
			}
		}
	}

	async loadOption(id){
		let TOGGLE_DATA
		if (location.host == 'localhost:8080') {
			TOGGLE_DATA = {data:iniData[id] === 'True' ? true:false};
		}else{
			TOGGLE_DATA = await db.notes.get(id)
		}
			
		if(TOGGLE_DATA && TOGGLE_DATA.data){
			const ELEMENT = document.getElementById(id)
			ELEMENT.parentElement.classList.add('checked-button')
			ELEMENT.checked = true
			return true
		}

		return false
	}
	
	async loadStart(){
		const obj = Object.keys(CHECKBOX_ID)

		for(let i=0;i<obj.length;i++){
			this[CHECKBOX_ID[obj[i]]] = await this.loadOption(obj[i])
		}
	}
}


class NotifyOption extends LoadNotifyOption{

	constructor(){
		super()
		document.getElementById("notify-delete").addEventListener('click', event => {
			document.getElementById("notify").textContent = ''
		})
		
		document.getElementById("notify-scoring").addEventListener('change', event => {
			NotifyOption.toggleCheckbox(event.target)
			this[CHECKBOX_ID[event.target.id]] = event.target.checked
		})
		
		document.getElementById("notify-font-size-up").addEventListener('click', async event => {
			const FONT_SIZE = parseFloat(getComputedStyle(NOTIFY).fontSize)
		
			if(FONT_SIZE >= 65){return;}
		
			NOTIFY.style.fontSize = (FONT_SIZE + FONT_SIZE_INCREMENT).toString() + 'px'
			NOTIFY.style.lineHeight = ((FONT_SIZE + FONT_SIZE_INCREMENT) + 15).toString() + 'px'
		
			if(FONT_SIZE >= 60){
				event.target.parentElement.classList.remove("arrow-highlight")
			}
		
			event.target.parentElement.nextElementSibling.classList.add("arrow-highlight")

			if (location.host == 'localhost:8080') {
				await eel.saveSetting('notify-font-size',FONT_SIZE + FONT_SIZE_INCREMENT)();
			}

			db.notes.put({id: 'notify-font-size', data:FONT_SIZE + FONT_SIZE_INCREMENT});
		})

		document.getElementById("notify-font-size-down").addEventListener('click',async event => {
			const FONT_SIZE = parseFloat(getComputedStyle(NOTIFY).fontSize)

			if(FONT_SIZE <= 20){return;}
		
			NOTIFY.style.fontSize = (FONT_SIZE - FONT_SIZE_INCREMENT).toString() + 'px'
			NOTIFY.style.lineHeight = ((FONT_SIZE - FONT_SIZE_INCREMENT) + 15).toString() + 'px'
		
			if(FONT_SIZE <= 25){
				event.target.parentElement.classList.remove("arrow-highlight")
			}
		
			event.target.parentElement.previousElementSibling.classList.add("arrow-highlight")
			if (location.host == 'localhost:8080') {
				await eel.saveSetting('notify-font-size',FONT_SIZE + FONT_SIZE_INCREMENT)();
			}
			db.notes.put({id: 'notify-font-size', data:FONT_SIZE - FONT_SIZE_INCREMENT});
		})

		this.loadStart()
		this.loadFontSize()
	}

	static async toggleCheckbox(element){
		if (location.host == 'localhost:8080') {
			await eel.saveSetting(element.id,element.checked)();
		}
		db.notes.put({id:element.id, data:element.checked});
	
		if(element.checked){		
			element.parentElement.classList.add('checked-button')
	
		}else{
			element.parentElement.classList.remove('checked-button')
		}
	}
}

let notifyOption

if (location.host != 'localhost:8080') {
	notifyOption = new NotifyOption()
}