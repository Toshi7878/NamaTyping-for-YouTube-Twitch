document.getElementById("speed").addEventListener('input', event => {
	
	if(timer){
		timer.speed = +event.target.value
		MediaControl.speedChange(timer.speed)
		totalTime = new TotalTime()
	}

	document.getElementById("speed-label").textContent = Number(event.target.value).toFixed(2)
})

document.getElementById("speed-button").parentElement.addEventListener('click', event => {
	
	if(timer){
		timer.speed = 1
		MediaControl.speedChange(timer.speed)
		totalTime = new TotalTime()
	}

	document.getElementById("speed").value = 1
	document.getElementById("speed-label").textContent = '1.00'
})
