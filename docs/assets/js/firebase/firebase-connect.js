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