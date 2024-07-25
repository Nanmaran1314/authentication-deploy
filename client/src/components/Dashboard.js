import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

function Dashboard() {
  const [name, setName] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const user = jwtDecode(token);
        if (user) {
          fetch(`${process.env.REACT_APP_API_URL}dashboard`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          })
            .then(response => response.json())
            .then(data => {
              if (data.status === 'success') {
                setName(data.name);
              } else {
                localStorage.removeItem('token');
                navigate('/login');
              }
            })
            .catch(() => {
              localStorage.removeItem('token');
              navigate('/login');
            });
        } else {
          localStorage.removeItem('token');
          navigate('/login');
        }
      } catch (error) {
        localStorage.removeItem('token');
        navigate('/login');
      }
    } else {
      navigate('/login');
    }
  }, [navigate]);

  function handleLogout() {
    localStorage.removeItem('token');
    navigate('/login');
  }

  return (
    <>
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md text-center">
          <h1 className="text-2xl font-semibold text-center mb-6">
            Hello,  <span className="text-red-500">{name}</span> 
          </h1>
          <button
            onClick={handleLogout}
            className="w-full p-3 bg-red-600 text-white rounded-lg cursor-pointer hover:bg-red-700 transition-colors"
          >
            Logout
          </button>
        </div>
      </div>
    </>
  );
}

export default Dashboard;
