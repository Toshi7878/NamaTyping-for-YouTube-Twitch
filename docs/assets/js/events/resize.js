const adjustMediaElement = ['video', 'player', 'sc-widget', 'transparent-cover']

class Resize {

	constructor(){
		window.addEventListener('resize', Resize.resize)
		Resize.adjustWordArea()
		Resize.adjustMedia()

		$("#word-area").resizable({
			handles: 'n',
			resize: Resize.resizeEvent,
			stop: () => {
				Resize.adjustWordArea()
			}
		})

	}

	static resize(event){
		Resize.adjustWordArea()
		Resize.adjustMedia()
		Resize.resizeEvent(null, document.getElementById("word-area").clientHeight)
	}

	static adjustWordArea(event) {
	
		if(!game || !game.isEdit){
	
			const bottomMenu = document.getElementById("bottom-menu")
			const wordAreaBottom = (parseFloat(getComputedStyle(bottomMenu).bottom) + bottomMenu.clientHeight) * 0.8
		
			if(event == undefined){
				document.getElementById("word-area").style.top = ``
			}
	
			document.getElementById("word-area").style.bottom = `${wordAreaBottom.toString()}px`
		}else if(editor){
			editor.resizeWordArea()
		}
	
	}

	static adjustMedia() {
		const bottomMenu = document.getElementById("bottom-menu")
		const bottom = (parseFloat(getComputedStyle(bottomMenu).bottom) + bottomMenu.clientHeight) * 0.8
	
		const topMenu = document.getElementById("top-menu")
		const top = (parseFloat(getComputedStyle(topMenu).top) + topMenu.clientHeight) * 0.8
	
		for(let i=0;i<adjustMediaElement.length;i++){
			const player = document.getElementById(adjustMediaElement[i])
	
			if(player){
				player.style.bottom = `${bottom.toString()}px`
				player.style.height = `${(window.innerHeight - (top + bottom)).toString()}px`
			}
	
		}
	
	}

	static resizeEvent(event, ui) {
		const bottomMenu = document.getElementById("bottom-menu")
		const bottom = (parseFloat(getComputedStyle(bottomMenu).bottom) + bottomMenu.clientHeight) * 0.8
	
		const topMenu = document.getElementById("top-menu")
		const top = (parseFloat(getComputedStyle(topMenu).top) + topMenu.clientHeight) * 0.8
	
		const notify = document.getElementById('notify-container');
	
		const HEIGHT = typeof ui == 'number' ? ui : ui.size.height
	
		const NOTIFY_HEIGHT = (window.innerHeight - (top + bottom) - HEIGHT-20)
		notify.style.height = `${NOTIFY_HEIGHT.toString()}px`
		notify.scrollTop = notify.scrollHeight - notify.clientHeight;

		if(NOTIFY_HEIGHT > 350){
			document.getElementById("notify-options").style.zoom = ''
		}else{
			document.getElementById("notify-options").style.zoom = '70%'
		}
	}

}

new Resize()
