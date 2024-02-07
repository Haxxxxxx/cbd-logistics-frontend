import React, { useState } from 'react';
import { signUp } from '../firebase/authservice'; // Make sure to import signUp

function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState(''); // State for name
  const [surname, setSurname] = useState(''); // State for surname
  const [passwordVerification, setPasswordVerification] = useState(''); // State for password verification

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation for password verification
    if (password !== passwordVerification) {
      console.error("Passwords do not match.");
      return; // Stop the form submission if passwords do not match
    }

    console.log("Attempting to sign up with:", email, password, name, surname); // Log the credentials
    try {
      await signUp(email, password, name, surname); // Adjust signUp to handle name and surname if necessary
      // Handle successful sign up, e.g., redirecting to a dashboard or showing a success message
    } catch (error) {
      // Handle sign up errors
      console.error("Registration error:", error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Name"
      />
      <input
        type="text"
        value={surname}
        onChange={(e) => setSurname(e.target.value)}
        placeholder="Surname"
      />
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />
      <input
        type="password"
        value={passwordVerification}
        onChange={(e) => setPasswordVerification(e.target.value)}
        placeholder="Verify Password"
      />
      <button type="submit">Sign Up</button>
    </form>
  );
}

export default SignUp;
