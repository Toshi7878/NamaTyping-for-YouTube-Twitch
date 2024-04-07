window.addEventListener('keydown', (event) => {

	switch(event.code){
		case 'Escape':
			// if(game){
			// 	const isPlay = await MediaData.getIsPlay()

			// 	if(isPlay){
			// 		MediaControl.play()
			// 	}else{
			// 		MediaControl.pause()
			// 	}

			// }
			break;
		case 'F5':
			event.preventDefault()
			break;
		case 'KeyR':

			if(event.ctrlKey){
				event.preventDefault()
			}
			
			break;

		case 'KeyF':

			// if(event.ctrlKey){
			// 	event.preventDefault()
			// }
			break;
	}
})