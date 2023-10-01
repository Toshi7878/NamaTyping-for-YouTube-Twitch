import sys
import os

# pyinstallerのnoconsoleオプション使用時は
# 標準出力が存在せずwriteできないため、devnullにリダイレクトしておく
if hasattr(sys.stdout, 'write') == False: sys.stdout = open(os.devnull, 'w')
if hasattr(sys.stderr, 'write') == False: sys.stderr = open(os.devnull, 'w')


import re
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

class GetCreateData:

	def __init__(self, url):
			self.url = url
			self.access(url)


	def access(self, url):
		self.option = Options()
		self.option.add_argument("--headless")
		self.option.add_experimental_option('excludeSwitches', ['enable-logging'])
		self.chrome = webdriver.Chrome(options=self.option)
		self.chrome.get(url)
		self.getCreateParam()
		self.chrome.quit()

	def getCreateParam(self):
		self.wait = WebDriverWait(self.chrome, 5)
		self.wait.until(EC.presence_of_all_elements_located)  # 特定の要素が読み込まれるまで待つ
		YTpattern = r"(https?://)?(www\.)?(youtube\.com|youtu\.be)/.*"
		SCpattern = r"https?://(www\.)?soundcloud\.com/.*"


		# 正規表現とマッチング
		if re.match(YTpattern, self.url):
			ID = self.chrome.execute_script("return document.querySelector('#movie_player').getVideoData().video_id")
			Title = self.chrome.execute_script("return document.querySelector('#movie_player').getVideoData().title")
			Artist = self.chrome.execute_script("return document.querySelector('#movie_player').getVideoData().author")
			Platform = 'YouTube'
		elif re.match(SCpattern, self.url):
			ID = self.chrome.execute_script("return window.__sc_hydration[7].data.id")
			Title = self.chrome.execute_script("return  window.__sc_hydration[7].data.title")
			Artist = self.chrome.execute_script("return  window.__sc_hydration[7].data.user.username")
			Platform = 'SoundCloud'



		self.result = {"id":ID, "title":Title, "artist":Artist, "platform":Platform}

