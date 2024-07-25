import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import DOMPurify from 'dompurify';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  function sanitizeInput(input){
    return DOMPurify.sanitize(input);
  }

  function validateFields() {
    const messages = [];

    // Regular expressions for validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    // Check if email and password fields are empty
    if (!email && !password) {
      messages.push('Enter Email & Password');
    } else {
      if (!email) {
        messages.push('Enter Email');
      } else if (!emailRegex.test(email)) {
        messages.push('Invalid Email Format');
      }

      if (!password) {
        messages.push('Enter Password');
      } else if (!passwordRegex.test(password)) {
        messages.push('Password Criteria not met');
      }
    }

    return messages.join(', ');
  }

  async function loginUser(e) {
    e.preventDefault();

    const validationMessage = validateFields();
    if (validationMessage) {
      alert(validationMessage);
      return;
    }

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.status === 429) {
        navigate('/error', { state: { message: 'Too many requests. Please try again later.' } });
        return;
      }
    

      const data = await response.json();
      if (data.user) {
        localStorage.setItem('token', data.user);
        navigate('/dashboard');
      } else {
        alert('Invalid Credentials');
      }
    } catch (error) {
      console.error('Error during login:', error);
      alert('An error occurred. Please try again.');
    }
  }

  return (
    <>
     <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-semibold text-center mb-6">
          Login
        </h1>
        <form onSubmit={loginUser} className="space-y-4">
          <input
            value={email}
            onChange={(e) => setEmail(sanitizeInput(e.target.value))}
            type="email"
            placeholder="Email"
            required
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
          />
          <input
            value={password}
            onChange={(e) => setPassword(sanitizeInput(e.target.value))}
            type="password"
            placeholder="Password"
            required
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
          />
          <input
            type="submit"
            value="Login"
            className="w-full p-3 bg-indigo-600 text-white rounded-lg cursor-pointer hover:bg-indigo-700 transition-colors"
          />
        </form>
        <div className="mt-4 text-center">
          <Link to="/forget-password" className="text-indigo-600 hover:text-indigo-800 text-sm">
            Forgot Password?
          </Link>
        </div>
      </div>
    </div>
    </>
  );
}

export default Login;
