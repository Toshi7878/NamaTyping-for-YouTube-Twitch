document.getElementById("speed").addEventListener('input', event => {
	
	if(timer){
		timer.speed = +event.target.value
		MediaControl.speedChange(timer.speed)
	}

	document.getElementById("speed-label").textContent = Number(event.target.value).toFixed(2)
})