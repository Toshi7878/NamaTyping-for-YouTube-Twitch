
class EditTimer{

	constructor(){
		document.getElementById("game-time").style.display = 'none'
		document.getElementById("edit-time").style.display = 'block'
	}


	updateTime(){
		document.getElementById("current-second-time").textContent = timer.headTime.toFixed(2)
	}

}

let editTimer