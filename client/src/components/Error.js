import { useLocation } from 'react-router-dom';

const Error = () => {
  const location = useLocation();
  const { message } = location.state || {};

  return (
    <div>
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md text-center">
        <h1 className="text-3xl font-bold text-red-600 mb-4">
          Read Me...
        </h1>
        <p className="text-gray-600">
          {message || 'An unknown error occurred.'}
        </p>
      </div>
    </div>
    </div>
  );
};

export default Error;
