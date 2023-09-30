document.getElementById("word-area").addEventListener('mouseover', event => {
	document.getElementById("font-size-container").style.display = 'inline-flex'
})

document.getElementById("word-area").addEventListener('mouseout', event => {
	document.getElementById("font-size-container").style.display = 'none'
})

document.getElementById("video-box").addEventListener('mouseover', event => {
	document.getElementById("notify-options").classList.add('d-block')
	document.getElementById("notify-options").classList.remove('d-none')
})

document.getElementById("video-box").addEventListener('mouseout', event => {
	document.getElementById("notify-options").classList.add('d-none')
	document.getElementById("notify-options").classList.remove('d-block')
})