import sys
import os

# pyinstallerのnoconsoleオプション使用時は
# 標準出力が存在せずwriteできないため、devnullにリダイレクトしておく
if hasattr(sys.stdout, 'write') == False: sys.stdout = open(os.devnull, 'w')
if hasattr(sys.stderr, 'write') == False: sys.stderr = open(os.devnull, 'w')


import json
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

class TypingTube:

	def __init__(self, id):
		self.id = id
		try:
			self.loadJson()
			return

		except FileNotFoundError:
			self.accessTypingTube()
			return



	def loadJson(self):
		if len(str(self.id)) > 4:
			firstNum = str(self.id)[:-4]
		else:
			firstNum = "0"

		with open(f'.\\Maps\\{firstNum}0000\\{str(self.id)}.json', encoding='utf-8') as f:
			data = json.load(f)
			self.sendData = {"movieURL":data['movieURL'], "platform": "YouTube", "title":data['title'], "map":data['map']}

	def accessTypingTube(self):
		self.option = Options()
		self.option.add_argument("--headless")
		self.option.add_experimental_option('excludeSwitches', ['enable-logging'])
		self.chrome = webdriver.Chrome(options=self.option)
		self.chrome.get(f'https://typing-tube.net/movie/show/{str(self.id)}')  # 譜面ページを開く
		self.getMap()
		self.chrome.quit()

	def getMap(self):
		self.wait = WebDriverWait(self.chrome, 5)
		self.wait.until(EC.presence_of_all_elements_located)  # 特定の要素が読み込まれるまで待つ
		lyrics_array = self.chrome.execute_script("return lyrics_array;")
		MovieUrl = self.chrome.execute_script("return player.getVideoData().video_id;")
		Title = self.chrome.execute_script("return document.querySelector('.movietitle h1').firstChild.textContent.replace(/\\n\\s*/g, '');")
		self.sendData = {"movieURL":MovieUrl, "platform":"YouTube", "title":Title, "map":lyrics_array}