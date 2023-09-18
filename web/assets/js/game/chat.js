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

				if (userComment.indexOf(correctLyrics) >= 0) {

					if(userComment.indexOf(correctLyrics) > 0){
						let missComment = ''
						if (correctLyrics) {
							missComment = userComment.slice(0, userComment.indexOf(correctLyrics))
						}
						this.users[userId]['result'].push([missComment, 'None']);
					}
	
					userComment = userComment.slice(correctLyrics.length + userComment.indexOf(correctLyrics));
					this.users[userId]['typeCount'] += correctLyrics.length;
					this.users[userId]['lyricsIndex'] = i+1
					this.users[userId]['result'].push([correctLyrics, 'Great',i]);
	
				}else{
					//this.users[userId]['result'].push([correctLyrics, 'Skip']);
				}
				
			}


		}


		if(userComment){
			this.users[userId]['result'].push([userComment, 'None']);
		}
		console.log(this.users[userId]['result'])
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
