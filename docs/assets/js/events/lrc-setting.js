const ElementsID = [
	{'lrc-regex-switch':true},
	{'lrc-regex':""},
	{'lrc-eng-space': false},
	{'lrc-eng-case-sensitive': false}
]

class LrcSettingMenu {
	constructor(){
		this.display()
	}

	static BtnEvent(){

		document.getElementById("typing-option").addEventListener('click', event => {
			const isOpened = lrcSettingMenu && lrcSettingMenu.frame.isOpen ? true : false

			if(!isOpened){
				lrcSettingMenu = new LrcSettingMenu()
			}else{
				lrcSettingMenu.frame.requestFocus()
			}
		})

	}

	async display(){

		const LRC_REGEX_SWITCH = lrcSettingData["lrc-regex-switch"].data
		const LRC_REGEX = lrcSettingData["lrc-regex"].data.replace(/\"/g,'&quot;')
		const ENG_SPACE = lrcSettingData["lrc-eng-space"].data
		const CASE_SENSITIVE = lrcSettingData["lrc-eng-case-sensitive"].data

		const jsFrame = new JSFrame();
		this.frame = jsFrame.create({
			title: 'lrc設定(Escキーで閉じる)',
			left: 80, top: 80, width: 615, height: 310,
			movable: true,//マウスで移動可能
			resizable: true,//マウスでリサイズ可能
			appearanceName: 'redstone',//プリセット名は 'yosemite','redstone','popup'
			html:
			`<form id="typing-option-container" class="ms-2 fs-6 lh-lg font-monospace">
				<label>
					<input type="checkbox" id="lrc-regex-switch" ${LRC_REGEX_SWITCH ? 'checked':''}>
					文字判定のホワイトリストを有効
				</label>

				<div class="ms-3 w-100">
					<div>判定を有効にする文字を記述</div>
					<label class="w-90"><input id="lrc-regex" value="${LRC_REGEX}" class="w-90" ${LRC_REGEX_SWITCH ? '':'disabled'}></label>
					<div class="fw-normal"><small>例:！マークを判定に追加したい場合は「！!」を上記に記述。<br>(全角！マークは半角に変換されますが、念の為。)</small></div>
				</div>

				<div class="d-flex">
				<label class="m-2">
					<input type="checkbox" id="lrc-eng-space" ${ENG_SPACE ? 'checked':''}>
					英語スペースを有効
				</label>
				<label class="m-2">
					<input type="checkbox" id="lrc-eng-case-sensitive" ${CASE_SENSITIVE ? 'checked':''}>
					英語大文字判定を有効
				</label>		
				</div>
				<div id="update-plate" class="invisible fw-bold">変更はlrcファイルロード後に適用されます。</div>
			</form>`
		}).show();;
		//ウィンドウを表示する
		this.frame.isOpen = true

		this.addFrameEvents();
		document.getElementById("typing-option-container").addEventListener("change", lrcSettingData.change.bind(lrcSettingData))
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

LrcSettingMenu.BtnEvent()
let lrcSettingMenu


class LrcSettingData {

	async load(){

		for(let i=0;i<ElementsID.length;i++){
			const ID = Object.keys(ElementsID[i])[0]
			const IS_CHECKBOX = typeof ElementsID[i][ID]
			if (location.host == 'localhost:8080') {

				if(IS_CHECKBOX == 'boolean'){
					this[ID] = {data:iniData[ID] === 'True' ? true:false};
				}else{
					this[ID] = {data:iniData[ID]};
				}

			}else{
				const DEFAULT_VALUE = ElementsID[i][ID]
				this[ID] = await db.notes.get(ID) || {id:ID, data:DEFAULT_VALUE};
			}


		}

	}


	Apply(){

	}

	checkboxEvent(target){

		if(target.id == 'lrc-regex-switch'){
			
			if(target.checked){
				document.getElementById("lrc-regex").removeAttribute("disabled")
			}else{
				document.getElementById("lrc-regex").setAttribute("disabled","")
			}

		}
	}

	async change(event){

		if(event.target.type == "checkbox"){

			if (location.host == 'localhost:8080') {
				await eel.saveSetting(event.target.id, event.target.checked)();
			}
		
			db.notes.put({id: event.target.id, data:event.target.checked});
			this[event.target.id].data = event.target.checked
			this.checkboxEvent(event.target)
		}else{

			if (location.host == 'localhost:8080') {
				await eel.saveSetting(event.target.id, event.target.value)();
			}

			db.notes.put({id: event.target.id, data:event.target.value});
			this[event.target.id].data = event.target.value
		}

		document.getElementById("update-plate").classList.remove("invisible")
	}

}

let lrcSettingData


(async () => {
	lrcSettingData = new LrcSettingData()
	if (location.host != 'localhost:8080') {
		await lrcSettingData.load()
	}
})()