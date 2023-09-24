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
const DELETE_TIME = 1000*60*60*12

class Results {

	constructor(){
		this.data = []
		this.init()



	}

	async init(){
		await this.deleteResultsData()

		if(location.search.slice(1)){
			this.getResultsData()
		}
	}


	async getLocationDate(){
		const resp = await fetch(window.location.href)

		//サーバー時刻のタイムスタンプ
		const locationDateTimeStamp = await new Date(resp.headers.get("date")).getTime()
		
		return locationDateTimeStamp;
    }

	async deleteResultsData(){
		const NOW = await this.getLocationDate()
		await firestore.collection("timeStamp").get().then(snapShot => {
			const timeStampData = snapShot._delegate._snapshot.docChanges

			for(let i=0;i<timeStampData.length;i++){
				const TIMESTAMP = +timeStampData[i].doc.data.value.mapValue.fields.timeStamp.integerValue
				const LIVE_ID = timeStampData[i].doc.key.path.segments[6]

				if(NOW - TIMESTAMP > DELETE_TIME){
					//実行
					const colRef = firestore.collection(LIVE_ID);
					DeleteCollection.deleteCollection(firestore, colRef, 500);
					firestore.collection("timeStamp").doc(LIVE_ID).delete()
				}

			}
		})
	}

	getResultsData(){
		firestore.collection(location.search.slice(1)).onSnapshot(snapshot => {
			const data = snapshot._delegate._snapshot.docChanges

			for(let i=0;i<data.length;i++){
				this.data.push(data[i])
				const DATE = new Date(+data[i].doc.data.value.mapValue.fields.startTimeStamp.integerValue).toLocaleString()


				document.querySelector("#main-table tbody").insertAdjacentHTML('beforeend', 
							`<tr id='result-${this.data.length-1}' data-index=${this.data.length-1}>
								<th>${this.data.length}曲目</th>
								<th>${data[i].doc.data.value.mapValue.fields.title.stringValue}</th>
								<th>${DATE}</th>
							</tr>`)
			}
		  });

		  this.addTableEvent()
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


class DeleteCollection {

	
//firebaseのサイトにあるコード（少し改修）
static deleteCollection (db, collectionRef, batchSize){
    const query = collectionRef.orderBy('__name__').limit(batchSize);
    return new Promise((resolve, reject) => {
        DeleteCollection.deleteQueryBatch(db, query, batchSize, resolve, reject);
    });
}

//削除のメインコード
 static deleteQueryBatch(db, query, batchSize, resolve, reject){
    query.get()
        .then((snapshot) => {

             //検索結果が0件なら処理終わり
            if (snapshot.size == 0) {
                return 0;
            }

             //削除のメイン処理
            const batch = db.batch();
            snapshot.docs.forEach(doc => {
                batch.delete(doc.ref);
            });

             //一旦処理サイズをreturn
            return batch.commit().then(() => {
                return snapshot.size;
            })
        })
        .then((numDeleted) => {

             //もう対象のデータが0なら処理終わり
            if (numDeleted == 0) {
                resolve();
                return;
            }

             //あだあるなら、再度処理
            process.nextTick(() => {
                deleteQueryBatch(db, query, batchSize, resolve, reject);
            });
        })
        .catch(reject);
}


}