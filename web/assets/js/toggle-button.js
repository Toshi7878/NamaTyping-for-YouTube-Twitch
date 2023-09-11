function disableStartButton() {
	document.getElementById("start-button").parentElement.title = ''
	document.getElementById("start-button").parentElement.setAttribute('class', 'label-btn-disabled')
	document.getElementById("start-button").disabled = true

	document.getElementById("score-button").parentElement.title = '終了しランキングを表示します'
	document.getElementById("score-button").parentElement.setAttribute('class', 'label-btn')
	document.getElementById("score-button").removeAttribute('disabled')
}


function disableScoreButton() {
	document.getElementById("score-button").parentElement.title = ''
	document.getElementById("score-button").parentElement.setAttribute('class', 'label-btn-disabled')
	document.getElementById("score-button").disabled = true


	document.getElementById("start-button").parentElement.title = '開始'
	document.getElementById("start-button").parentElement.setAttribute('class', 'label-btn')
	document.getElementById("start-button").removeAttribute('disabled')
}