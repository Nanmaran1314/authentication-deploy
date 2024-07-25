// VerifyResetCode.js
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DOMPurify from 'dompurify';

function VerifyResetCode() {
    const [email, setEmail] = useState('');
    const [code, setCode] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    function sanitizeInput(input){
        return DOMPurify.sanitize(input);
      }

    async function verifyCode(e) {
        e.preventDefault();

        if (!email || !code) {
            setMessage('Please enter your email and reset code');
            return;
        }

        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}verify-reset-code`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, code }),
            });

            const data = await response.json();

            if (response.ok) {
                setMessage('Reset code is valid');
                navigate(`/reset-password/${code}`); 
            } else {
                setMessage(data.message || 'Verification failed');
            }
        } catch (error) {
            console.error('Error during reset code verification:', error);
            setMessage('An error occurred. Please try again.');
        }
    }

    return (
        <>
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-semibold text-center mb-6">
          Verify Reset Code
        </h1>
        <form onSubmit={verifyCode} className="space-y-4">
          <input
            value={email}
            onChange={(e) => setEmail(sanitizeInput(e.target.value))}
            type="email"
            placeholder="Enter your email"
            required
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
          />
          <input
            value={code}
            onChange={(e) => setCode(sanitizeInput(e.target.value))}
            type="text"
            placeholder="Enter your reset code"
            required
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
          />
          <input
            type="submit"
            value="Verify Code"
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

export default VerifyResetCode;
