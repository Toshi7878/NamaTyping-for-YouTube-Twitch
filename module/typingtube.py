import sys
import os

# pyinstallerのnoconsoleオプション使用時は
# 標準出力が存在せずwriteできないため、devnullにリダイレクトしておく
if hasattr(sys.stdout, 'write') == False: sys.stdout = open(os.devnull, 'w')
if hasattr(sys.stderr, 'write') == False: sys.stderr = open(os.devnull, 'w')

import json


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
