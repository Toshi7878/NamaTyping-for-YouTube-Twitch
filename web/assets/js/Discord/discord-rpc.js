class Discord {

	static updateRPC(platform, title='') {
		let url = ''
		if(platform == 'YouTube'){
			url = document.getElementById("player").src
			url = url.slice(0,url.search(/\?/))
		}else if(platform == 'SoundCloud'){
			url = document.getElementById("sc-widget").src
		}
	
		eel.displayDiscordRPC(title, platform, url)();
	}


	static closeRPC() {
		eel.hideDiscordRPC()();
	}

	static async loadDisplayOption(){
		const LOAD_OPTION_DATA = await db.notes.get('display-discord-rpc')

		if(!LOAD_OPTION_DATA || LOAD_OPTION_DATA.data){
			Discord.updateRPC('', '選曲中')
		}
	
	}
}


if (location.host == 'localhost:8080') {
	Discord.loadDisplayOption()
}