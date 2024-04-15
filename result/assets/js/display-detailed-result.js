class DetailResultMenu {
	constructor(){
		this.display()
	}

	display(){
		const jsFrame = new JSFrame();

		this.frame = jsFrame.create({
			title: '採点結果(Escキーで閉じる)',
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


		$("#name-box").resizable({handles:'e'});
	}

	keyDownCloseEvent(event){

		if(event.code == "Escape" && this.frame.isOpen){
			this.frame.closeFrame();
			window.removeEventListener('keydown', this.keyDownCloseEvent.bind(this))
			this.frame.isOpen = false
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
			const SCORE = Math.round((1000 / this.totalNotes) * this.usersScore[i][1])


			rankData.push({'順位':(i+1), '点数':(isNaN(SCORE) ? 0:SCORE) , '名前':this.usersScore[i][0], '打数':`${Math.round(this.usersScore[i][1])} / ${this.totalNotes}`})
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
					const DATA = row._row.data['順位']
					detailResult.displayDetailResult(DATA)
				},
			});
			table.selectRow(table.getRows()[0])
			this.displayDetailResult(1)

	}

	
	generateDetailResult(rank){
		const userID = this.usersScore[rank-1][2]
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
			resultData.push({'no':(i+1), 'judge':result[i][1], 'comment':result[i][0].replace(/ /g, 'ˍ'), 'lyrics':result[i][3].replace(/ /g, 'ˍ')})
		}


		 return resultData;
	}


	displayDetailResult(rank){
		
		let table = new Tabulator("#detail-result-table", {
			columns:[
				{title:"No",field:"no"},
				{title:"判定",field:"judge"},
				{title:"コメント",field:"comment"},
				{title:"歌詞",field:"lyrics"}
			],
			data:this.generateDetailResult(rank)
		});
	}

}

let detailResult