class Lyrics {
	constructor(displayLyrics){
		this.lyricsElement = ''
		this.set(displayLyrics)
	}


	set(displayLyrics){

		for (let i = 0; i < displayLyrics.length; i++) {

				const char = displayLyrics[i]['char']
				const times = displayLyrics[i]['time']

				let lyricsElement = `<div data-count="${i}" id="lyrics-${i}" ${game.isEdit ? `class="previous-lyrics"`:""}>`
				let shadowElement = `<div class="shadow-layer">`
				let wipeElement = `<div class="wipe-layer">`
				let charElements = ''

					for(let j=0; j<char.length; j++){
						charElements += `<span data-wipe-count="${j}" ${game.isEdit ? `contenteditable="true"`:""} ${times[j] ? `data-start="${times[j].toFixed(2)}"` : ''}  ${game.isEdit ? `class="edit-border"`:""}>${char[j]}</span>`
					}

				const Element = `${lyricsElement + shadowElement + charElements}</div>
				${wipeElement + charElements}</div></div>`

				this.lyricsElement += Element
			}
			this.lyricsElement += `<div id='lyrics-next' ${game.isEdit ? `style="display:none;"`:""}><span id='next-label'>NEXT: </span><span id='skip'></span><span id='next'></span></div>`
			document.getElementById("lyrics").innerHTML = this.lyricsElement

			new Skip()

		}

	}
