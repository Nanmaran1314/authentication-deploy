import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DOMPurify from 'dompurify';


function Register() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate();

  function sanitizeInput(input) {
    return DOMPurify.sanitize(input);
  }

  function validateFields() {
    let message = '';

    // Regular expressions for validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (name === '' && email === '' && password === '') {
      message = 'Enter Username, Email & Password';
    } else {
      if (name === '') {
        message += 'Enter Username';
      }
      if (email === '') {
        if (message) message += ', ';
        message += 'Enter Email';
      } else if (!emailRegex.test(email)) {
        if (message) message += ', ';
        message += 'Invalid Email Format';
      }

      // Validate password
      if (password === '') {
        if (message) message += ' and ';
        message += 'Enter Password';
      } else if (!passwordRegex.test(password)) {
        if (message) message += ' and ';
        message += 'Password not met an criteria';
      }
    }

    return message.trim();
  }



  async function registerUser(e) {
    e.preventDefault()

    const isValidation = validateFields();
    if (isValidation) {
      alert(isValidation)
      return;
    }

    const response = await fetch(`${process.env.REACT_APP_API_URL}register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name, email, password
      })
    })

    const data = await response.json()
    // console.log(data)
    if (data.status === 'success') {
      alert("Successful")
      navigate('/login')
    }
    else {
      alert("Check you already have an account")
    }
  }

  return (
    <>
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-semibold text-center mb-6">Register</h1>
        <form onSubmit={registerUser} className="space-y-4">
          <input 
            value={name} 
            onChange={(e) => setName(sanitizeInput(e.target.value))} 
            type="text" 
            placeholder="First Name" 
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
          />
          <input 
            value={email} 
            onChange={(e) => setEmail(sanitizeInput(e.target.value))} 
            type="email" 
            placeholder="Email" 
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
          />
          <input 
            value={password} 
            onChange={(e) => setPassword(sanitizeInput(e.target.value))} 
            type="password" 
            placeholder="Password" 
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
          />
          <input 
            type='submit' 
            value='Register' 
            className="w-full p-3 bg-indigo-600 text-white rounded-lg cursor-pointer hover:bg-indigo-700 transition-colors"
          />
        </form>
      </div>
    </div>
    </>
  );
}

export default Register;
