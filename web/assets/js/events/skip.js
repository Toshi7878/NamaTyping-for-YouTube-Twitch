
class Skip {
	static addSkipEvent(){
		document.getElementById("skip").addEventListener('click', event => {

			if(timer && document.getElementById("skip").textContent.includes('SKIP')){
				const SKIP_REMAIN_TIME = (timer.count == 0 ? 8 : 10)
				const NEXT_LYRICS_TIME = game.displayLyrics[timer.count]['time'][0]
				const SKIP_TIME = (NEXT_LYRICS_TIME - 8) + (1 - timer.speed)
		
				MediaControl.seek(SKIP_TIME)
		
				document.getElementById("skip").textContent = ''
			}
		
		})
	}
	
}