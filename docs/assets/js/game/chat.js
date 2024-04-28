/**
 * Pythonからユーザーのコメントデータを受け取る
 */
if (location.host == 'localhost:8080') {
	eel.expose(commentCheck)
	function commentCheck(chatData) {

		if (chat) {
			chat.checkPhraseMatch(chatData)
		}

		return true;
	}
}

class Chat {

	constructor() {
		this.users = {}
	}

	addNewUser(chatData) {
		chat.users[chatData.id] = {
			'name': chatData.name,
			'typeCount': 0,
			'score': 0,		
			'lyricsIndex': 0,
			'result': []
		}
	}


	checkPhraseMatch(chatData) {

		const userId = chatData.id

		if (!chat.users[chatData.id]) {
			this.addNewUser(chatData)
		}

		let userComment = formatComment(chatData.comment);

		const userLyricsIndex = this.users[userId]['lyricsIndex']

		for (let i = userLyricsIndex; i < timer.correctLyrics.length; i++) {

			const correctLyrics = timer.correctLyrics[i]

			if(userComment){
				let correct = this.judgeComment(correctLyrics, userComment)


				if (correct['lyrics']) {
			
					if(userComment.indexOf(correct['lyrics']) > 0){
						let missComment = ''
			
						if (correct['lyrics']) {
							missComment = userComment.slice(0, userComment.indexOf(correct['lyrics']))
						}
			
						this.users[userId]['result'].push([missComment, 'None']);
					}

					const JOIN_LYRICS = parseLrc.joinLyrics(correctLyrics)
			
					userComment = userComment.slice(correct['lyrics'].length + userComment.indexOf(correct['lyrics']));
					this.users[userId]['typeCount'] += JOIN_LYRICS.length / (correct['judge'] == 'Good' ? 1.5 : 1);
					this.users[userId]['score']  = Math.round((1000 / game.totalNotes) * this.users[userId]['typeCount'])
					this.users[userId]['lyricsIndex'] = i+1
					this.users[userId]['result'].push([correct['lyrics'], correct['judge'],i,(correct['judge'] == 'Good' ? JOIN_LYRICS : '')]);
	
					if(notifyOption.notifyScoring){
						Notify.add(`${i}: ${correct['judge']}! ${this.users[userId]['name']} ${correct['lyrics']}`)
					}
					
				}
				
			}

		}

		if(userComment){
			this.users[userId]['result'].push([userComment, 'None']);
		}

	}


	judgeComment(correctLyrics, comment){
			let judge = 'Great'
			let correcting = ''
			let reSearchFlag = false
			
			for(let i=0; i<correctLyrics.length; i++){

				for(let m=0; m<correctLyrics[i].length; m++){
					let search = comment.search( this.escapeRegExp(correctLyrics[i][m]) )
				
					//great判定
					if(m == 0){

						if(i == 0 && search > 0){
							comment = comment.slice(search)
							search = 0
						}
							 
						if(search == 0){
							correcting += correctLyrics[i][m]
							comment = comment.slice(correctLyrics[i][m].length)
							break;
						}

					}

					if(search > 0 && correcting){
						reSearchFlag = true
					}

					//ハズレかrepl判定
					if(m == correctLyrics[i].length-1){
						let replSearch = repl.kanaToHira(comment.toLowerCase()).search(this.escapeRegExp(repl.kanaToHira(correctLyrics[i][m].toLowerCase())))

						if(i == 0 && replSearch > 0){
							comment = comment.slice(replSearch)
							replSearch = 0
						}

						if(replSearch > 0 && i && correcting){
							reSearchFlag = true
						}

						if(replSearch == 0){
							correcting += comment.slice(0, correctLyrics[i][m].length)
							comment = comment.slice(correctLyrics[i][m].length)
							judge = 'Good'
							break;
						}else if(reSearchFlag){
							return this.judgeComment(correctLyrics, comment)
						}else{
							return {'lyrics':'', 'judge':'None'}
						}
					}

				}
			}

			return {'lyrics':correcting, 'judge':judge}


	}

	generateCombinations(input, index = 0, current = '') {
		if (index === input.length) {
			return [current];
		}
		
		const subArray = input[index];
		const combinations = [];
		for (let i = 0; i < subArray.length; i++) {
			combinations.push(...generateCombinations(input, index + 1, current + subArray[i]));
		}
		return combinations;
	}

	escapeRegExp(string) {
		return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& はマッチした部分文字列を示します
	}
}




let chat


function formatComment(text){
	text = parseLrc.formatSymbols(text) //記号整形

	if(lrcSettingData["lrc-eng-case-sensitive"].data){
		text = text.normalize('NFKC') //全角を半角に変換
	}else{
		text = text.normalize('NFKC').toLowerCase() //全角を半角に変換 & 小文字に変換;
	}

	//parse-lyrics.jsのregexを使用
	text = text.replace(new RegExp(parseLrc.regex, 'g'), "");
	
	//全角の前後のスペースを削除
	text = text.replace(/(\s+)([^!-~])/g, '$2').replace(/([^!-~])(\s+)/g, '$1')
	
	//テキストの末尾が半角ならば末尾に半角スペース追加
	if(/[!-~]$/.test(text)){
		text = text + " "
	}
	return text;
}
