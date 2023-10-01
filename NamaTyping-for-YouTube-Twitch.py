import sys
import os

# pyinstallerのnoconsoleオプション使用時は
# 標準出力が存在せずwriteできないため、devnullにリダイレクトしておく
if hasattr(sys.stdout, 'write') == False: sys.stdout = open(os.devnull, 'w')
if hasattr(sys.stderr, 'write') == False: sys.stderr = open(os.devnull, 'w')

import eel
import time
from time import mktime
import pytchat
import threading
from module import rpc
from module import twitch_chat_irc
from module.typingtube import TypingTube
from module.getCreateData import GetCreateData




client_id = '1155873158155472906'  # あなたのクライアントIDを記入
rpc_obj = rpc.DiscordIpcClient.for_platform(client_id)  
start_time = mktime(time.localtime())

@eel.expose
def hideDiscordRPC():
	rpc_obj._close()

@eel.expose
def displayDiscordRPC(title='選曲中', platform='', url=''):
	activity = {
			"details": title,
			"timestamps": {
                "start": start_time
            },
			"assets" : {
				"large_image" : "nama_key" # さっきコピーしたものを貼り付け
			}
	}
	if title != '選曲中':
		activity["state"] = 'Playing'


	if url != '':
		activity["buttons"] = [{"label" : f"{platform}で聴く", "url" : url}]
	
	rpc_obj.set_activity(activity)

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


eel.init("docs")

eel.start("index.html", size=(1280, 720), port=8080)