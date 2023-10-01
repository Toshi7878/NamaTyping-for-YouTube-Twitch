class EditorTutorial {
	constructor(){
		this.display()
	}

	static BtnEvent(){

		document.getElementById("player-tutorial").addEventListener('click', event => {

			const isOpened = editorTutorial && editorTutorial.frame.isOpen ? true : false

			if(!isOpened){
				editorTutorial = new EditorTutorial()
			}else{
				editorTutorial.frame.requestFocus()
			}
		})

	}

	display(){
		const jsFrame = new JSFrame();

		this.frame = jsFrame.create({
			title: 'エディター操作方法',
			left: 60, top: 60, width: 900, height: 470,
			movable: true,//マウスで移動可能
			resizable: true,//マウスでリサイズ可能
			appearanceName: 'redstone',//プリセット名は 'yosemite','redstone','popup'
			html: `<div id="shortcut-tutorial" class="fs-4" style="max-height: 327px;overflow-y: scroll;">
			<table class="table"><thead><tr><th>アクション</th><th>操作</th></tr></thead> <tbody>
			<tr><td>歌詞を追加(スペース・改行区切り)</td><td>テキストボックスに歌詞を挿入後 TAB</td></tr>
			<tr><td>タイムタグのみ追加</td><td>Shift + TAB</td></tr>
			<tr><td>追加済み歌詞にタイムタグ追加</td><td>追加したい位置にカーソルを合わせてTAB</td></tr>
			<tr><td>追加済み歌詞の歌詞変更</td> <td>追加済み歌詞変更後 Enter</td></tr>
			<tr><td>タイムタグの位置から再生</td> <td>Ctrl + 追加済み歌詞をクリック</td></tr>
			</tbody></table></div>`
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
EditorTutorial.BtnEvent()
let editorTutorial