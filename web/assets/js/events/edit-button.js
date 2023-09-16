document.getElementById("create-button").addEventListener('click', event => {
	const jsFrame = new JSFrame();

	const frame = jsFrame.create({
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

	createMenu = new CreateMenu()



})



class CreateMenu {

	constructor(){
		document.getElementById("get-create-param-btn").addEventListener('click', event => {
			const urlParam = document.getElementById("edit-url").value
			this.sendURLtoGetParamData(urlParam).then(this.setParam.bind(this))
			document.getElementById("edit-url").value = ''
			document.getElementById("edit-url").placeholder = 'データ取得中'
		})

		document.getElementById("create-start-btn").addEventListener('click', this.createStart.bind(this))
	}

	async sendURLtoGetParamData(urlParam){
			let result = await eel.sendURLtoGetParamData(urlParam)();
			return result;
	}

	setParam(result){
		this.platform = result['platform']
		document.getElementById("edit-url").placeholder = ''
		document.getElementById("edit-id").value = result['id']
		document.getElementById("edit-title").value = result['title']
		document.getElementById("edit-artist").value = result['artist']
		document.getElementById("create-start-btn").removeAttribute('disabled')
	}

	createStart(event){
			const ID = document.getElementById("edit-id").value
			const TITLE = document.getElementById("edit-title").value
			const ARTIST = document.getElementById("edit-artist").value
			const setData = {'platform':'SoundCloud', 'movieURL':ID, 'title':TITLE, 'artist':ARTIST,'gameLyricsData':[[],[]], 'edit':true}
			game = new Game(setData)
			const bottomMenu = document.getElementById("bottom-menu")
			const bottom = (parseFloat(getComputedStyle(bottomMenu).bottom) + bottomMenu.clientHeight) * 0.8

			const topMenu = document.getElementById("top-menu")
			const top = (parseFloat(getComputedStyle(topMenu).top) + topMenu.clientHeight) * 0.8

			const WORD_AREA = document.getElementById("word-area")
			WORD_AREA.style.top = ``
			WORD_AREA.style.bottom = `${bottom.toString()}px`
			WORD_AREA.style.height = `${(window.innerHeight - (top + bottom)).toString()}px`
			document.getElementById("add-lyrics-container").style.display = 'block'
			document.getElementById("seek-range-container").classList.remove("d-none")
	}

}

let createMenu 

document.getElementById("lyrics").addEventListener('keydown', event => {


	if(event.key == 'Tab'){
		const SELECT_POSITION = window.getSelection().extentOffset
		const count = +window.getSelection().extentNode.parentNode.parentNode.parentNode.dataset.count
		const wipeCount = +window.getSelection().extentNode.parentNode.dataset.wipeCount

		if(SELECT_POSITION){
			const TEXT = window.getSelection().extentNode.textContent
			const SPLICE_TEXT = lyricsSplit(TEXT, SELECT_POSITION)
			game.displayLyrics[count]['char'].splice(wipeCount, 1,SPLICE_TEXT[0], SPLICE_TEXT[1])
			game.displayLyrics[count]['time'].splice(wipeCount, 0, timer.headTime)
		}else{
			game.displayLyrics[count]['time'][wipeCount-1] = timer.headTime
		}


		new Lyrics(game.displayLyrics)
	
		if(timer){
			timer.updateLyrics(timer.count)
		}

		event.preventDefault()
	}

	
	if(event.code == 'Enter'){
		const count = +window.getSelection().extentNode.parentNode.parentNode.parentNode.dataset.count
		const wipeCount = +window.getSelection().extentNode.parentNode.dataset.wipeCount
		game.displayLyrics[count]['char'][wipeCount] = event.target.textContent


		new Lyrics(game.displayLyrics)
	
		if(timer){
			timer.updateLyrics(timer.count)
		}

	}


})

function lyricsSplit(text, position){
	const firstPart = text.slice(0, position);
	const secondPart = text.slice(position);

	return [firstPart, secondPart];
}

function addSpace(text, position){
	const firstPart = text.slice(0, position);
	const secondPart = text.slice(position);

	return `${firstPart} ${secondPart}`;
}

function deleteChar(text, position){
	const firstPart = text.slice(0, position-1);
	const secondPart = text.slice(position);

	return `${firstPart}${secondPart}`;
}

document.getElementById("add-lyrics-box").addEventListener('keydown', event => {


	if(event.key == 'Tab'){

		if(event.shiftKey){

			if(game.displayLyrics.length > 1 && game.displayLyrics[game.displayLyrics.length-1]['time'].length == 0){
				const previousArray = game.displayLyrics[game.displayLyrics.length-2]
	
				if(previousArray){
						previousArray['time'].push(timer.headTime)
						previousArray['char'].push('')
				}
			}

		}else{
			let headLyrics = event.target.value.split(/[\n\s]/)[0]
			let lyrics = event.target.value.split(/\n/)
			const space = event.target.value[headLyrics.length]
	
			if(game.displayLyrics.length > 1 && game.displayLyrics[game.displayLyrics.length-1]['time'].length == 0){
				const previousArray = game.displayLyrics[game.displayLyrics.length-2]
	
				if(previousArray){
						previousArray['time'].push(timer.headTime)
						previousArray['char'].push('')
				}
			}else if(game.displayLyrics.length == 0){
				game.displayLyrics.push({"time": [],"char": [""]})
			}
	
			if(space == '\n'){
				game.displayLyrics[game.displayLyrics.length-1]['time'].push(timer.headTime)
				game.displayLyrics[game.displayLyrics.length-1]['char'].push(headLyrics)
				game.displayLyrics.push({"time": [],"char": [""]})
				lyrics = lyrics.slice(1)
			}else if(event.target.value[headLyrics.length] == ' '){
				headLyrics = headLyrics + ' '
				game.displayLyrics[game.displayLyrics.length-1]['time'].push(timer.headTime)
				game.displayLyrics[game.displayLyrics.length-1]['char'].push(headLyrics)
				lyrics[0] = lyrics[0].slice(headLyrics.length)
			}
	
	
			event.target.value = lyrics.join('\n')
		}

		new Lyrics(game.displayLyrics)
	
		if(timer){
			timer.updateLyrics(timer.count)
		}

		event.preventDefault()
	}

})


document.getElementById("add-lyrics-box").addEventListener('input', event => {

	event.target.value = event.target.value.replace(/\n\n/g, "\n")

})

document.getElementById("seek-range").addEventListener('input', event => {
	MediaControl.seek(event.target.value)
})

document.getElementById("player-pause").addEventListener('click', event => {
	MediaControl.pause()
})

document.getElementById("player-play").addEventListener('click', event => {
	MediaControl.play()
})
