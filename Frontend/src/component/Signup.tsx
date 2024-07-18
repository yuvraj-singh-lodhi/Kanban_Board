import React, { useState, FormEvent } from 'react';
import { signupUser } from '../services/api'; // Import signupUser function

function SignupPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSignup = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Validate passwords match
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      await signupUser(username, email, password); // Pass username to signupUser function
      console.log('User signed up successfully');
    } catch (error) {
      console.error('Signup error:', error);
      setError('Signup failed. Please try again.');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-mainBackgroundColor text-white">
      <h2 className="text-5xl font-bold mb-8">Sign Up</h2>
      <form
        onSubmit={handleSignup}
        className="bg-gray-200 rounded-lg p-10 flex flex-col gap-6 w-1/3"
      >
        <input
          type="text"
          placeholder="Username"
          className="p-4 rounded-md text-lg text-black bg-white"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email"
          className="p-4 rounded-md text-lg text-black bg-white"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="p-4 rounded-md text-lg text-black bg-white"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Confirm Password"
          className="p-4 rounded-md text-lg text-black bg-white"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        {error && <p className="text-red-500">{error}</p>}
        <button
          type="submit"
          className="
            bg-columnBackgroundColor
            text-white
            py-3
            text-lg
            rounded-lg
            hover:bg-opacity-80
            cursor-pointer
          "
        >
          Sign Up
        </button>
      </form>
    </div>
  );
}

export default SignupPage;
