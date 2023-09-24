class Scoring {
	constructor(index) {
			this.usersResult = results.data[+index].doc.data.value.mapValue.fields.detailData.mapValue.fields
			this.correctLyrics = this.parseLyrics(results.data[+index].doc.data.value.mapValue.fields.lyricsData.arrayValue.values)
			this.usersScore = this.parseResultData(this.usersResult)
			this.totalNotes = this.calcTotalNotes(this.correctLyrics)
	}

	parseLyrics(lyricsObj){
		let lyricsArray = []

		for(let i=0;i<lyricsObj.length;i++){
			lyricsArray.push(lyricsObj[i].stringValue)
		}

		return lyricsArray;
	}


	calcTotalNotes(lyricsArray){
		let totalNotes = 0

		for(let i=0;i<lyricsArray.length;i++){
			totalNotes += lyricsArray[i].length
		}
		return totalNotes
	}


	parseResultData(usersResult){
		const usersID = Object.keys(usersResult)
		let resultData = []

		for(let i=0;i<usersID.length;i++){
			const USER_RESULT = usersResult[usersID[i]].mapValue.fields

			const name = Object.values(USER_RESULT.name)[0]
			const typeCount = Object.values(USER_RESULT.typeCount)[0]
			resultData.push([name,typeCount,usersID[i]])
		}

		return resultData.sort((a, b) => {return b[1] - a[1];})
	}

	parseResultObject(detailData){
		let resultArray = []

		for(let i=0;i<detailData.length;i++){
			let data = []
			const LINE = Object.values(detailData[i])[0].values

			for(let j=0;j<LINE.length;j++){
				if(Object.keys(LINE[j])[0] == 'integerValue'){
					data.push(+Object.values(LINE[j])[0])
				}else{
					data.push(Object.values(LINE[j])[0])
				}
			}

		resultArray.push(data)
		}
		return resultArray;
	}
}

let scoring