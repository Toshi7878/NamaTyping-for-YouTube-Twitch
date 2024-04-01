import sys
import os

# pyinstallerのnoconsoleオプション使用時は
# 標準出力が存在せずwriteできないため、devnullにリダイレクトしておく
if hasattr(sys.stdout, 'write') == False: sys.stdout = open(os.devnull, 'w')
if hasattr(sys.stderr, 'write') == False: sys.stderr = open(os.devnull, 'w')

import eel
import pytchat
import threading
import configparser
from module import twitch_chat_irc
from module.typingtube import TypingTube
from module.getCreateData import GetCreateData

# config.iniファイルを読み込む
config = configparser.ConfigParser()
config.read('.\\config.ini')

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


# ウィンドウサイズを保存する
@eel.expose
def saveWindowSize(width, height):
    # 新しい値を設定する
    config['DEFAULT']['window_width'] = str(width)
    config['DEFAULT']['window_height'] = str(height)
    # ファイルに書き込み
    with open('.\\config.ini', 'w') as configfile:
        config.write(configfile)

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
		self.livechat = pytchat.create(video_id = f'https://www.youtube.com/watch?v={self.liveId}') #配信IDを指定
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




eel.init("docs")

# window_widthとwindow_heightを取得する
window_width = config.getint('DEFAULT', 'window_width')
window_height = config.getint('DEFAULT', 'window_height')

eel.start("index.html", size=(window_width, window_height), port=8080)