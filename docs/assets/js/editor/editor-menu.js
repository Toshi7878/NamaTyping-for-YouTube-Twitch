class EditorMenu {
	constructor(){
		this.display()
	}

	static BtnEvent(){

		document.getElementById("player-editor-menu").addEventListener('click', event => {

			const isOpened = editorMenu && editorMenu.frame.isOpen ? true : false

			if(!isOpened){
				editorMenu = new EditorMenu()
			}else{
				editorMenu.frame.requestFocus()
			}
		})

	}

	display(){
		const jsFrame = new JSFrame();

		this.frame = jsFrame.create({
			title: 'エディターメニュー',
			left: 60, top: 60, width: 900, height: 470,
			movable: true,//マウスで移動可能
			resizable: true,//マウスでリサイズ可能
			appearanceName: 'redstone',//プリセット名は 'yosemite','redstone','popup'
			html: `<div id="editor-menu-container" class="fs-6 m-3">
			<label class="w-25">全体タイム調整<input type="number" id='adjust-time' step='0.1' class="form-control-sm w-50"></label><input type="button" id='adjust-btn' class="btn btn-success" value="実行">
			</div>`
		}).show();;
		//ウィンドウを表示する
		this.frame.isOpen = true

		this.addFrameEvents();
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

		const editorMenuEvents = new EditorMenuEvents()

	}
}
EditorMenu.BtnEvent()
let editorMenu

class EditorMenuEvents {

	constructor(){
		document.getElementById("adjust-btn").addEventListener('click', this.adjustTime)
	}

	adjustTime(){
		const AJUDST_TIME = document.getElementById("adjust-time").value
		let lyrics = game.displayLyrics

		for(let i=0;i<lyrics.length;i++){
			let times = lyrics[i]['time']

			for(let t=0;t<times.length;t++){
				times[t] += Number(AJUDST_TIME)
			}
			
		}

		new Lyrics(game.displayLyrics, 'EditMode')
		
	}
}

