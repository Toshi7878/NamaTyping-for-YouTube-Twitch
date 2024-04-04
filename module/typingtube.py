import json

import glob
import os
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.options import Options

access = None

class Write:
	def __init__(self, result, map_id):
		self.make_folder(map_id)
		self.json(result, map_id)

	def make_folder(self, map_id):
		self.str_map_id = str(map_id)

		if 4 < len(self.str_map_id):
			self.first_digit = self.str_map_id[:len(self.str_map_id)-4]
		else:
			self.first_digit = '0'

		MAPS_DIR = f'./Maps/{self.first_digit}0000'

		if not os.path.exists(MAPS_DIR):
			# ディレクトリが存在しない場合、ディレクトリを作成する
			os.makedirs(MAPS_DIR)


	def json(self, map_data, map_id):
		self.make_folder(map_id)

		data = {
			'movieURL': map_data['movieURL'],
			'title': map_data['title'],
			'creator': '',
			'tag': [],
			'map': map_data['map']
		}

		with open(f'./Maps/{self.first_digit}0000/{self.str_map_id}.json', mode='w', encoding="utf-8") as file:
			json.dump(data, file, indent=4, ensure_ascii=False)  # indentを指定して整形した形で書き込む



class Access:

	def __init__(self):
		self.option = Options()   
		self.option.add_argument("--headless")
		self.option.add_experimental_option('excludeSwitches', ['enable-logging'])
		self.chrome = webdriver.Chrome(options=self.option)
		self.chrome.get(f'https://typing-tube.net')

		# ページのロード完了まで待つ
		WebDriverWait(self.chrome, 10).until(EC.presence_of_element_located((By.XPATH, '//*[@id="main_content"]')))


class Check:
	def geted(self, identifier):

		if 4 < len(str(identifier)):
			first_digit = str(identifier)[:len(str(identifier)) - 4]
		else:
			first_digit = '0'

		files = glob.glob(f'./Maps/{first_digit}0000/*')
		identified_path = f'./Maps/{first_digit}0000\\{identifier}.json'

		if identified_path in files:
			return False
		
		return True

class TypingTube(Check):

	def __init__(self, map_id):

		if(self.geted(map_id) == True):
			global access

			if(access == None):
				access = Access()

			self.result = access.chrome.execute_script(generateScript(map_id))  # スクリプトを実行する
			self.isAccess = True
			
			if(self.result != None):
				Write(self.result, map_id)
		
		else:
			self.result = self.loadJson(map_id)
			self.isAccess = False


	def loadJson(self, map_id):
		if len(str(map_id)) > 4:
			firstNum = str(map_id)[:-4]
		else:
			firstNum = "0"

		with open(f'.\\Maps\\{firstNum}0000\\{str(map_id)}.json', encoding='utf-8') as f:
			data = json.load(f)
			return {"movieURL":data['movieURL'], "platform": "YouTube", "title":data['title'], "map":data['map']}


def generateScript(map_id):
	return f"""
class ParseLyrics {{

	constructor(lines){{
		this.info = this.getInfo(lines.shift())
		this.lyricsArray = this.map(lines)
	}}

	getInfo(info){{
		const infoArray = info.split('\\t')

		const TITLE = infoArray[0]
        const MOVIE_ID = infoArray[1].match(/[?&]v=([^&]+)/)

        return {{title:TITLE, movie_id:MOVIE_ID ? MOVIE_ID[1]:''}}
	}}

	map(lines){{
		const RESULT = []
		
		for (let i=0; i<lines.length; i++){{
			let line = lines[i].split("\\t");

			if(i == 0){{

				if(+line[0] > 0 ){{
					RESULT.push(["0", "", ""]);
				}}
				
			}}

			//配列の長さを3に整形する
			if (line.length < 3) {{
				const diff = 3 - line.length;

				for (let n = 0; n < diff; n++) {{
					line.push("");
				}}
			}}
			
			RESULT.push(line);
		}};

		return RESULT;
	}}
}}

async function getMap () {{
	let result
	
	await fetch(`/movie/lyrics/{map_id}`, {{
		method: "POST", // *GET, POST, PUT, DELETE, etc.
	}}).then((response) => response.text()).then(
		data => {{
			if(data.slice(2,9) == 'DOCTYPE'){{
				result = null
			}}else{{
				result = new ParseLyrics(data.split('\\n'))
			}}
		}} 
	) 

	if(result){{
		return {{'movieURL': result['info']['movie_id'],
				'title': result['info']['title'],
				'map': result['lyricsArray'],
				"platform": "YouTube"
			}}; 
	}}else{{
		return null;
	}}


}}

return getMap();
"""
