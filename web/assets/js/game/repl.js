class Repl {

	constructor(lyrics){
		this.getReplData(lyrics)
	}

	async getReplData(lyrics){
		this.data = await this.postMorphAPI(lyrics)
	}

	kanaToHira(str) {
	    return str.replace(/[\u30a1-\u30f6]/g, function(match) {
	        var chr = match.charCodeAt(0) - 0x60;
	        return String.fromCharCode(chr);
		});
	}

	async postMorphAPI(SENTENCE){
		const APIKEY = '48049f223f8d9169a08de4e3bba21f64e4c17a7771620c1b8bb20574b87ea813';
		const BASE_URL = 'https://labs.goo.ne.jp/api/morph';

		const requestOptions = {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				app_id: APIKEY,
				sentence: JSON.stringify(SENTENCE),
				info_filter:"form|read"
			}),
		};

		const response = await fetch(BASE_URL, requestOptions);
		const responseData = await response.json();

		const LIST = responseData.word_list[0]

		let repl = []
		let uniqueList = []

		for(let i=0;i<LIST.length;i++){

			if(/[一-龥]/.test(LIST[i][0]) && !uniqueList.includes(LIST[i][0])){
				uniqueList.push(LIST[i][0])
				repl.push([LIST[i][0], this.kanaToHira(LIST[i][1])])
			}

		}

		return repl;
	}

}

let repl