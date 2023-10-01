class ToggleBtn {

	static disableStartButton() {
		document.getElementById("start-button").parentElement.title = ''
		document.getElementById("start-button").parentElement.setAttribute('class', 'label-btn-disabled')
		document.getElementById("start-button").disabled = true
	
		document.getElementById("score-button").parentElement.title = '終了しランキングを表示します'
		document.getElementById("score-button").parentElement.setAttribute('class', 'label-btn')
		document.getElementById("score-button").removeAttribute('disabled')
	}


	static disableScoreButton() {
		document.getElementById("score-button").parentElement.title = ''
		document.getElementById("score-button").parentElement.setAttribute('class', 'label-btn-disabled')
		document.getElementById("score-button").disabled = true
	
	
		document.getElementById("start-button").parentElement.title = '開始'
		document.getElementById("start-button").parentElement.setAttribute('class', 'label-btn')
		document.getElementById("start-button").removeAttribute('disabled')
	}


	static resultHistoryButton(id){
		if(id){
			document.getElementById("result-url-copy").parentElement.title = 'リザルト履歴URLをクリップボードにコピー'
			document.getElementById("result-url-copy").parentElement.setAttribute('class', 'label-btn')
			document.getElementById("result-url-copy").removeAttribute('disabled')
		}else{
			document.getElementById("result-url-copy").parentElement.title = ''
			document.getElementById("result-url-copy").parentElement.setAttribute('class', 'label-btn-disabled')
			document.getElementById("result-url-copy").disabled = true
		}

	}

}