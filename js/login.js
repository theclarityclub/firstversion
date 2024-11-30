// Debug logging
console.log('Login script loaded');

// Wait for Firebase to initialize
let firebaseInitialized = false;
const firebaseCheck = setInterval(() => {
    if (window.firebase && firebase.auth) {
        clearInterval(firebaseCheck);
        firebaseInitialized = true;
        console.log('Firebase initialized successfully');
        initializeApp();
    }
}, 100);

// Initialize app after Firebase is ready
function initializeApp() {
    // DOM Elements
    const loginForm = document.getElementById('loginForm');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const togglePasswordBtn = document.querySelector('.toggle-password');
    const googleLoginBtn = document.getElementById('googleSignIn');

    console.log('DOM elements found:', {
        form: !!loginForm,
        email: !!emailInput,
        password: !!passwordInput,
        toggleBtn: !!togglePasswordBtn,
        googleBtn: !!googleLoginBtn
    });

    // Toggle password visibility
    togglePasswordBtn.addEventListener('click', () => {
        console.log('Toggle password clicked');
        const type = passwordInput.type === 'password' ? 'text' : 'password';
        passwordInput.type = type;
        togglePasswordBtn.querySelector('i').classList.toggle('fa-eye');
        togglePasswordBtn.querySelector('i').classList.toggle('fa-eye-slash');
    });

    // Handle form submission
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        console.log('Form submitted');
        
        const email = emailInput.value;
        const password = passwordInput.value;

        // Get submit button reference
        const submitBtn = loginForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;

        try {
            if (!firebaseInitialized) {
                throw new Error('Firebase not initialized');
            }

            // Show loading state
            submitBtn.disabled = true;
            submitBtn.textContent = 'Signing in...';

            try {
                // First try to sign in
                console.log('Attempting email/password sign in');
                await firebase.auth().signInWithEmailAndPassword(email, password);
                console.log('Sign in successful');
            } catch (signInError) {
                // If sign in fails due to user not found, try to create account
                if (signInError.code === 'auth/user-not-found') {
                    console.log('User not found, attempting to create account');
                    submitBtn.textContent = 'Creating account...';
                    const userCredential = await firebase.auth().createUserWithEmailAndPassword(email, password);
                    console.log('Account created successfully:', userCredential);
                    
                    // Create initial user document in Firestore
                    await firebase.firestore().collection('users').doc(userCredential.user.uid).set({
                        email: email,
                        displayName: email.split('@')[0],
                        createdAt: new Date().toISOString(),
                        lastLogin: new Date().toISOString()
                    });
                } else {
                    // If error is not user-not-found, rethrow it
                    throw signInError;
                }
            }
            
            // Redirect to dashboard on success
            window.location.href = 'dashboard.html';
        } catch (error) {
            console.error('Sign in/registration error:', error);
            // Handle specific error cases
            let errorMessage = 'Failed to sign in. Please try again.';
            
            switch (error.code) {
                case 'auth/wrong-password':
                    errorMessage = 'Incorrect password.';
                    break;
                case 'auth/invalid-email':
                    errorMessage = 'Invalid email address.';
                    break;
                case 'auth/too-many-requests':
                    errorMessage = 'Too many failed attempts. Please try again later.';
                    break;
                case 'auth/weak-password':
                    errorMessage = 'Password should be at least 6 characters.';
                    break;
                case 'auth/email-already-in-use':
                    errorMessage = 'An account already exists with this email.';
                    break;
            }
            
            // Show error message
            showError(errorMessage);
        } finally {
            // Reset button state
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.textContent = originalText;
            }
        }
    });

    // Handle Google sign-in using popup
    if (googleLoginBtn) {
        console.log('Adding Google sign-in listener');
        googleLoginBtn.addEventListener('click', async () => {
            console.log('Google sign in clicked');
            try {
                // Show loading state
                googleLoginBtn.disabled = true;
                googleLoginBtn.style.opacity = '0.7';

                if (!firebaseInitialized) {
                    throw new Error('Firebase not initialized');
                }

                // Create Google provider
                const provider = new firebase.auth.GoogleAuthProvider();
                
                // Use popup for sign in
                console.log('Attempting Google sign in with popup');
                const result = await firebase.auth().signInWithPopup(provider);
                console.log('Google sign in successful');
                
                // Create or update user document in Firestore
                if (result.user) {
                    await firebase.firestore().collection('users').doc(result.user.uid).set({
                        email: result.user.email,
                        displayName: result.user.displayName || result.user.email.split('@')[0],
                        photoURL: result.user.photoURL,
                        lastLogin: new Date().toISOString()
                    }, { merge: true });
                }

                // Redirect to dashboard on success
                window.location.href = 'dashboard.html';
            } catch (error) {
                console.error('Google sign in error:', error);
                // Handle Google sign-in errors
                let errorMessage = 'Failed to sign in with Google. Please try again.';
                
                if (error.code === 'auth/popup-closed-by-user') {
                    return; // User closed the popup, no need to show error
                }
                
                showError(errorMessage);
            } finally {
                // Reset button state
                googleLoginBtn.disabled = false;
                googleLoginBtn.style.opacity = '1';
            }
        });
    } else {
        console.error('Google sign-in button not found');
    }

    // Check if user is already signed in
    firebase.auth().onAuthStateChanged((user) => {
        console.log('Auth state changed:', user ? 'User signed in' : 'No user');
        if (user) {
            // User is signed in, redirect to dashboard
            window.location.href = 'dashboard.html';
        }
    });
}

// Helper function to show error messages
function showError(message) {
    console.log('Showing error:', message);
    // Remove any existing error message
    const existingError = document.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }

    // Create and insert error message
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    document.getElementById('loginForm').insertBefore(errorDiv, document.getElementById('loginForm').firstChild);

    // Auto-remove error after 5 seconds
    setTimeout(() => {
        errorDiv.remove();
    }, 5000);
}

// Add error message styling
const style = document.createElement('style');
style.textContent = `
    .error-message {
        background-color: #fee2e2;
        border: 1px solid #ef4444;
        color: #dc2626;
        padding: 0.75rem;
        border-radius: 6px;
        margin-bottom: 1rem;
        font-size: 0.9rem;
        animation: slideIn 0.3s ease-out;
    }

    @keyframes slideIn {
        from {
            transform: translateY(-10px);
            opacity: 0;
        }
        to {
            transform: translateY(0);
            opacity: 1;
        }
    }
`;
document.head.appendChild(style);
