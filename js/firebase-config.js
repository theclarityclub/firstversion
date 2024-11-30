// Initialize Firebase with config
const firebaseConfig = {
    apiKey: "AIzaSyDNDlFpmLp13NmBYGGbBuzx8ZXUhHtyt0k",
    authDomain: "theclarityclub-e40c3.firebaseapp.com",
    projectId: "theclarityclub-e40c3",
    storageBucket: "theclarityclub-e40c3.firebasestorage.app",
    messagingSenderId: "105761536403",
    appId: "1:105761536403:web:c187668b95c8c23b809066",
    measurementId: "G-0QVFQV2MTP"
};

// Initialize Firebase
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

// Initialize services and export them globally
window.db = firebase.firestore();
window.auth = firebase.auth();
