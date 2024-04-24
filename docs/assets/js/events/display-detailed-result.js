class DetailResultMenu {
	constructor(){
		this.display()
	}

	static BtnEvent(){

		document.getElementById("lyrics-result").addEventListener('click', event => {

			const isOpened = detailResultMenu && detailResultMenu.frame.isOpen ? true : false

			if(!isOpened){
				detailResultMenu = new DetailResultMenu()
				detailResult = new DetailResult()
			}else{
				detailResultMenu.frame.requestFocus()
			}
		})

	}

	display(){
		const jsFrame = new JSFrame();

		this.frame = jsFrame.create({
			title: '採点結果(Escキーで閉じる・Fキーで全画面表示)',
			left: 60, top: 60, width: 900, height: 470,
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

DetailResultMenu.BtnEvent()
let detailResultMenu


class DetailResult extends Scoring {

	constructor(){
		super()
		if(game){
			this.displayRankTable()
		}
	}

	//this.scoreData  ['名前', 'スコア', 'ID']
	generateRankTable(){
		let rankData = []

		for(let i=0;i<this.usersScore.length;i++){
			const SCORE = this.usersScore[i]['score']
			const TOTAL_NOTES = game ? game.totalNotes : 0


			rankData.push({'順位':this.usersScore[i]['displayRank'], '点数':(isNaN(SCORE) ? 0:SCORE) , '名前':this.usersScore[i]['name'], '打数':`${Math.round(this.usersScore[i]['typeCount'])} / ${TOTAL_NOTES}`, 'number':this.usersScore[i]['number']})
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
		const result = chat && chat.users[userID] ? chat.users[userID]['result'].slice(0, chat.users[userID]['result'].length) : [['','']]
		const resultData = []
		let NoneComment = ''

		 for(let i=0;i<result.length;i++){

			if(i > game.scoringLyrics.length){break;}

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
					result.splice(i, 0,['','Skip',i,game.scoringLyrics[i]])
				}else{
					result.splice(i, 0,[NoneComment,'None',i,game.scoringLyrics[i]])
					NoneComment = ''
				}

			}else if(result[i][1] == 'Great' || result[i][1] == 'Good'){
				NoneComment = ''
			}

		}

		if(result.length < game.scoringLyrics.length){

			for(let i=result.length;i<game.scoringLyrics.length;i++){
				result.push(['','',i,game.scoringLyrics[i]])
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