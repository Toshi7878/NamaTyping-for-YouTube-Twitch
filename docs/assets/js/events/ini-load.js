let iniData

class INI {

	async loadINI(){
		iniData = await eel.loadSetting()();
		iniData = await this.parseINIData(iniData)
		return iniData;
	}

	parseINIData(ini){
		const values = Object.values(ini)
		const keys = Object.keys(ini)

		for(let i=0;i<keys.length;i++){
			ini[keys[i]] = values[i].replace(/^\"|\"$/g,'')
		}

		return ini;
	}
}
if (location.host == 'localhost:8080') {
	async function start() {
		const Ini = new INI();
		await Ini.loadINI()

		await lrcSettingData.load()
		live = new Live()
		notifyOption = new NotifyOption()
		loadFontSize()
		loadVolume()
		new soloPlayToggle()
		await settingData.load()
	}

	start();
}

