import React, { useState, useEffect } from 'react';
import { uploadProfilePicture, updateUserProfile, deleteUserAccount } from '../firebase/authservice';
import { deleteObject, ref, getStorage, listAll, getDownloadURL, uploadBytes   } from 'firebase/storage'; // Import Firebase Storage functions


function EditProfile({ user }) {
  const [displayName, setDisplayName] = useState(user.displayName || '');
  const [photoURL, setPhotoURL] = useState(user.photoURL || '');
  const [photos, setPhotos] = useState([]); // State to hold the list of photo URLs
  const [photo, setPhoto] = useState(null);
  useEffect(() => {
    setPhotoURL(user.photoURL || '');
    fetchPhotos();
  }, [user.photoURL]);

  const uploadProfilePicture = async (file, userId) => {
    const storage = getStorage();
    // Ensure the path is correctly specified for the user's photo
    const storageRef = ref(storage, `profilePictures/${userId}/${file.name}`);
  
    try {
      const uploadResult = await uploadBytes(storageRef, file);
      return uploadResult; // This should include the reference (.ref) to the uploaded file
    } catch (error) {
      console.error("Error uploading profile picture:", error);
      throw error; // Rethrow or handle as needed
    }
  };

  const fetchPhotos = () => {
    const storage = getStorage();
    // Use the actual user ID in the path
    const storageRef = ref(storage, `profilePictures/${user.uid}`);
  
    listAll(storageRef)
      .then((res) => {
        const urlsPromises = res.items.map((itemRef) =>
          getDownloadURL(itemRef) // Correctly handle async URL retrieval
        );
        Promise.all(urlsPromises).then((urls) => {
          setPhotos(urls);
        });
      })
      .catch((error) => {
        console.error("Error fetching photos:", error);
      });
  };
  

  // Function to extract the file path from the full URL for deletion
  const extractStoragePathFromURL = (fullURL) => {
    const urlPattern = /^https:\/\/firebasestorage\.googleapis\.com\/v0\/b\/[^/]+\/o\/(.+?)(\?alt=media&token=.+)?$/;
    const match = fullURL.match(urlPattern);
    if (match) {
      return decodeURIComponent(match[1]);
    }
    return null;
  };

  const handleDeletePhoto = async () => {
    if (photoURL) {
      // Extract the storage path without the domain and query parameters
      const filePath = extractStoragePathFromURL(photoURL).split('?')[0]; // Remove query parameters if present
      if (filePath) {
        const storage = getStorage();
        const storageRef = ref(storage, filePath);
        try {
          await deleteObject(storageRef);
          await updateUserProfile(user, { displayName, photoURL: null });
          setPhotoURL(null);
  
          // Update the photos state to remove the deleted photo
          const updatedPhotos = photos.filter(url => url !== photoURL);
          setPhotos(updatedPhotos); // Update the state with the filtered photos
  
        } catch (error) {
          console.error('Error deleting photo:', error);
          // Properly handle the error
        }
      } else {
        console.error('Invalid photo URL format.');
      }
    }
  };
  

  // Function to handle file selection
  const handlePhotoChange = (event) => {
    if (event.target.files[0]) {
      setPhoto(event.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let newPhotoURL = photoURL;
  
    if (photo) {
      try {
        const uploadResult = await uploadProfilePicture(photo, user.uid); // Ensure this returns the upload task result
        if (uploadResult) {
          const uploadedPhotoRef = uploadResult.ref; // Get the reference from the upload result
          newPhotoURL = await getDownloadURL(uploadedPhotoRef); // Obtain the download URL from the reference
          await updateUserProfile(user, { displayName, photoURL: newPhotoURL });
          setPhotoURL(newPhotoURL); // Update component state with the new photo URL
          fetchPhotos(); // Optionally refetch photos to update the UI
        } else {
          console.error('No upload result, unable to get photo reference.');
        }
      } catch (error) {
        console.error('Error updating profile:', error);
      }
    } else {
      // If no new photo was selected but other profile details were updated
      try {
        await updateUserProfile(user, { displayName, photoURL: newPhotoURL });
      } catch (error) {
        console.error('Error updating profile:', error);
      }
    }
  };
  // Add this function to handle account deletion
const handleDeleteAccount = async () => {
  const confirmDelete = window.confirm("Are you sure you want to delete your account? This action cannot be undone.");
  if (confirmDelete) {
    try {
      // Assuming deleteUserAccount is imported and correctly set up to delete the current user
      await deleteUserAccount();
      alert("Your account has been successfully deleted.");
      // Perform any additional clean-up here, e.g., redirecting the user
    } catch (error) {
      console.error("Error deleting account:", error);
      alert("There was an error deleting your account. Please try again.");
    }
  }
};
  
  

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          placeholder="Display Name"
        />
        <input
          type="text"
          value={photoURL}
          onChange={(e) => setPhotoURL(e.target.value)}
          placeholder="Photo URL"
        />
        <input type="file" onChange={handlePhotoChange} />
        <button type="submit">Update Profile</button>
      </form>

      {photoURL && (
        <div>
          <h2>Profile Photo:</h2>
          <img src={photoURL} alt="Profile" />
          <button onClick={handleDeletePhoto}>Delete Photo</button>
        </div>
      )}
      <div>
        {photos.map((photoUrl, index) => (
          <img key={index} src={photoUrl} alt="User Photo" style={{ width: 100, height: 100, cursor: 'pointer' }} onClick={() => setPhotoURL(photoUrl)} />
        ))}
      </div>
      <button onClick={handleDeleteAccount} style={{ backgroundColor: 'red', color: 'white', marginTop: '10px' }}>
      Delete My Account
    </button>
  </div>
  );
}

export default EditProfile;
