// Authentication logic for Chrome extension
// Using Firebase CDN with standard script loading (no modules needed)

let currentMode = 'signin'; // 'signin' or 'signup'

// Wait for Firebase to load
window.addEventListener('load', () => {
  console.log('Auth page loaded');

  const signinTab = document.getElementById('signinTab');
  const signupTab = document.getElementById('signupTab');
  const authForm = document.getElementById('authForm');
  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');
  const confirmPasswordInput = document.getElementById('confirmPassword');
  const confirmPasswordGroup = document.getElementById('confirmPasswordGroup');
  const submitBtn = document.getElementById('submitBtn');
  const errorMessage = document.getElementById('errorMessage');
  const loadingIndicator = document.getElementById('loadingIndicator');

  console.log('Elements found:', { signinTab, signupTab, authForm });

  // Check if user is already logged in
  if (window.auth) {
    firebase.auth().onAuthStateChanged(async (user) => {
      if (user) {
        console.log('User already logged in:', user.email);
        // User is signed in, get token and redirect to popup
        const token = await user.getIdToken();

        // Store auth state in Chrome storage
        chrome.storage.local.set({
          authUser: {
            uid: user.uid,
            email: user.email,
            token: token,
            timestamp: Date.now()
          }
        }, () => {
          // Redirect to popup
          window.location.href = 'popup.html';
        });
      }
    });
  }

  // Tab switching
  signinTab.addEventListener('click', (e) => {
    e.preventDefault();
    console.log('Sign in tab clicked');
    switchMode('signin');
  });

  signupTab.addEventListener('click', (e) => {
    e.preventDefault();
    console.log('Sign up tab clicked');
    switchMode('signup');
  });

  function switchMode(mode) {
    console.log('Switching to mode:', mode);
    currentMode = mode;

    if (mode === 'signin') {
      signinTab.classList.add('active');
      signupTab.classList.remove('active');
      confirmPasswordGroup.style.display = 'none';
      confirmPasswordInput.removeAttribute('required');
      submitBtn.textContent = 'Sign In';
      passwordInput.setAttribute('autocomplete', 'current-password');
    } else {
      signupTab.classList.add('active');
      signinTab.classList.remove('active');
      confirmPasswordGroup.style.display = 'block';
      confirmPasswordInput.setAttribute('required', '');
      submitBtn.textContent = 'Create Account';
      passwordInput.setAttribute('autocomplete', 'new-password');
    }

    hideError();
  }

  // Form submission
  authForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    hideError();

    const email = emailInput.value.trim();
    const password = passwordInput.value;
    const confirmPassword = confirmPasswordInput.value;

    console.log('Form submitted, mode:', currentMode);

    // Validation
    if (!email || !password) {
      showError('Please fill in all fields');
      return;
    }

    if (currentMode === 'signup' && password !== confirmPassword) {
      showError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      showError('Password must be at least 6 characters');
      return;
    }

    // Show loading
    setLoading(true);

    try {
      if (currentMode === 'signup') {
        console.log('Creating user with email:', email);
        await firebase.auth().createUserWithEmailAndPassword(email, password);
      } else {
        console.log('Signing in with email:', email);
        await firebase.auth().signInWithEmailAndPassword(email, password);
      }
      // Auth state change listener will handle redirect
    } catch (error) {
      console.error('Authentication error:', error);
      setLoading(false);

      // User-friendly error messages
      let errorMsg = 'Authentication failed. Please try again.';

      if (error.code === 'auth/email-already-in-use') {
        errorMsg = 'This email is already registered. Please sign in.';
      } else if (error.code === 'auth/invalid-email') {
        errorMsg = 'Invalid email address';
      } else if (error.code === 'auth/user-not-found') {
        errorMsg = 'No account found with this email';
      } else if (error.code === 'auth/wrong-password') {
        errorMsg = 'Incorrect password';
      } else if (error.code === 'auth/weak-password') {
        errorMsg = 'Password is too weak';
      } else if (error.code === 'auth/invalid-credential') {
        errorMsg = 'Invalid email or password';
      } else if (error.code === 'auth/network-request-failed') {
        errorMsg = 'Network error. Please check your connection.';
      }

      showError(errorMsg);
    }
  });

  function showError(message) {
    errorMessage.textContent = message;
    errorMessage.style.display = 'block';
  }

  function hideError() {
    errorMessage.style.display = 'none';
  }

  function setLoading(isLoading) {
    if (isLoading) {
      authForm.style.display = 'none';
      loadingIndicator.style.display = 'block';
    } else {
      authForm.style.display = 'flex';
      loadingIndicator.style.display = 'none';
    }
  }
});
