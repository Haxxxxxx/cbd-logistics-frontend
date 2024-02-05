import React from 'react';
import { useNavigate } from 'react-router-dom'; // If you're using react-router for navigation
import { auth, deleteUserAccount, signOut } from '../firebase/authservice';

function SignOutAndDelete() {
  let navigate = useNavigate(); // For redirecting after actions

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/signin'); // Redirect to sign-in page or home
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  const handleDeleteAccount = async () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      try {
        await deleteUserAccount(auth.currentUser);
        navigate('/signin'); // Redirect as the account is now deleted
      } catch (error) {
        console.error("Error deleting account:", error);
        alert('Failed to delete account. Please try again.');
      }
    }
  };

  return (
    <div>
      <button onClick={handleSignOut}>Sign Out</button>
      <button onClick={handleDeleteAccount} style={{ backgroundColor: 'red', color: 'white' }}>
        Delete My Account
      </button>
    </div>
  );
}

export default SignOutAndDelete;
