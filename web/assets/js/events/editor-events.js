

document.getElementById("lyrics").addEventListener('keydown', event => {


	if(event.key == 'Tab'){
		const SELECT_POSITION = window.getSelection().extentOffset
		const TEXT = window.getSelection().extentNode.textContent

		const count = +window.getSelection().extentNode.parentNode.parentNode.parentNode.dataset.count
		const wipeCount = +window.getSelection().extentNode.parentNode.dataset.wipeCount
		const HEAD_TIME = timer.headTime

		if(SELECT_POSITION == TEXT.length){

			if(game.displayLyrics[count+1] && (wipeCount+1) == game.displayLyrics[count]['time'].length){
				const NEXT_WIPE_START = game.displayLyrics[count+1]['time'][0]

				if(game.displayLyrics[count]['time'][wipeCount] == NEXT_WIPE_START){
					game.displayLyrics[count+1]['time'][0] = HEAD_TIME
				}
			}

			game.displayLyrics[count]['time'][wipeCount] = HEAD_TIME

		}else if(SELECT_POSITION){
			const SPLICE_TEXT = lyricsSplit(TEXT, SELECT_POSITION)
			game.displayLyrics[count]['char'].splice(wipeCount, 1,SPLICE_TEXT[0], SPLICE_TEXT[1])
			game.displayLyrics[count]['time'].splice(wipeCount, 0, HEAD_TIME)
		}else{
			if(game.displayLyrics[count-1] && wipeCount == 1){
				const PREVIOUS_WIPE_TIME = game.displayLyrics[count-1]['time']
				const PREVIOUS_WIPE_END = PREVIOUS_WIPE_TIME[PREVIOUS_WIPE_TIME.length-1]


				if(game.displayLyrics[count]['time'][wipeCount-1] == PREVIOUS_WIPE_END){
					game.displayLyrics[count-1]['time'][game.displayLyrics[count-1]['time'].length-1] = HEAD_TIME
				}
			}

			game.displayLyrics[count]['time'][wipeCount-1] = HEAD_TIME
		}


		new Lyrics(game.displayLyrics, 'EditMode')
	
		if(timer){
			timer.updateLyrics(timer.count-1)
		}

		event.preventDefault()
	}

	
	if(event.code == 'Enter'){
		const count = +window.getSelection().extentNode.parentNode.parentNode.parentNode.dataset.count
		const wipeCount = +window.getSelection().extentNode.parentNode.dataset.wipeCount
		game.displayLyrics[count]['char'][wipeCount] = event.target.textContent


		new Lyrics(game.displayLyrics, 'EditMode')
	
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


document.getElementById("add-lyrics-box").addEventListener('input', event => {

	event.target.value = event.target.value.replace(/\n\n/g, "\n").replace(/\s+\n$/g, "\n").replace(/^\s+/g, "")
	setTimeout(() => event.target.scrollTop = 0)

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


document.getElementById("download").addEventListener('click', event => {
const data = {
	"movieURL": editor.setData['movieURL'],
    "platform": editor.setData['platform'],
    "title": editor.setData['title'],
    "artist": editor.setData['artist'],
    "creator": "",
    "tag": [],
	"lrc":convartLRC(game.displayLyrics)
}

const blob = new Blob([JSON.stringify(data, null, '  ')], {type: 'application\/json'});
const url = URL.createObjectURL(blob);

const ELEMENT = event.target.parentNode
ELEMENT.download = `${data['title']}${data['artist'] ? ` - ${data['artist']}` : ''}`
ELEMENT.href = url

})

function convartLRC(displayLyrics){

	let result = ''
	for(let i=0;i<displayLyrics.length;i++){
		result += convartLyricsLine(displayLyrics[i])
	}

	return result;
}

function convartLyricsLine(Line){
	let lineResult = ''

	for(let i=0;i<Line['time'].length;i++){
		const min = Math.floor(Line['time'][i] / 60).toFixed(0)
		const sec = (Line['time'][i] % 60).toFixed(2)
		const TIME_DATA = {
			'min':min.length == 1 ? `0${min}` : min,
			'sec':`0${sec}`.slice(sec.length-4)
		}

		const LRC_TIMETAG = `[${TIME_DATA['min']}:${TIME_DATA['sec']}]`

		lineResult += LRC_TIMETAG + Line['char'][i+1]
	}

	lineResult += '\r\n'
	return lineResult;
}