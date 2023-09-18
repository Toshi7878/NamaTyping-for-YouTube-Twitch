const transparentCover = document.getElementById("transparent-cover")

transparentCover.addEventListener('click',async (event) => {
	if(!game){return;}

	const isPlay = await MediaData.getIsPlay()

	if(isPlay){
		MediaControl.play()
	}else{
		MediaControl.pause()
	}

})