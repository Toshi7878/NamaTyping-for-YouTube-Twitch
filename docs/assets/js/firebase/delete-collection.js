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