import eel
import atexit
import pytchat
import threading
from module import twitch_chat_irc
from module.typingtube import TypingTube
from module.getCreateData import GetCreateData


@eel.expose
def sendURLtoGetParamData(url):
	getCreateData = GetCreateData(url)
	return getCreateData.result


#TypingTubeから譜面を取得する
@eel.expose
def getTypingTubeEvent(id):
	typingtube = TypingTube(id)
	return typingtube.sendData

chat = None

#開始
@eel.expose
def startChatObserver(id, platform):
	global chat
	chat = Chat(id, platform)
	return True


#採点ボタンが押された
@eel.expose
def stopChatObserver():

	if(chat.platform == 'Twitch'):
		chat.connection.close_connection()
	else:
		chat.isClickScoringBtn = True


	return True



class Chat:

	def __init__(self, liveId, platform):
		self.liveId = liveId
		self.platform = platform

		if(platform == 'Twitch'):
			self.connectTwitchChat()
		else:
			self.connectYouTubeChat()




	def connectYouTubeChat(self):
		self.isClickScoringBtn = False
		self.livechat = pytchat.create(video_id = self.liveId) #配信IDを指定
		#参加者のチャンネルID, 名前, コメントが入る
		self.thread1 = threading.Thread(target=self.youtubeObserver)
		self.thread1.start() # チャット監視を別スレッドで処理


	#YouTubeチャットを監視
	def youtubeObserver(self):
		print('start YouTube Observer')

		while self.livechat.is_alive():


			for c in self.livechat.get().sync_items():

					print(f'{c.author.name} : {c.message}')

					data = {
						'name': c.author.name,
						'id': c.author.channelId,
						'comment': c.message
					}

					eel.commentCheck(data)
			

			if self.isClickScoringBtn == True: #採点ボタンが押されたらwhileループを停止
				self.isClickScoringBtn = False
				print('stop YouTube Observer')
				break


	def connectTwitchChat(self):
		self.connection = twitch_chat_irc.TwitchChatIRC()
		self.thread1 = threading.Thread(target=lambda: self.connection.listen(self.liveId, on_message=self.twitchSendCommentData))
		self.thread1.start() # チャット監視を別スレッドで処理


	def twitchSendCommentData(self, message): 
		print(f'{message["display-name"]} : {message["message"]}') 

		data = {
			'name': message['display-name'],
			'id': message['user-id'],
			'comment': message['message']
		}

		eel.commentCheck(data)



# Eelアプリケーションの終了時に実行する関数
def on_exit():
	print("Eelアプリケーションが終了しました。後始末を行います。")
    # ここに後始末のコードを追加


atexit.register(on_exit)  # 終了時の関数を登録


eel.init("web")

eel.start("namatyping-for-youtube-twitch.html", size=(1280, 720), port=8080)