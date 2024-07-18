import React, { useState, FormEvent } from 'react';

interface LoginPageProps {
  onLogin: () => void;
}

// eslint-disable-next-line no-empty-pattern
function LoginPage({ }: LoginPageProps) {
  const [Username, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

   
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-mainBackgroundColor text-white">
      <h2 className="text-5xl font-bold mb-8">Login</h2>
      <form
        onSubmit={handleLogin}
        className="bg-gray-200 rounded-lg p-10 flex flex-col gap-6 w-1/3"
      >
        <input
          type="text"
          placeholder="User Name"
          className="p-4 rounded-md text-lg text-black bg-white"
          value={Username}
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
          Login
        </button>
      </form>
    </div>
  );
}

export default LoginPage;
