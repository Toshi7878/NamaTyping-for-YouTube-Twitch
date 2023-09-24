const firebaseConfig = {
	apiKey: "AIzaSyAcbZAD6oMclVbmDEuaK3SElOV-c_uLjWs",
	authDomain: "namatyping-result-db.firebaseapp.com",
	projectId: "namatyping-result-db",
	storageBucket: "namatyping-result-db.appspot.com",
	messagingSenderId: "158339431906",
	appId: "1:158339431906:web:f0df09e91245ac71a58dbb",
	measurementId: "G-JPMS3QHMGS"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const firestore = firebase.firestore(app);


class Results {

	constructor(){
		this.data = []
		
		if(location.search.slice(1)){
			firestore.collection(location.search.slice(1)).onSnapshot(snapshot => {
				const data = snapshot._delegate._snapshot.docChanges
	
				for(let i=0;i<data.length;i++){
					this.data.push(data[i])
	
					document.querySelector("#main-table tbody").insertAdjacentHTML('beforeend', 
								`<tr id='result-${this.data.length-1}' data-index=${this.data.length-1}>
									<th>${this.data.length}曲目</th>
									<th>${data[i].doc.data.value.mapValue.fields.title.stringValue}</th>
									<th>test</th>
								</tr>`)
				}
			  });
	
			  this.addTableEvent()
		}

	}

	addTableEvent(){
		document.querySelector("#main-table tbody").addEventListener('click', event => {
			const DATA_INDEX = event.target.parentElement.dataset.index

			const isOpened = detailResultMenu && detailResultMenu.frame.isOpen ? true : false

			if(!isOpened){
				detailResultMenu = new DetailResultMenu()
				detailResult = new DetailResult(DATA_INDEX)
			}else{
				detailResultMenu.frame.requestFocus()
			}
		})
	}
}

let results = new Results()