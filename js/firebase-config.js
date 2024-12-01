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
const app = firebase.initializeApp(firebaseConfig);

// Initialize services and export them globally
window.db = firebase.firestore();

// Enable persistence for offline support
window.db.enablePersistence()
    .catch((err) => {
        if (err.code == 'failed-precondition') {
            // Multiple tabs open, persistence can only be enabled in one tab at a time
            console.log('Persistence failed: Multiple tabs open');
        } else if (err.code == 'unimplemented') {
            // The current browser doesn't support persistence
            console.log('Persistence not supported by browser');
        }
    });
