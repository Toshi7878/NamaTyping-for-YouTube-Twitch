document.getElementById("speed").addEventListener('input', event => {
	
	if(timer){
		timer.speed = +event.target.value
		MediaControl.speedChange(timer.speed)
		totalTime = new TotalTime()
	}

	document.getElementById("speed-label").textContent = Number(event.target.value).toFixed(2)
})