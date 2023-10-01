const transparentCover = 

document.getElementById("transparent-cover").addEventListener('click',clickPlay)
document.getElementById("notify").addEventListener('click',clickPlay)

async function clickPlay(event) {
	if(!game){return;}

	const isPlay = await MediaData.getIsPlay()

	if(isPlay){
		MediaControl.play()
	}else{
		MediaControl.pause()
	}

}