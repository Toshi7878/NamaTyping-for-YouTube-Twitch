class Lyrics {
	constructor(displayLyrics, isEdit){
		this.set(displayLyrics, isEdit)
	}


	set(displayLyrics, isEdit){
		let lyricsNode = ''

		for (let i = 0; i < displayLyrics.length; i++) {

				const char = displayLyrics[i]['char']
				const times = displayLyrics[i]['time']

				let lyricsElement = `<div data-count="${i}" id="lyrics-${i}" ${isEdit ? `class="previous-lyrics"`:""}>`
				let shadowElement = `<div class="shadow-layer">`
				let wipeElement = `<div class="wipe-layer">`
				let charElements = ''

					for(let j=0; j<char.length; j++){
						charElements += `<span data-wipe-count="${j}" ${isEdit ? `contenteditable="true"`:""} ${times[j] && j > 0 ? `data-start-time="${times[j-1].toFixed(2)}"` : ''}  ${isEdit && times[j]? `class="edit-border"`:""}>${char[j]}</span>`
					}

				const Element = `${lyricsElement + shadowElement + charElements}</div>
				${wipeElement + charElements}</div></div>`

				lyricsNode += Element
			}
			lyricsNode += `<div id='lyrics-next' ${isEdit ? `style="display:none;"`:""}><span id='next-label'>NEXT: </span><span id='skip'></span><span id='next'></span></div>`
			document.getElementById("lyrics").innerHTML = lyricsNode

			if(!isEdit){
				Skip.addSkipEvent()
			}
		}

	}
