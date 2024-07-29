import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function ResetPassword() {
  const { token } = useParams();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const navigate = useNavigate();
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  function validatePassword(password) {
    if (!passwordRegex.test(password)) {
      setPasswordError('Password does not meet the criteria');
    } else {
      setPasswordError('');
    }
  }

  function handlePasswordChange(e) {
    const newPassword = e.target.value;
    setPassword(newPassword);
    validatePassword(newPassword);
  }

  async function resetPassword(e) {
    e.preventDefault();

    if (!password || !confirmPassword) {
      setMessage('Please fill out both password fields');
      return;
    } else if (password !== confirmPassword) {
      setMessage('Passwords do not match');
      return;
    } else if (!passwordRegex.test(password)) {
      setMessage('Password does not meet the criteria');
      return;
    }
    else {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}forgetpassword/${token}`, {
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
      } finally {
        setIsLoading(false);
      }
    }

    setIsLoading(true);

  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-semibold text-center mb-6">Reset Password</h1>
        <form onSubmit={resetPassword} className="space-y-4">
          <input
            value={password}
            onChange={handlePasswordChange}
            type="password"
            placeholder="Enter your new password"
            required
            className={`w-full p-3 border ${passwordError ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:border-indigo-500`}
          />
          {passwordError && (
            <p className="text-red-500 text-sm mt-1">{passwordError}</p>
          )}
          <input
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            type="password"
            placeholder="Confirm your new password"
            required
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
          />
          <input
            type="submit"
            value={isLoading ? 'Resetting...' : 'Reset Password'}
            className="w-full p-3 bg-indigo-600 text-white rounded-lg cursor-pointer hover:bg-indigo-700 transition-colors"
            disabled={isLoading || passwordError}
          />
        </form>
        {message && (
          <p className="mt-4 text-center text-green-600">{message}</p>
        )}
      </div>
    </div>
  );
}

export default ResetPassword;
