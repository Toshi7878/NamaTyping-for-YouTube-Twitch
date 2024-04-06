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
			left: 60, top: 60, width: 615, height: 420	,
			movable: true,//マウスで移動可能
			resizable: true,//マウスでリサイズ可能
			appearanceName: 'redstone',//プリセット名は 'yosemite','redstone','popup'
			html:
			`<div id="option-container" class="ms-2 fs-6 lh-lg font-monospace">
				<label>名前(コメントエミュレート時)<input value="名無し" id="emulate_name"></label>
				<label>歌詞・ランキング背景の不透明度:<input id='word-area-blur-range' type="range" class="menu-range mx-2" max="1" step="0.01" value="0.6"><span id='blur-range-label'>0.60</span></label>
				<label><input id="display-timer" type="checkbox" class="me-2" checked>再生時間を、歌詞表示領域にも表示する</label>
				<label><input id="display-next-lyrics" type="checkbox" class="me-2" checked>3秒前に次の歌詞を表示</label>
				<label><input id="word-area-auto-adjust-height" type="checkbox" class="me-2" checked>歌詞エリアの高さ自動調整</label>
				<div>
					<h4>一人プレイ用 ツールバー設定</h4>
    				<div>
						<label>フォントサイズ:<input type="number" id="lyrics-input-font-zoom" class="ms-2" value="200">%</label>
						<label class="ms-2"><input id="input-font-weight" type="checkbox" class="me-2">太く表示</label>
					</div>
					<div>
						<label>文字間隔:<input type="number" min="0" step="0.1" max="2" id="lyrics-input-font-spacing" class="ms-2" value="0">px</label>
						<label class="ms-2"><input id="input-use-textarea" type="checkbox" class="me-2">テキストエリアを使用</label>
					</div>
				</div>
				<div class="mt-2 d-flex justify-content-between">
					<label><input type="button" class="" id="delete-result-history" value="リザルト履歴ページをリセット"></label>
					<label class="me-2"><input type="button" class="btn btn-primary" id="save-window-size" value="現在のウィンドウサイズを保存"></label>
				</div>


		</div>`
		}).show();;
		//ウィンドウを表示する
		this.frame.isOpen = true

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
			window.removeEventListener('keydown', this.keyDownCloseEvent.bind(this))
			this.frame.isOpen = false
		});

		window.addEventListener('keydown', this.keyDownCloseEvent.bind(this))
	}

	keyDownCloseEvent(event){

		if(event.code == "Escape" && this.frame.isOpen){
			this.frame.closeFrame();
			window.removeEventListener('keydown', this.keyDownCloseEvent.bind(this))
			this.frame.isOpen = false
		}

	}
}

SettingMenu.BtnEvent()
let settingMenu

class Apply{

	static inputEmulateName(value){

		if(value){
			settingData.emulateName.data = value
		}
	}

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

	static changeInputHeight(){
		const BOTTOM_MENU = document.getElementById("bottom-menu")

		Apply.updateUserInputStyle()

		const INPUT_HEIGHT = document.getElementById("user-input").offsetHeight
		BOTTOM_MENU.style.bottom = String(INPUT_HEIGHT) + 'px'

		adjustWordArea()
		adjustMedia()
	}

	static changeInputFontSpacing(value){
		Apply.updateUserInputStyle()
	}

	static inputFontWeight(value){

		Apply.updateUserInputStyle()

	}

	static inputUseTextArea(value){

		if(value){
			document.getElementById("lyrics-input").classList.remove('active-input')
			document.getElementById("lyrics-textarea").classList.add('active-input')

		}else{
			document.getElementById("lyrics-textarea").classList.remove('active-input')
			document.getElementById("lyrics-input").classList.add('active-input')
		}

		Apply.changeInputHeight()

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

	static updateUserInputStyle(){
		const zoom = settingData.inputFontHeight.data
		const letterSpacing = settingData.inputFontSpacing.data
		const fontWeight = settingData.inputFontWeight.data ? "bold":"normal"

		document.getElementById("user-input-style").textContent = `
		.active-input {
			zoom: ${zoom}%;
			letter-spacing: ${letterSpacing}px;
			font-weight: ${fontWeight};
		}
		`
	}

}


class SettingEvents{

	constructor(){
		this.addEvents()
	}

	addEvents(){
		document.getElementById("emulate_name").addEventListener('input', this.inputEmulateName.bind(this))
		document.getElementById("word-area-blur-range").addEventListener('input', this.inputBlurRange.bind(this))
		document.getElementById("display-timer").addEventListener('input', this.displayTimer.bind(this))
		document.getElementById("lyrics-input-font-zoom").addEventListener('change', this.changeInputHeight.bind(this))
		document.getElementById("lyrics-input-font-spacing").addEventListener('change', this.changeInputFontSpacing.bind(this))
		document.getElementById("input-font-weight").addEventListener('change', this.inputFontWeight.bind(this))
		document.getElementById("input-use-textarea").addEventListener('change', this.inputUseTextArea.bind(this))
		document.getElementById("display-next-lyrics").addEventListener('change', this.displayNextLyrics.bind(this))
		document.getElementById("delete-result-history").addEventListener('click', this.deleteResultData.bind(this))
		document.getElementById("save-window-size").addEventListener('click', this.saveWindowSize.bind(this))
		document.getElementById("word-area-auto-adjust-height").addEventListener('change', this.wordAreaAutoAdjustHeight.bind(this))
	}

	inputEmulateName(event){
		settingData.emulateName.data = event.target.value
		Apply.inputEmulateName(event.target.value, event)
		this.putIndexedDB(event.target.id, event.target.value)
	}

	inputBlurRange(event){
		settingData.blurRange.data = event.target.value
		Apply.inputBlurRange(event.target.value)
		this.putIndexedDB(event.target.id, event.target.value)
	}

	displayTimer(event){
		settingData.displayTimer.data = event.target.checked
		Apply.displayTimer(event.target.checked)
		this.putIndexedDB(event.target.id, event.target.checked)
	}

	changeInputHeight(event){
		settingData.inputFontHeight.data = event.target.value
		Apply.changeInputHeight(event.target.value)
		this.putIndexedDB(event.target.id, event.target.value)
	}

	changeInputFontSpacing(event){
		settingData.inputFontSpacing.data = event.target.value
		Apply.changeInputFontSpacing(event.target.value)
		this.putIndexedDB(event.target.id, event.target.value)
	}

	inputFontWeight(event){
		settingData.inputFontWeight.data = event.target.checked
		Apply.inputFontWeight(event.target.checked)
		this.putIndexedDB(event.target.id, event.target.checked)
	}

	inputUseTextArea(event){
		settingData.inputUseTextArea.data = event.target.checked
		Apply.inputUseTextArea(event.target.checked)
		this.putIndexedDB(event.target.id, event.target.checked)
	}

	displayNextLyrics(event){
		settingData.displayNextLyrics.data = event.target.checked
		Apply.displayNextLyrics(event.target.checked)
		this.putIndexedDB(event.target.id, event.target.checked)
	}

	deleteResultData(){
		const LIVE_ID = extractYouTubeVideoId(document.getElementById("live-id").value)

		if(!LIVE_ID || !confirm(`配信ID ${LIVE_ID} のリザルト履歴をリセットしますか？`)){return;}
		const colRef = firestore.collection(LIVE_ID);
		DeleteCollection.deleteCollection(firestore, colRef, 500);
		firestore.collection("timeStamp").doc(LIVE_ID).delete()
		showToast(`<div style="color:white;font-weight;bold;">リザルト履歴をリセットしました。</div>`,'#198754b8')
	}

	async saveWindowSize(){
		let result = await eel.saveWindowSize(window.outerWidth,window.outerHeight)();
		showToast(`<div style="color:white;font-weight;bold;">ウィンドウサイズを保存しました。</div>
		<div style="color:white;font-weight;bold;">Width${window.outerWidth}px × Height${window.outerHeight}px</div>`,
		'#198754b8',500)
		return result;
	}

	wordAreaAutoAdjustHeight(event){
		Apply.wordAreaAutoAdjustHeight(event.target.checked)
		settingData.wordAreaAutoAdjustHeight.data = event.target.checked
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
		this.emulateName = await db.notes.get('emulate_name') || {id:'emulate_name', data:'名無し'};
		this.blurRange = await db.notes.get('word-area-blur-range') || {id:'display-timer', data:0.6};
		this.displayTimer = await db.notes.get('display-timer') || {id:'display-timer', data:true};
		this.inputFontHeight = await db.notes.get('lyrics-input-font-zoom') || {id:'lyrics-input-font-zoom', data:200};
		this.inputFontSpacing = await db.notes.get('lyrics-input-font-spacing') || {id:'lyrics-input-font-spacing', data:0};
		this.inputFontWeight = await db.notes.get('input-font-weight') || {id:'input-font-weight', data:false};
		this.inputUseTextArea = await db.notes.get('input-use-textarea') || {id:'input-use-textarea', data:false};
		this.displayNextLyrics = await db.notes.get('display-next-lyrics') || {id:'display-next-lyrics', data:true};
		this.wordAreaAutoAdjustHeight = await db.notes.get('word-area-auto-adjust-height') || {id:'word-area-auto-adjust-height', data:true};
	}


	allApply(){
		if(this.emulateName){
			Apply.inputEmulateName(this.emulateName.data)
		}

		if(this.blurRange){
			Apply.inputBlurRange(this.blurRange.data)
		}

		if(this.displayTimer){
			Apply.displayTimer(this.displayTimer.data)
		}

		if(this.inputFontHeight){
			Apply.changeInputHeight(this.inputFontHeight.data)
		}

		if(this.inputFontSpacing){
			Apply.changeInputFontSpacing(this.inputFontSpacing.data)
		}

		if(this.inputFontWeight){
			Apply.inputFontWeight(this.inputFontWeight.data)
		}

		if(this.inputUseTextArea){
			Apply.inputUseTextArea(this.inputUseTextArea.data)
		}

		if(this.wordAreaAutoAdjustHeight){
			Apply.wordAreaAutoAdjustHeight(this.wordAreaAutoAdjustHeight.data)
		}
	}


	buildSettingMenu(){

		if(this.emulateName){
			document.getElementById("emulate_name").value = this.emulateName.data
		}

		if(this.blurRange){
			document.getElementById("word-area-blur-range").value = this.blurRange.data
			document.getElementById("blur-range-label").textContent = Number(this.blurRange.data).toFixed(2)
		}

		if(this.displayTimer){
			document.getElementById("display-timer").checked = this.displayTimer.data
		}

		if(this.inputFontHeight){
			document.getElementById("lyrics-input-font-zoom").value = this.inputFontHeight.data
		}

		if(this.inputFontSpacing){
			document.getElementById("lyrics-input-font-spacing").value = this.inputFontSpacing.data
		}

		if(this.inputFontWeight){
			document.getElementById("input-font-weight").checked = this.inputFontWeight.data
		}

		if(this.inputUseTextArea){
			document.getElementById("input-use-textarea").checked = this.inputUseTextArea.data
		}

		if(this.displayNextLyrics){
			document.getElementById("display-next-lyrics").checked = this.displayNextLyrics.data
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