
let volume

async function loadVolume(){
	let LOAD_VOLUME_DATA
	if (location.host == 'localhost:8080') {
		LOAD_VOLUME_DATA = {data:Number(iniData['volume'])};
	}else{
		LOAD_VOLUME_DATA = await db.notes.get('volume')
	}
	volume = LOAD_VOLUME_DATA ? LOAD_VOLUME_DATA.data : 50

	document.getElementById('volume').value = volume
	document.getElementById('volume').title = volume

}
if (location.host != 'localhost:8080') {
	loadVolume()
}

document.getElementById('volume').addEventListener('input',async event => {
	volume = event.target.value
	
	if (location.host == 'localhost:8080') {
		await eel.saveSetting('volume',volume)();
	}
	
	db.notes.put({id: 'volume', data:+volume});

	document.getElementById('volume').title = volume

	if(game){
		MediaControl.volumeChange(volume)
	}
})