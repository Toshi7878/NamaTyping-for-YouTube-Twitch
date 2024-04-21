

async function loadVolume(){
	let LOAD_VOLUME_DATA
	if (location.host == 'localhost:8080') {
		LOAD_VOLUME_DATA = {data:Number(iniData['volume'])};
	}else{
		LOAD_VOLUME_DATA = await db.notes.get('volume') || {data:50}
	}

	document.getElementById('volume').value = LOAD_VOLUME_DATA.data
	document.getElementById('volume').title = LOAD_VOLUME_DATA.data

}
if (location.host != 'localhost:8080') {
	loadVolume()
}

document.getElementById('volume').addEventListener('input',async event => {
	
	if (location.host == 'localhost:8080') {
		await eel.saveSetting('volume',event.target.value)();
	}
	
	db.notes.put({id: 'volume', data:+event.target.value});
	document.getElementById('volume').title = event.target.value

	if(game){
		MediaControl.volumeChange(event.target.value)
	}
})