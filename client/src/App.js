import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Register from './components/Register';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import ForgetPassword from './components/ForgetPassword';
import ResetPassword from './components/ResetPassword';
import VerifyResetCode from './components/VerifyResetCode'; 
import Error from './components/Error';
import NotFoundPage from './components/NotFoundPage';
import Main from './components/Main';

function App() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <BrowserRouter>
        <nav className="bg-white shadow-md sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex">
                <Link to="/login" className="text-gray-700 hover:text-indigo-600 px-6 py-5 rounded-md text-lg font-medium">
                  Login
                </Link>
                <Link to="/register" className="text-gray-700 hover:text-indigo-600 px-6 py-5 rounded-md text-lg font-medium">
                  Register
                </Link>
                <Link to="/dashboard" className="text-gray-700 hover:text-indigo-600 px-6 py-5 rounded-md text-lg font-medium">
                  Dashboard
                </Link>
              </div>
            </div>
          </div>
        </nav>

        <main className="flex-grow flex items-center justify-center">
          <Routes>
            <Route path="/" element={<Main/>}/>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/forget-password" element={<ForgetPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
            <Route path="/verify-reset-code" element={<VerifyResetCode />} /> 
            <Route path="/error" element={<Error/>}/>
            <Route path="*" element={<NotFoundPage/>} />
          </Routes>
        </main>
      </BrowserRouter>
    </div>
  );
}

export default App;
