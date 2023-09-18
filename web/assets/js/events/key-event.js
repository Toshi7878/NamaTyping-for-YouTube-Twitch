document.addEventListener('keydown', async (event) => {

	switch(event.code){
		case Escape:
			if(game){
				const isPlay = MediaData.getIsPlay()

				if(isPlay){
					MediaControl.play()
				}else{
					MediaControl.pause()
				}
			}
	}
})