class DetailResultMenu {
	constructor(){
		this.display()
	}

	display(){
		const jsFrame = new JSFrame();

		this.frame = jsFrame.create({
			title: '採点結果(Escキーで閉じる・Fキーで全画面表示)',
			left: 100, top: 20, width: 1100, height: 700,
			movable: true,//マウスで移動可能
			resizable: true,//マウスでリサイズ可能
			appearanceName: 'redstone',//プリセット名は 'yosemite','redstone','popup'
			html: `<div id="result-table-container"><div id='name-box'>
			<div id="rank-table"></div>
		</div>
		<div id='detail-box'>
			<div id="detail-result-table"></div>
		</div></div>`
		}).show();;
		//ウィンドウを表示する
		this.frame.isOpen = true

		this.addFrameEvents();
	}

	frameMaximize(_frame, evt){
	
		this.frame.extra.__restore_info = {
			org_left: this.frame.getLeft(),
			org_top: this.frame.getTop(),
			org_width: this.frame.getWidth(),
			org_height: this.frame.getHeight()
		};

		this.frame.isMaximize = true
		this.frame.hideFrameComponent('maximizeButton');
		this.frame.showFrameComponent('restoreButton');

		this.frame.setPosition(0, 0);
		this.frame.setSize(window.innerWidth - 2, window.innerHeight - 2, true);

		this.frame.setMovable(false);
		this.frame.setResizable(false);
	}

	frameRestore(_frame, evt){
	
		this.frame.setMovable(true);
		this.frame.setResizable(true);

		this.frame.setPosition(this.frame.extra.__restore_info.org_left, this.frame.extra.__restore_info.org_top);

		const force = true;
		this.frame.setSize(this.frame.extra.__restore_info.org_width, this.frame.extra.__restore_info.org_height, force);

		this.frame.isMaximize = false
		this.frame.showFrameComponent('maximizeButton');
		this.frame.hideFrameComponent('restoreButton');
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
		this.frame.on('maximizeButton', 'click', this.frameMaximize.bind(this));

		this.frame.on('restoreButton', 'click', this.frameRestore.bind(this));

		this.frame.on('closeButton', 'click', (_frame, evt) => {
			_frame.closeFrame();
			window.removeEventListener('keydown', this.keyDownCloseEvent.bind(this))
			this.frame.isOpen = false
		});

		window.addEventListener('keydown', this.keyDownCloseEvent.bind(this))


		$("#name-box").resizable({handles:'e'});
	}

	keyDownCloseEvent(event){

		if(event.code == "Escape" && this.frame.isOpen){
			this.frame.closeFrame();
			window.removeEventListener('keydown', this.keyDownCloseEvent.bind(this))
			this.frame.isOpen = false
		}else if(event.code == "KeyF"){
			
			if(this.frame.isMaximize){
				this.frameRestore()
			}else{
				this.frameMaximize()
			}
		}

	}
}

let detailResultMenu


class DetailResult extends Scoring {

	constructor(index){
		super(index)

		this.displayRankTable()
	}

	//this.scoreData  ['名前', 'スコア', 'ID']
	generateRankTable(){
		let rankData = []

		for(let i=0;i<this.usersScore.length;i++){
			const SCORE = Math.round((1000 / this.totalNotes) * this.usersScore[i]['typeCount'])

			rankData.push({'順位':this.usersScore[i]['displayRank'], '点数':(isNaN(SCORE) ? 0:SCORE) , '名前':this.usersScore[i]['name'], '打数':`${Math.round(this.usersScore[i]['typeCount'])} / ${this.totalNotes}`, 'number':this.usersScore[i]['number']})
		}

		return rankData
	}

	displayRankTable(){
			let table = new Tabulator("#rank-table", {
				data: this.generateRankTable(),          
				autoColumns: true, //自動で列の設定を最適化する
				selectable : true,
				selectable:1,
				selectableRollingSelection : true ,
				rowClick:function(e, row){
					const DATA = row._row.data['number']
					detailResult.displayDetailResult(DATA)
				},
			});
			table.selectRow(table.getRows()[0])
			this.displayDetailResult(0)

	}

	
	generateDetailResult(number){
		const userID = this.usersScore[number]['userID']
		const USER_RESULT = this.usersResult[userID].mapValue.fields
		const result = this.parseResultObject(Object.values(USER_RESULT.result.mapValue.fields))
		const resultData = []
		let NoneComment = ''

		 for(let i=0;i<result.length;i++){

			if(i > this.correctLyrics.length){break;}

			if(result[i][1] == 'None' && result[i][2] == null){
				NoneComment += result.slice(i,i+1)[0][0]
				result.splice(i,1);
				i--
				continue;
			}

			if(!result[i] && NoneComment){

				result.push([NoneComment,'None', result.length, ''])

			}else if(result[i][2] !== i){

				if(!NoneComment){
					result.splice(i, 0,['','Skip',i,this.correctLyrics[i]])
				}else{
					result.splice(i, 0,[NoneComment,'None',i,this.correctLyrics[i]])
					NoneComment = ''
				}

			}else if(result[i][1] == 'Great' || result[i][1] == 'Good'){
				NoneComment = ''
			}

		}

		if(result.length < this.correctLyrics.length){

			for(let i=result.length;i<this.correctLyrics.length;i++){
				result.push(['','',i,this.correctLyrics[i]])
			}

		}

		 for(let i=0;i<result.length;i++){
			const JUDGE = result[i][1]
			const COMMENT = result[i][0]
			const LYRICS = result[i][3] ? result[i][3] : ""

			if(!COMMENT && !LYRICS){continue;}
			resultData.push({'no':(i+1), 'judge':JUDGE, 'comment':COMMENT.replace(/ /g, 'ˍ'), 'lyrics':LYRICS.replace(/ /g, 'ˍ')})
		}


		 return resultData;
	}


	displayDetailResult(number){
		
		let table = new Tabulator("#detail-result-table", {
			columns:[
				{title:"No",field:"no"},
				{title:"判定",field:"judge"},
				{title:"コメント",field:"comment"},
				{title:"歌詞",field:"lyrics"}
			],
			data:this.generateDetailResult(number)
		});
	}

}

let detailResult