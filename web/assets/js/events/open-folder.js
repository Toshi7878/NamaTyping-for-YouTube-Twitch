document.getElementById('folder-input').addEventListener('change', event => {

	if (event.target.files.length) {
		lrcFolder = new LrcFolder()
		lrcFolder.open(event)
	}

})

class LrcFolder {


		constructor() {
			this.mediaFile
			this.lrcFile
			this.imgFile = ''

		}
	
		open(event) {
			const files = Object.values(event.target.files);
			const lrcExtension = ['.lrc']
	
			for (let i = 0; i < files.length; i++) {
				const fileExtension = files[i].name.slice(-4)
				const fileType = files[i].type
	
				if (fileType.includes('audio') || fileType.includes('video')) {
					this.mediaFile = URL.createObjectURL(files[i])
				} else if (fileType.includes('image')) {
					this.imgFile = URL.createObjectURL(files[i])
				} else if (lrcExtension.includes(fileExtension)) {
					this.lrcFile = files[i]
				}
			}
	
			if (!this.lrcFile) {
				localMedia = null
				alert('lrcファイルが見つかりませんでした')
			} else if (!this.mediaFile) {
				localMedia = null
				alert('動画・音楽ファイルが見つかりませんでした')
			} else {
				const reader = new FileReader()
				reader.readAsArrayBuffer(this.lrcFile)
				// ファイル読み込み完了時にlrcファイルを正しい文字コードで取得する
				reader.onload = event => {
					document.getElementById("edit-button").parentElement.classList.add('d-none')
					const LRC_DATA = parseLrc.parseTextEncord(event)
					const gameLyricsData = parseLrc.timeConvert( LRC_DATA.split('\r\n') )

					const setData = {'platform':'LocalMedia', 'title':this.lrcFile.name.slice(0,-4), 'gameLyricsData':gameLyricsData}
					game = new Game(setData)
				}
			}
		}
	
}

let lrcFolder