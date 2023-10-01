class SettingMenu {
	constructor(){
		this.display()
	}

	static BtnEvent(){

		document.getElementById("option").addEventListener('click', event => {
			const isOpened = settingMenu && settingMenu.frame.isOpen ? true : false

			if(!isOpened){
				settingMenu = new SettingMenu()
			}else{
				settingMenu.frame.requestFocus()
			}
		})

	}

	async display(){
		const jsFrame = new JSFrame();

		this.frame = jsFrame.create({
			title: '設定',
			left: 60, top: 60, width: 615, height: 350,
			movable: true,//マウスで移動可能
			resizable: true,//マウスでリサイズ可能
			appearanceName: 'redstone',//プリセット名は 'yosemite','redstone','popup'
			html:
			`<div id="option-container" class="ms-2 fs-6 lh-lg font-monospace">
				<label>歌詞・ランキング背景の不透明度:<input id='word-area-blur-range' type="range" class="menu-range mx-2" max="1" step="0.01" value="0.6"><span id='blur-range-label'>0.60</span></label>
				<label><input id="display-timer" type="checkbox" class="me-2" checked>再生時間を、歌詞表示領域にも表示する</label>
				<div>
					<label>一人プレイ用 ツールバーのフォントサイズ:<input type="number" id="lyrics-input-font-size" class="ms-2" value='29'>px</label>
					<label class="ms-2"><input id="input-font-weight" type="checkbox" class="me-2">フォントを太く表示</label>
				</div>
				<label><input id="display-next-lyrics" type="checkbox" class="me-2" checked>3秒前に次の歌詞を表示</label>
				<label><input id="word-area-auto-adjust-height" type="checkbox" class="me-2" checked>歌詞エリアの高さ自動調整</label>
				<label><input id="display-discord-rpc" type="checkbox" class="me-2" checked>Discordのアクティビティに表示する</label>
				<label><input type='button' class='mt-2' id='delete-result-history' value='リザルト履歴ページをリセット'></label>


		</div>`
		}).show();;
		//ウィンドウを表示する
		this.frame.isOpen = true

		settingData = new SettingData()
		await settingData.load()
		settingData.buildSettingMenu()

		this.addFrameEvents();
		const settingEvents = new SettingEvents()
	}




	addFrameEvents(){
		this.frame.on('minimizeButton', 'click', (_frame, evt) => {

			this.frame.hideFrameComponent('minimizeButton');
			this.frame.showFrameComponent('deminimizeButton');
	
			const force = true;
	
			_frame.extra.__restore_info = {
				org_left: _frame.getLeft(),
				org_top: _frame.getTop(),
				org_width: _frame.getWidth(),
				org_height: _frame.getHeight()
			};
	
			_frame.setSize(_frame.getWidth(), 30, force);
			_frame.setResizable(false);
	
	
		});
		this.frame.on('deminimizeButton', 'click', (_frame, evt) => {
	
			_frame.showFrameComponent('minimizeButton');
			_frame.hideFrameComponent('deminimizeButton');
	
			const force = true;
			_frame.setSize(_frame.extra.__restore_info.org_width, _frame.extra.__restore_info.org_height, force);
	
		});
		this.frame.on('maximizeButton', 'click', (_frame, evt) => {
	
			_frame.extra.__restore_info = {
				org_left: _frame.getLeft(),
				org_top: _frame.getTop(),
				org_width: _frame.getWidth(),
				org_height: _frame.getHeight()
			};
	
			this.frame.hideFrameComponent('maximizeButton');
			this.frame.showFrameComponent('restoreButton');
	
			this.frame.setPosition(0, 0);
			this.frame.setSize(window.innerWidth - 2, window.innerHeight - 2, true);
	
			this.frame.setMovable(false);
			this.frame.setResizable(false);
	
	
		});
		this.frame.on('restoreButton', 'click', (_frame, evt) => {
	
			this.frame.setMovable(true);
			this.frame.setResizable(true);
	
			_frame.setPosition(_frame.extra.__restore_info.org_left, _frame.extra.__restore_info.org_top);
	
			const force = true;
			_frame.setSize(_frame.extra.__restore_info.org_width, _frame.extra.__restore_info.org_height, force);
	
			_frame.showFrameComponent('maximizeButton');
			_frame.hideFrameComponent('restoreButton');
	
	
		});
		this.frame.on('closeButton', 'click', (_frame, evt) => {
			_frame.closeFrame();
			this.frame.isOpen = false
		});
	}
}

SettingMenu.BtnEvent()
let settingMenu

class Apply{
	static inputBlurRange(value){
		document.getElementById("word-area").style.background = `rgba(0, 0, 0, ${value})`

		const RANGE_LABEL = document.getElementById("blur-range-label")

		if(RANGE_LABEL){
			document.getElementById("blur-range-label").textContent = Number(value).toFixed(2)
		}
	}

	static displayTimer(value){

		if(value){
			document.getElementsByClassName("time")[0].classList.remove('d-none')
		}else{
			document.getElementsByClassName("time")[0].classList.add('d-none')
		}

	}

	static changeInputHeight(value){
		const HEIGHT = value
		const BOTTOM_MENU = document.getElementById("bottom-menu")

		document.getElementById("lyrics-input").style.height = HEIGHT+'px'
		document.getElementById("lyrics-input").style.fontSize = String(HEIGHT-11)+'px'

		const INPUT_HEIGHT = document.getElementById("user-input").clientHeight
		BOTTOM_MENU.style.bottom = String(INPUT_HEIGHT + 10) + 'px'

		adjustWordArea()
		adjustMedia()
	}


	static inputFontWeight(value){

		if(value){
			document.getElementById("lyrics-input").classList.add('fw-bold')
		}else{
			document.getElementById("lyrics-input").classList.remove('fw-bold')
		}

	}


	static displayNextLyrics(value){

		if(document.getElementById("next-label") != null){

			if(value){
					document.getElementById("next-label").classList.remove('d-none')
					document.getElementById("next").classList.remove('d-none')
			}else{
					document.getElementById("next-label").classList.add('d-none')
					document.getElementById("next").classList.add('d-none')
			}

		}

	}


	static displayDiscordRpc(value){

		if(value){
			alert('Discord RPCが有効になりました。本ソフトの次回起動時に表示されます。')
		}else{

			if (location.host == 'localhost:8080') {
				Discord.closeRPC()
			}

		}

	}

	static wordAreaAutoAdjustHeight(value){
		
		//IndexedDBにデータが無い場合は初期化
		if(!settingData.wordAreaAutoAdjustHeight){
			settingData.wordAreaAutoAdjustHeight = {}
		}

		if(value){
			settingData.wordAreaAutoAdjustHeight.data = true
		}else{
			settingData.wordAreaAutoAdjustHeight.data = false
		}
	}



}


class SettingEvents{

	constructor(){
		this.addEvents()
	}

	addEvents(){
		document.getElementById("word-area-blur-range").addEventListener('input', this.inputBlurRange.bind(this))
		document.getElementById("display-timer").addEventListener('input', this.displayTimer.bind(this))
		document.getElementById("lyrics-input-font-size").addEventListener('change', this.changeInputHeight.bind(this))
		document.getElementById("input-font-weight").addEventListener('change', this.inputFontWeight.bind(this))
		document.getElementById("display-next-lyrics").addEventListener('change', this.displayNextLyrics.bind(this))
		document.getElementById("delete-result-history").addEventListener('click', this.deleteResultData.bind(this))
		document.getElementById("display-discord-rpc").addEventListener('change', this.displayDiscordRpc.bind(this))
		document.getElementById("word-area-auto-adjust-height").addEventListener('change', this.wordAreaAutoAdjustHeight.bind(this))
	}

	inputBlurRange(event){
		Apply.inputBlurRange(event.target.value)
		this.putIndexedDB(event.target.id, event.target.value)
	}

	displayTimer(event){
		Apply.displayTimer(event.target.checked)
		this.putIndexedDB(event.target.id, event.target.checked)
	}

	changeInputHeight(event){
		Apply.changeInputHeight(event.target.value)
		this.putIndexedDB(event.target.id, event.target.value)
	}

	inputFontWeight(event){
		Apply.inputFontWeight(event.target.checked)
		this.putIndexedDB(event.target.id, event.target.checked)
	}

	displayNextLyrics(event){
		Apply.displayNextLyrics(event.target.checked)
		this.putIndexedDB(event.target.id, event.target.checked)
	}

	deleteResultData(){
		const LIVE_ID = document.getElementById("live-id").value

		if(!LIVE_ID || !confirm(`配信ID ${LIVE_ID} のリザルト履歴をリセットしますか？`)){return;}
		const colRef = firestore.collection(LIVE_ID);
		DeleteCollection.deleteCollection(firestore, colRef, 500);
		firestore.collection("timeStamp").doc(LIVE_ID).delete()
		alert('リザルト履歴をリセットしました。')
	}

	displayDiscordRpc(event){
		Apply.displayDiscordRpc(event.target.checked)
		this.putIndexedDB(event.target.id, event.target.checked)
	}

	wordAreaAutoAdjustHeight(event){
		Apply.wordAreaAutoAdjustHeight(event.target.checked)
		this.putIndexedDB(event.target.id, event.target.checked)
	}

	putIndexedDB(id, value){
		db.notes.put({id: event.target.id, data:value});
	}
}


class SettingData {

	constructor(){

	}

	async load(){
		this.blurRange = await db.notes.get('word-area-blur-range');
		this.displayTimer = await db.notes.get('display-timer');
		this.inputFontHeight = await db.notes.get('lyrics-input-font-size');
		this.inputFontWeight = await db.notes.get('input-font-weight');
		this.displayNextLyrics = await db.notes.get('display-next-lyrics');
		this.displayDiscordRpc = await db.notes.get('display-discord-rpc');
		this.wordAreaAutoAdjustHeight = await db.notes.get('word-area-auto-adjust-height');
	}


	allApply(){
		if(this.blurRange){
			Apply.inputBlurRange(this.blurRange.data)
		}

		if(this.displayTimer){
			Apply.displayTimer(this.displayTimer.data)
		}

		if(this.inputFontHeight){
			Apply.changeInputHeight(this.inputFontHeight.data)
		}


		if(this.inputFontWeight){
			Apply.inputFontWeight(this.inputFontWeight.data)
		}

		if(this.wordAreaAutoAdjustHeight){
			Apply.wordAreaAutoAdjustHeight(this.wordAreaAutoAdjustHeight.data)
		}
	}


	buildSettingMenu(){

		if(this.blurRange){
			document.getElementById("word-area-blur-range").value = this.blurRange.data
			document.getElementById("blur-range-label").textContent = Number(this.blurRange.data).toFixed(2)
		}

		if(this.displayTimer){
			document.getElementById("display-timer").checked = this.displayTimer.data
		}

		if(this.inputFontHeight){
			document.getElementById("lyrics-input-font-size").value = this.inputFontHeight.data
		}

		if(this.inputFontWeight){
			document.getElementById("input-font-weight").checked = this.inputFontWeight.data
		}

		if(this.displayNextLyrics){
			document.getElementById("display-next-lyrics").checked = this.displayNextLyrics.data
		}

		if(this.displayDiscordRpc){
			document.getElementById("display-discord-rpc").checked = this.displayDiscordRpc.data
		}

		if(this.wordAreaAutoAdjustHeight){
			document.getElementById("word-area-auto-adjust-height").checked = this.wordAreaAutoAdjustHeight.data
		}

	}

}

let settingData


(async () => {
	settingData = new SettingData()
	await settingData.load()
	settingData.allApply()
})()