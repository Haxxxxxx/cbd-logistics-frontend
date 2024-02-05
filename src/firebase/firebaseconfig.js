// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// Your web app's Firebase configuration

const firebaseConfig = {
  apiKey: "AIzaSyAltS5M_96aRb0tnw1DXrV8t8kbdaBGH3U",
  authDomain: "cbdify-74289.firebaseapp.com",
  projectId: "cbdify-74289",
  storageBucket: "cbdify-74289.appspot.com",
  messagingSenderId: "917354650326",
  appId: "1:917354650326:web:6fefba69efd2e8e4b2c777",
  measurementId: "G-3QPLJ6RMWM"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Get a reference to the Firebase auth object
const auth = getAuth(app);

export { auth };
