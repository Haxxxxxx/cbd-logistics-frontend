import React, { useState } from 'react';
import { signIn } from '../firebase/authservice';

function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Attempting to sign in with:", email, password); // Log the credentials
    try {
      await signIn(email, password);
      // Handle successful sign in
    } catch (error) {
      // Handle sign in errors
      console.error("Authentication error:", error.message);
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
      <button type="submit">Sign In</button>
    </form>
  );
}

export default SignIn;
