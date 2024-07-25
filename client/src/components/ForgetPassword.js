import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DOMPurify from 'dompurify';


function ForgetPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  
  function sanitizeInput(input){
    return DOMPurify.sanitize(input);
  }

  async function requestPasswordReset(e) {
    e.preventDefault();

    if (!email) {
      setMessage('Please enter your email');
      return;
    }

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}forgetpassword`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({email}),
      });

      if (response.status === 429) {
        navigate('/error', { state: { message: 'You have reached a limit, please try again after an hour' } });
        return;
      }
    

      const data = await response.json();
      
      if (response.ok) {
        alert('Your validation code has been sent to your email');
        navigate('/verify-reset-code'); 
      } else {
        setMessage(data.message || 'Password reset request failed');
      }
    } catch (error) {
      // console.error('Error during password reset request:', error);
      setMessage(`An error occurred. Please try again.+${error}`);
    }
  }

  return (
    <>
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-semibold text-center mb-6">
          Forgot Password
        </h1>
        <form onSubmit={requestPasswordReset} className="space-y-4">
          <input
            value={email}
            onChange={(e) => setEmail(sanitizeInput(e.target.value))}
            type="email"
            placeholder="Enter your email"
            required
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
          />
          <input
            type="submit"
            value="Request Password Reset"
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

export default ForgetPassword;
