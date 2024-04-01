function showToast(html, bgColor, toastWidth = 260){
	const jsFrame = new JSFrame();

	jsFrame.showToast({
		align:'top',
		width:toastWidth,
		style: {
			borderRadius: '2px',
			backgroundColor: bgColor,

		},
		html: html
	});
}