window.addEventListener('keydown', async (event) => {

	switch(event.code){
		case 'Escape':
			if(game){
				const isPlay = await MediaData.getIsPlay()

				if(isPlay){
					MediaControl.play()
				}else{
					MediaControl.pause()
				}

			}
	}
})