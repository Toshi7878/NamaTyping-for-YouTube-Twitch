document.getElementById("lyrics-result").addEventListener('click', event => {
	const jsFrame = new JSFrame();
	const frame = jsFrame.create({
		title: '採点結果',
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
	});
	//ウィンドウを表示する
	frame.show();

	frame.on('minimizeButton', 'click', (_frame, evt) => {

		frame.hideFrameComponent('minimizeButton');
		frame.showFrameComponent('deminimizeButton');

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
	frame.on('deminimizeButton', 'click', (_frame, evt) => {

		_frame.showFrameComponent('minimizeButton');
		_frame.hideFrameComponent('deminimizeButton');

		const force = true;
		_frame.setSize(_frame.extra.__restore_info.org_width, _frame.extra.__restore_info.org_height, force);

	});

	frame.on('maximizeButton', 'click', (_frame, evt) => {

		_frame.extra.__restore_info = {
			org_left: _frame.getLeft(),
			org_top: _frame.getTop(),
			org_width: _frame.getWidth(),
			org_height: _frame.getHeight()
		};

		frame.hideFrameComponent('maximizeButton');
		frame.showFrameComponent('restoreButton');

		frame.setPosition(0, 0);
		frame.setSize(window.innerWidth - 2, window.innerHeight - 2, true);

		frame.setMovable(false);
		frame.setResizable(false);


	});

	frame.on('restoreButton', 'click', (_frame, evt) => {

		frame.setMovable(true);
		frame.setResizable(true);

		_frame.setPosition(_frame.extra.__restore_info.org_left, _frame.extra.__restore_info.org_top);

		const force = true;
		_frame.setSize(_frame.extra.__restore_info.org_width, _frame.extra.__restore_info.org_height, force);

		_frame.showFrameComponent('maximizeButton');
		_frame.hideFrameComponent('restoreButton');


	});
	frame.on('closeButton', 'click', (_frame, evt) => {
		_frame.closeFrame();
	});

	$("#name-box").resizable({handles:'n,s,w,e'});
	detailResult = new DetailResult()
})


class DetailResult {

	constructor(){
		this.scoreData = chat && Object.keys(chat.users).length ? scoring.parseResultData() : [{'順位':'', '点数':'', '名前':''}]
		this.totalNotes = scoring ? scoring.calcTotalNotes() : 0
		this.correctLyrics = timer ? timer.updateCorrectLyrics(game.comparisonLyrics.length) : []
		this.displayRankTable()
	}


	//scoring.scoredata  ['名前', 'スコア', 'ID']
	displayRankTable(){

			let rankData = []

			for(let i=0;i<this.scoreData.length;i++){
				rankData.push({'順位':(i+1), '点数':Math.round((1000 / this.totalNotes) * this.scoreData[i][1]), '名前':this.scoreData[i][0], '打数':`${String(this.scoreData[i][1])} / ${this.totalNotes}`})
			}

			let table = new Tabulator("#rank-table", {
				data:rankData,          
				autoColumns: true, //自動で列の設定を最適化する
				selectable : true,
				rowClick:function(e, row){
					const DATA = row._row.data['順位']
					console.log(row._row.data)
					detailResult.displayDetailResult(DATA)
					},
			});
			this.displayDetailResult(1)

	}

	


	displayDetailResult(rank){
		const userID = this.scoreData[rank-1][2]
		const result = userID && chat.users[userID]['result'] ? chat.users[userID]['result'].slice(0, chat.users[userID]['result'].length) : [['','']]
		const resultData = []
		let NoneComment = ''

		 for(let i=0;i<result.length;i++){

			if(i > this.correctLyrics.length){break;}

			if(result[i][1] == 'None' && result[i][2] == null){
				NoneComment += result.slice(i,i+1)[0][0]
				result.splice(i,1);
			}

			if(!result[i] && NoneComment){

				result.push([NoneComment,'None', result.length, ''])

			}else if(result[i][2] != null && result[i][2] !== i){

				if(!NoneComment){
					result.splice(i, 0,['','Skip',i,this.correctLyrics[i]])
				}else{
					result.splice(i, 0,[NoneComment,'None',i,this.correctLyrics[i]])
					NoneComment = ''
				}

			}

		}

		if(result.length < this.correctLyrics.length){

			for(let i=result.length;i<this.correctLyrics.length;i++){
				result.push(['','',i,this.correctLyrics[i]])
			}

		}


		 for(let i=0;i<result.length;i++){
				resultData.push({'No':(i+1), '判定':result[i][1], 'コメント':result[i][0], '歌詞':result[i][3]})
		 }

		
		let table = new Tabulator("#detail-result-table", {
			data:resultData,          
			autoColumns: true, //自動で列の設定を最適化する
		});
	}

}

let detailResult

