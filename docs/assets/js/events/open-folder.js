document.getElementById('folder-input').addEventListener('change', event => {

	if (event.target.files.length) {
		lrcFolder = new LrcFolder()
		lrcFolder.open(event.target.files)
	}

})


document.body.addEventListener('dragover', event => {
    event.preventDefault();
});

class DropEvent {

	constructor(){
		document.getElementById("notify").addEventListener("drop", this.drop.bind(this), false);
		document.getElementById("word-area").addEventListener("drop", this.drop.bind(this), false);
	}

	async drop(event) {
		event.preventDefault();
		const items = event.dataTransfer.items;
		const results = [];
		const promise = [];
		for (const item of items) {
			const entry = item.webkitGetAsEntry();
			promise.push(this.scanFiles(entry, results));
		}
		await Promise.all(promise);
	
		if (results.length) {
			lrcFolder = new LrcFolder()
			lrcFolder.open(results, 'isDrop')
		}
	
	}

	async scanFiles(entry, tmpObject) {
		switch (true) {
			case (entry.isDirectory) :
				const entryReader = entry.createReader();
				const entries = await new Promise(resolve => {
					entryReader.readEntries(entries => resolve(entries));
				});
				await Promise.all(entries.map(entry => this.scanFiles(entry, tmpObject)), this);
				break;
			case (entry.isFile) :
				tmpObject.push(entry);
				break;
		}
	}

}

new DropEvent()

const VIDEO = [
    'webm',
    'mp4',
    'ogg',
    'ogv',
    'avi',
    'mov',
    'flv',
    'mkv',
    // 他にも可能性がある拡張子を追加する
];

const AUDIO = [
    'mp3',
    'ogg',
    'wav',
    'flac',
    'aac',
    'm4a',
    // 他にも可能性がある拡張子を追加する
];

const IMAGE = [
    'jpeg',
    'jpg',
    'png',
    'gif',
    'bmp',
    'webp',
    'svg',
    // 他にも可能性がある拡張子を追加する
];
class LrcFolder {


		constructor() {
			this.mediaFile
			this.lrcFile
			this.imgFile = ''
			this.replFile
			this.jsonFile
		}
	
		async open(folder, isDrop) {
			const files = Object.values(folder);
	
			for (let i = 0; i < files.length; i++) {
				const fileName = files[i].name.toLowerCase();

				if (VIDEO.some(extension => fileName.endsWith(`.${extension}`)) || AUDIO.some(extension => fileName.endsWith(`.${extension}`))) {
					if(isDrop){
						this.mediaFile = await new Promise((resolve) => { files[i].file(file => {  resolve(URL.createObjectURL(file))}) });
					}else{
						this.mediaFile = URL.createObjectURL(files[i])
					}
				} else if (IMAGE.some(extension => fileName.endsWith(`.${extension}`))) {
					if(isDrop){
						this.imgFile = await new Promise((resolve) => { files[i].file(file => { resolve(URL.createObjectURL(file))}) });
					}else{
						this.imgFile = URL.createObjectURL(files[i])
					}
				} else if (files[i].name.endsWith('.lrc')) {
					if(isDrop){
						this.lrcFile =  await new Promise((resolve) => { files[i].file(file => {resolve(file)}) });
					}else{
						this.lrcFile = files[i]
					}
				} else if(files[i].name.endsWith('.repl.txt')){
					if(isDrop){
						this.replFile = await new Promise((resolve) => { files[i].file(file => {resolve(file)}) });
					}else{
						this.replFile = files[i]
					}
				} else if(files[i].name.endsWith('.json')){
					if(isDrop){
						this.jsonFile = await new Promise((resolve) => { files[i].file(file => {resolve(file)}) });
					}
				}
			}

			//Lrcデータ読み込み用regex正規表現を初期化
			parseLrc = new ParseLrc()
			
			if (this.jsonFile) {
				const jsonReader = new FileReader()
				jsonReader.readAsArrayBuffer(this.jsonFile)

				let JSON_DATA = await new Promise(resolve => {jsonReader.onload = event => resolve(parseLrc.parseTextEncord(event))} );
				parseJson = new ParseJson(JSON.parse( JSON_DATA ))
			}else if (!this.lrcFile) {
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