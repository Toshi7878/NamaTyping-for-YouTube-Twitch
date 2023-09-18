let volume = localStorage.getItem('volume') ? +localStorage.getItem('volume') : 50

document.getElementById('volume').value = volume
document.getElementById('volume').title = volume

document.getElementById('volume').addEventListener('input', event => {
	localStorage.setItem('volume', event.target.value)
	volume = event.target.value
	document.getElementById('volume').title = volume

	MediaControl.volumeChange(volume)
})