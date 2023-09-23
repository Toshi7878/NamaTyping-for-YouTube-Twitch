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
			'testCommentData':[],
			'result': []
		}
	}


	checkPhraseMatch(chatData) {

		const userId = chatData.id

		if (!chat.users[chatData.id]) {
			this.addNewUser(chatData)
		}

		let userComment = formatComment(chatData.comment);
		this.users[userId]['testCommentData'].push(userComment);

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
			
					userComment = userComment.slice(correct['lyrics'].length + userComment.indexOf(correct['lyrics']));
					this.users[userId]['typeCount'] += parseLrc.joinLyrics(correctLyrics).length / (correct['judge'] == 'Good' ? 1.5 : 1);
					this.users[userId]['lyricsIndex'] = i+1
					this.users[userId]['result'].push([correct['lyrics'], correct['judge'],i,(correct['judge'] == 'Good' ? correctLyrics : '')]);
			
				}
				
			}

		}

		if(userComment){
			this.users[userId]['result'].push([userComment, 'None']);
		}



		console.log(this.users[userId]['result'])
	}

	judgeComment(correctLyrics, comment){
			let judge = 'Great'
			let correcting = ''

			for(let i=0; i<correctLyrics.length; i++){

				for(let m=0; m<correctLyrics[i].length; m++){
					let search = comment.search(correctLyrics[i][m])
				
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

					if(m == correctLyrics[i].length-1){
						search = repl.kanaToHira(comment).search(repl.kanaToHira(correctLyrics[i][m]))

						if(i == 0 && search > 0){
							comment = comment.slice(search)
							search = 0
						}

						if(search == 0){
							correcting += comment.slice(0, correctLyrics[i][m].length)
							comment = comment.slice(correctLyrics[i][m].length)
							judge = 'Good'
							break;
						}else{
							return {'lyrics':'', 'judge':'None'}
						}
					}

				}
			}

			return {'lyrics':correcting, 'judge':judge}


	}

}




let chat


function formatComment(text){
	//残す文字を正規表現で下の配列に記入
	text = text.normalize('NFKC').toLowerCase();

	//parse-lyrics.jsのregexを使用
	text = text.replace(new RegExp(regex, 'g'), "");
	// text = text.replace(/([a-z])(\.)/g, "$1");
	// text = text.replace(/([a-z])(-)/g, "$1");
	return text;
}
