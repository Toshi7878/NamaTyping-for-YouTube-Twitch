class Scoring {
	constructor() {

			this.usersScore = chat && Object.keys(chat.users).length ? this.parseResultData() : [ [' ',0,' '] ]
			this.totalNotes = game ? this.calcTotalNotes() : 0
			this.displayCount = this.usersScore.length

	}


	calcTotalNotes(){
		let totalNotes = 0
		const lyricsArray = game.comparisonLyrics.flat()

		for(let i=0;i<lyricsArray.length;i++){
			let count = 0
			for(let j=0;j<lyricsArray[i].length;j++){
				count += lyricsArray[i][j][0].length
			}
			totalNotes += count
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
}

let scoring