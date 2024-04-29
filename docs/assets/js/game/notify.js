class Notify {

	static add(text, color = '#FFF'){
		const notify = document.getElementById("notify")
		notify.insertAdjacentHTML('beforeend', `<div style="color:${color}">${text}</div>`)
		notify.scrollTop = notify.scrollHeight - notify.clientHeight;
	}
}