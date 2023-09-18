
class EditMenu {
	constructor(){
		this.menu()
	}

	static editBtnEvent(){


		document.getElementById("create-button").addEventListener('click', event => {
			const isOpened = editMenu && editMenu.frame.isOpen ? true : false

			if(!isOpened){
				editMenu = new EditMenu()
				editor = new NewCreate()
			}else{
				editMenu.frame.requestFocus()
			}
			
		})

		document.getElementById("edit-button").addEventListener('click', event => {
			editor = new JsonEditor()
		})

	}

	menu(){
		const jsFrame = new JSFrame();

		this.frame = jsFrame.create({
			title: 'lrc新規作成ウィンドウ',
			left: 60, top: 60, width: 900, height: 470,
			movable: true,//マウスで移動可能
			resizable: true,//マウスでリサイズ可能
			appearanceName: 'redstone',//プリセット名は 'yosemite','redstone','popup'
			html: `<div id="edit-container" class="container mt-4">
			<div class="row">
				<div class="col-md-3">
					<label for="edit-url">URL</label>
					<input id="edit-url" class="form-control" type="text">
				</div>
				<div class="col-md-3">
					<label for="edit-id" value="">ID</label>
					<input id="edit-id" class="form-control" type="text" value="1445182399">
				</div>
				<div class="col-md-3">
					<label for="edit-title">タイトル</label>
					<input id="edit-title" value="プラネテス (cover)" class="form-control" type="text">
				</div>
				<div class="col-md-3">
					<label for="edit-artist">アーティスト</label>
					<input id="edit-artist" value="gang bab" class="form-control" type="text">
				</div>
			</div>
		
			<div class="row mt-3">
				<div class="col-md-6">
					<input type="button" id="get-create-param-btn" class="btn btn-primary" value="URLを入力してデータ取得">
				</div>
				<div class="col-md-6">
					<input type="button" id="create-start-btn" class="btn btn-secondary" value="作成開始">
				</div>
			</div>
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
	
	}
}

EditMenu.editBtnEvent()
let editMenu
