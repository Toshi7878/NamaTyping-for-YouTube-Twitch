class Notify {

	static add(text){
		const notify = document.getElementById("notify")
		notify.insertAdjacentHTML('beforeend', `<div>${text}</div>`)
		notify.scrollTop = notify.scrollHeight - notify.clientHeight;
	}
}