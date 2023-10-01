
let volume

async function loadVolume(){
	const LOAD_VOLUME_DATA = await db.notes.get('volume')
	volume = LOAD_VOLUME_DATA ? LOAD_VOLUME_DATA.data : 50

	document.getElementById('volume').value = volume
	document.getElementById('volume').title = volume

}

loadVolume()

document.getElementById('volume').addEventListener('input', event => {
	volume = event.target.value
	db.notes.put({id: 'volume', data:+volume});

	document.getElementById('volume').title = volume

	if(game){
		MediaControl.volumeChange(volume)
	}
})