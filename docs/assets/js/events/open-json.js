document.getElementById('file-input').addEventListener('change', event => {

	if (event.target.files.length) {
		const reader = new FileReader()
		reader.readAsArrayBuffer(event.target.files[0])

		reader.onload = result => {
			//Lrcデータ読み込み用regex正規表現を初期化
			parseLrc = new ParseLrc()
			
			// ファイル読み込み完了時にjsonファイルを正しい文字コードで取得する
			const JSON_DATA = JSON.parse( parseLrc.parseTextEncord(result) )
			parseJson = new ParseJson(JSON_DATA)
		}

	}

})