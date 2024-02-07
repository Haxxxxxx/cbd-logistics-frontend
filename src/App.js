import React, { useEffect, useState } from 'react';
import { deleteUserAccount, authStateChange, signOut } from './firebase/authservice';
import SignIn from './Auth/signin';
import SignUp from './Auth/signup'; // Ensure you have created this component
import EditProfile from './profile/editprofile';
import ProjectsDashboard from './Dashboard/dashboard'; // Import the ProjectsDashboard component

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [showSignUp, setShowSignUp] = useState(false); // New state to toggle between SignIn and SignUp

  useEffect(() => {
    const unsubscribe = authStateChange(user => {
      setCurrentUser(user);
    });

    return () => unsubscribe(); // Cleanup subscription on unmount
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut();
      // Handle successful sign out
    } catch (error) {
      // Handle sign out errors
      console.error("Sign out error:", error);
    }
  };

  const toggleSignUp = () => setShowSignUp(!showSignUp); // Toggle between sign in and sign up

  return (
    <div>
      {currentUser ? (
        <div>
          <p>Welcome, {currentUser.displayName || currentUser.email}</p>
          
          <EditProfile user={currentUser} />
          <ProjectsDashboard user={currentUser} /> {/* Add this line to display the projects dashboard */}
          <button onClick={handleSignOut}>Sign Out</button>
        </div>
      ) : (
        <>
          {showSignUp ? <SignUp /> : <SignIn />}
          <button onClick={toggleSignUp}>
            {showSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
          </button>
        </>
      )}
    </div>
  );
}

export default App;
