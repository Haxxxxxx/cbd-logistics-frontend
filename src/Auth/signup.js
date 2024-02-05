import React, { useState } from 'react';
import { signUp } from '../firebase/authservice'; // Make sure to import signUp

function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Attempting to sign up with:", email, password); // Log the credentials
    try {
      await signUp(email, password); // Use the signUp function
      // Handle successful sign up, e.g., redirecting to a dashboard or showing a success message
    } catch (error) {
      // Handle sign up errors
      console.error("Registration error:", error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
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
      <button type="submit">Sign Up</button>
    </form>
  );
}

export default SignUp;
