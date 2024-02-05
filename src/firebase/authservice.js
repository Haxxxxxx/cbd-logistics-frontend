import { signInWithEmailAndPassword, signOut as firebaseSignOut, onAuthStateChanged, createUserWithEmailAndPassword, updateProfile, deleteUser } from 'firebase/auth';
import { auth } from './firebaseconfig';
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';

export const signIn = (email, password) => {
  return signInWithEmailAndPassword(auth, email, password);
};

export const signUp = (email, password) => {
  return createUserWithEmailAndPassword(auth, email, password);
};

export const signOut = () => {
  return firebaseSignOut(auth);
};

export const authStateChange = (callback) => {
  return onAuthStateChanged(auth, callback);
};

export const updateUserProfile = (user, { displayName, photoURL }) => {
  return updateProfile(user, { displayName, photoURL });
};

export const uploadProfilePicture = async (file) => {
  if (!file) return null;

  const storage = getStorage();
  // Ensure you create a unique reference for each file upload to prevent overwrites
  const fileRef = storageRef(storage, `profilePictures/${file.name}`);
  
  await uploadBytes(fileRef, file);
  return getDownloadURL(fileRef);
};

// Function to delete the current user
export const deleteUserAccount = async () => {
  try {
    await deleteUser(auth.currentUser);
    console.log('User account deleted successfully');
  } catch (error) {
    console.error('Error deleting user account:', error);
    throw error; // To allow handling in the component
  }
};
