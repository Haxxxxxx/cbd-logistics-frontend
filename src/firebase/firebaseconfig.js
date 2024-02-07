// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, collection, addDoc, doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { getStorage, ref, uploadBytes } from 'firebase/storage'; // Import Firebase Storage functions

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
const auth = getAuth(app); // Get a reference to the Firebase auth object
const db = getFirestore(app); // Initialize Firestore
const storage = getStorage(app); // Initialize Firebase Storage

async function addProject(userId, projectName) {
  try {
    // Add a new project document with a generated ID to the "projects" collection
    const docRef = await addDoc(collection(db, "projects"), {
      userId,
      projectName,
      files: [] // Initialize an empty array for files
    });
    console.log("Project created with ID: ", docRef.id);
    return docRef.id; // Return the new project's ID for further use
  } catch (error) {
    console.error("Error creating new project: ", error);
    return null;
  }
}

async function uploadCodeFile(file, userId, projectId) {
  const storagePath = `userFiles/${userId}/${projectId}/code/${file.name}`;
  const fileRef = ref(storage, storagePath);

  try {
    await uploadBytes(fileRef, file);
    console.log(`${file.name} uploaded to ${storagePath}`);

    // Update Firestore with the file's metadata
    const projectRef = doc(db, 'projects', projectId);
    await updateDoc(projectRef, {
      files: arrayUnion(file.name)
    });
    console.log(`Firestore updated with metadata for ${file.name}`);
  } catch (error) {
    console.error("Error uploading file and updating Firestore: ", error);
  }
};

export { auth };
