class MargeRepl {

	marge(comparisonLyrics){
		let replSort = this.result.sort((first, second) => second[0].length - first[0].length)

		for(let i=0;i<comparisonLyrics.length;i++){

			for(let j=0;j<comparisonLyrics[i].length;j++){

				if(/[一-龥]/.test(comparisonLyrics[i])){

					for(let m=0;m<replSort.length;m++){
						comparisonLyrics[i][j] = comparisonLyrics[i][j].replace(RegExp(replSort[m][0],"g"),"\t@@"+m+"@@\t")
					}

				}

			}

		}

		for(let i=0;i<comparisonLyrics.length;i++){

			for(let j=0;j<comparisonLyrics[i].length;j++){
				let line = comparisonLyrics[i][j].split('\t').filter(x => x !== "")

				for(let m=0;m<line.length;m++){

					if(line[m].slice(0,2) == '@@' && line[m].slice(-2) == '@@' && replSort[parseFloat(line[m].slice(2))]){
						line[m] = replSort[parseFloat(line[m].slice(2))]
					}else{
						line[m] = [line[m]]
					}

				}

				comparisonLyrics[i][j] = line

			}

		}

		return comparisonLyrics;
	}
}


class Repl extends MargeRepl{

	constructor(data = []){
		super()
		this.result = data
	}

	async getReplData(lyrics){
		this.result = await this.postMorphAPI(lyrics)
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

	  try {
		  
		const response = await fetch(BASE_URL, requestOptions);
		  
		if (!response.ok) {
		  throw new Error(`HTTP error! Status: ${response.status}`);
		}
		  
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
		  
	  } catch (error) {
	    console.error('Error:', error.message);
	  }


	}

	
	kanaToHira(str) {
	    return str.replace(/[\u30a1-\u30f6]/g, function(match) {
	        var chr = match.charCodeAt(0) - 0x60;
	        return String.fromCharCode(chr);
		});
	}

}

let repl





