class Scoring {
	constructor() {

			this.usersScore = chat && Object.keys(chat.users).length ? this.parseResultData() : [ [' ',0,' '] ]
			this.correctLyrics = timer ? this.generateJoinLyrics( timer.updateCorrectLyrics(game.comparisonLyrics.length) ) : []
			this.totalNotes = timer ? this.calcTotalNotes(this.correctLyrics) : 0
			this.displayCount = this.usersScore.length

	}

	
	generateJoinLyrics(lyricsArray){
		let result = []
		for(let i=0;i<lyricsArray.length;i++){
			result.push(parseLrc.joinLyrics(lyricsArray[i]))
		}

		return result;
	}


	calcTotalNotes(lyricsArray){
		let totalNotes = 0

		for(let i=0;i<lyricsArray.length;i++){
			totalNotes += lyricsArray[i].length
		}
		return totalNotes
	}



	parseResultData(){
		const usersID = Object.keys(chat.users)
		let resultData = []

		for(let i=0;i<usersID.length;i++){

			const name = chat.users[usersID[i]]['name']
			const typeCount = chat.users[usersID[i]]['typeCount']
			const result = chat.users[usersID[i]]['result']
			resultData.push([name,typeCount,usersID[i]])

		}

		return resultData.sort((a, b) => {return b[1] - a[1];})
	}


	displayResult() {
		if(game.isStart || !this.usersScore[this.displayCount-1]){return;}
		
		const rank = this.displayCount
		const score = Math.round((1000 / this.totalNotes) * (this.usersScore[this.displayCount-1] ? this.usersScore[this.displayCount-1][1] : 0))
		const name = this.usersScore[this.displayCount-1] ? this.usersScore[this.displayCount-1][0] : '名無し'
		document.getElementById("result").insertAdjacentHTML('afterbegin',
			`<div class='user-result'>
		<span class='rank'>${rank}位</span> 
		<span class='score'>${score}点</span> 
		<span class='name'>${name}</span>
		</div>`)

		this.displayCount--

		if (this.usersScore[this.displayCount-1]) {
			setTimeout(this.displayResult.bind(this), 1000)
		}
	}

	async sendFireStore(detailData){
		const usersID = Object.keys(detailData)
	
		for(let i=0;i<usersID.length;i++){
			detailData[usersID[i]].result = formatNestedArray(detailData[usersID[i]].result)
		}
	
		try {
		  // 省略 
		  // (Cloud Firestoreのインスタンスを初期化してdbにセット)
	  
		  const ref = firestore.collection('liveid').doc(game.gameID)
		  await ref.set({
			title: game.title,
			detailData: detailData,
			lyricsData: this.correctLyrics
		  })
		} catch (err) {
		  console.log(`Error: ${JSON.stringify(err)}`)
		}
	}
	

}

let scoring

function formatNestedArray(arr) {
	let obj = {};
	for(let i = 0; i < arr.length; i++) {
	  obj[i] = arr[i];
	}
	return obj;
  }