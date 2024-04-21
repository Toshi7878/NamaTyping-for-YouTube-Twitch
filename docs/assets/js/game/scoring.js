class Scoring {
	constructor() {
			this.usersScore = chat && Object.keys(chat.users).length ? this.parseResultData() : [ {name:'', typeCount:0, userID:'', score:0, displayRank:'0位', number:0} ]
			this.displayCount = this.usersScore.length
	}

	parseResultData(){
		const usersID = Object.keys(chat.users)
		let resultData = []

		for(let i=0;i<usersID.length;i++){

			const name = chat.users[usersID[i]]['name']
			const typeCount = chat.users[usersID[i]]['typeCount']
			const score = chat.users[usersID[i]]['score']
			resultData.push({'name':name, 'typeCount':typeCount, 'userID':usersID[i], 'score':score})

		}

		//順位ソート
		resultData = resultData.sort((a, b) => {return b['typeCount'] - a['typeCount'];})

		for(let i=0;i<resultData.length;i++){

			if(i == 0){
				resultData[i]['displayRank'] = '1位'
			}else if(resultData[i-1]['typeCount'] == resultData[i]['typeCount']){
				//前の人と同じ順位
				resultData[i]['displayRank'] = resultData[i-1]['displayRank']
			}else{
				resultData[i]['displayRank'] = (i+1)+'位'
			}

			resultData[i]['number'] = i
		}
		

		return resultData
	}


	displayResult() {
		if(game.isStart || !this.usersScore[this.displayCount-1]){return;}
		
		const rank = this.usersScore[this.displayCount-1]['displayRank']
		const score = this.usersScore[this.displayCount-1]['score'] + "点"
		const name = this.usersScore[this.displayCount-1]['name']
		document.getElementById("result").insertAdjacentHTML('afterbegin',
			`<div class='user-result'>
		<span class='rank'>${rank}</span> 
		<span class='score'>${score}</span> 
		<span class='name'>${name}</span>
		</div>`)

		this.displayCount--

		if (this.usersScore[this.displayCount-1]) {

			if(this.usersScore < 10){
				setTimeout(this.displayResult.bind(this), 1000)
			}else{
				setTimeout(this.displayResult.bind(this), 500)
			}
		}
	}

	async sendFireStore(liveId, detailData){
		const usersID = Object.keys(detailData)
	
		for(let i=0;i<usersID.length;i++){
			detailData[usersID[i]].result = formatNestedArray(detailData[usersID[i]].result)
		}
	
		try {
		  const dataRef = firestore.collection(liveId).doc(game.startTimeStamp.toString(16))
		  const timeRef = firestore.collection('timeStamp').doc(liveId)
		  const timestamp = await this.getLocationDate()

		  await dataRef.set({
			title: game.title,
			detailData: detailData,
			lyricsData: game.generateJoinLyrics( game.comparisonLyrics.flat(1) ),
			startTimeStamp:game.startTimeStamp
		  })

		  await timeRef.set({
			timeStamp: timestamp
		  })


		} catch (err) {
		  console.log(`Error: ${JSON.stringify(err)}`)
		}
	}

	async getLocationDate(){
		const resp = await fetch(window.location.href)

		//サーバー時刻のタイムスタンプ
		const locationDateTimeStamp = await new Date(resp.headers.get("date")).getTime()
		
		return locationDateTimeStamp;
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