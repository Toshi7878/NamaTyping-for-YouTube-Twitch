document.getElementById("word-area").addEventListener('mouseover', event => {
	document.getElementById("font-size-container").style.display = 'inline-flex'
})

document.getElementById("word-area").addEventListener('mouseout', event => {
	document.getElementById("font-size-container").style.display = 'none'
})