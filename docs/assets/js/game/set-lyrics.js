class Lyrics {
	constructor(displayLyrics, isEdit){
		this.set(displayLyrics, isEdit)
	}


	async set(displayLyrics, isEdit){
		let lyricsNode = ''

		for (let i = 0; i < displayLyrics.length; i++) {

				const char = displayLyrics[i]['char']
				const times = displayLyrics[i]['time']

				let lyricsElement = `<div data-count="${i}" id="lyrics-${i}" class="${char.length > 3 ? `text-keep-all`:""}${isEdit ? ` previous-lyrics`:""}${i == 0 ? ' head-lyrics':''}">`
				let shadowElement = `<div class="shadow-layer">`
				let wipeElement = `<div class="wipe-layer">`
				let charElements = ''

					for(let j=0; j<char.length; j++){
						charElements += `<span data-wipe-count="${j}" ${isEdit ? `contenteditable="true"`:""} ${times[j] && j > 0 ? `title="${times[j-1].toFixed(2)}"` : ''} ${times[j] && j > 0 ? `data-start-time="${times[j-1].toFixed(2)}"` : ''}  ${isEdit && times[j]? `class="edit-border"`:""}>${char[j]}</span>`
					}

				const Element = `${lyricsElement + shadowElement + charElements}</div>
				${wipeElement + charElements}</div></div>`

				lyricsNode += Element
			}
			lyricsNode += `<div id='lyrics-next'><span id='next-label'${settingData.displayNextLyrics.data ? ``:' class="d-none"'}>NEXT: </span>&#8203;<span id='skip'></span><span id='next'${settingData.displayNextLyrics.data ? ``:' class="d-none"'}></span></div>`
			document.getElementById("lyrics").innerHTML = lyricsNode

			if(!isEdit){
				Skip.addSkipEvent()
			}
		}

	static initializeWipeStyle(){
		const wipeLayer = document.getElementsByClassName('wipe-layer')
		for(let i=0;i<wipeLayer.length;i++){
			const wipeSpans = wipeLayer[i].children

			for(let m=0;m<wipeSpans.length;m++){
				wipeSpans[m].setAttribute('style',`background:-webkit-linear-gradient(0deg, #ffa500 0%, white 0%);-webkit-background-clip:text;`)
			}
		}
	}

	}
