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
			this.replFile

		}
	
		async open(event) {
			const files = Object.values(event.target.files);
	
			for (let i = 0; i < files.length; i++) {
				const fileType = files[i].type
	
				if (fileType.includes('audio') || fileType.includes('video')) {
					this.mediaFile = URL.createObjectURL(files[i])
				} else if (fileType.includes('image')) {
					this.imgFile = URL.createObjectURL(files[i])
				} else if (files[i].name.endsWith('.lrc')) {
					this.lrcFile = files[i]
				} else if(files[i].name.endsWith('.repl.txt')){
					this.replFile = files[i]
				}
			}
	
			if (!this.lrcFile) {
				localMedia = null
				alert('lrcファイルが見つかりませんでした')
			} else if (!this.mediaFile) {
				localMedia = null
				alert('動画・音楽ファイルが見つかりませんでした')
			} else {
				let replData = []

				if(this.replFile){
					const replReader = new FileReader()
					replReader.readAsArrayBuffer(this.replFile)

					// Wrap the file reading in an async function
					replData = await new Promise(resolve => {replReader.onload = event => resolve(parseLrc.parseTextEncord(event))} );
					replData = replData.split('\r\n').filter(x => x !== "")

					for(let i=0;i<replData.length;i++){
						replData[i] = replData[i].split(',')
					}
				}

				const lrcReader = new FileReader()
				lrcReader.readAsArrayBuffer(this.lrcFile)
				// ファイル読み込み完了時にlrcファイルを正しい文字コードで取得する
				const LRC_DATA = await new Promise(resolve => {lrcReader.onload = event => resolve(parseLrc.parseTextEncord(event))} )

				repl = new Repl(replData)

				document.getElementById("edit-button").parentElement.classList.add('d-none')
				let gameLyricsData = parseLrc.timeConvert( LRC_DATA.split('\r\n') )

				gameLyricsData[1] = repl.marge(gameLyricsData[1])
				const setData = {'platform':'LocalMedia', 'title':this.lrcFile.name.slice(0,-4), 'gameLyricsData':gameLyricsData}
				game = new Game(setData)

			}
		}
	
}

let lrcFolder