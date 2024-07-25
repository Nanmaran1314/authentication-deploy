// ResetPassword.js
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DOMPurify from 'dompurify';

function ResetPassword() {
  const { token } = useParams();
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  function sanitizeInput(input){
    return DOMPurify.sanitize(input);
  }

  async function resetPassword(e) {
    e.preventDefault();

    if (!password) {
      setMessage('Please enter your new password');
      return;
    }

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/forgetpassword/${token}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();
      setMessage(data.message || 'Password reset successful');

      if (response.ok) {
        navigate('/login'); 
      }
    } catch (error) {
      console.error('Error during password reset:', error);
      setMessage('An error occurred. Please try again.');
    }
  }

  return (
    <>
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-semibold text-center mb-6">
          Reset Password
        </h1>
        <form onSubmit={resetPassword} className="space-y-4">
          <input
            value={password}
            onChange={(e) => setPassword(sanitizeInput(e.target.value))}
            type="password"
            placeholder="Enter your new password"
            required
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
          />
          <input
            type="submit"
            value="Reset Password"
            className="w-full p-3 bg-indigo-600 text-white rounded-lg cursor-pointer hover:bg-indigo-700 transition-colors"
          />
        </form>
        {message && (
          <p className="mt-4 text-center text-green-600">
            {message}
          </p>
        )}
      </div>
    </div>
    </>
  );
}

export default ResetPassword;
