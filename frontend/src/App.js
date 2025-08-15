import { Navigate, Route, Routes } from 'react-router-dom';
import './App.css';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Home from './pages/Home';
import { useState } from 'react';
import RefrshHandler from './RefrshHandler';
import Dashboard from './pages/Dashboard';

<Route path='/home' element={<PrivateRoute element={<Dashboard />} />} />


function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const PrivateRoute = ({ element }) => {
    return isAuthenticated ? element : <Navigate to="/login" />
  }

  return (
    <div className="App">
      {/* This checks token on refresh */}
      <RefrshHandler setIsAuthenticated={setIsAuthenticated} />

      <Routes>
        <Route path='/' element={<Navigate to="/login" />} />

        {/* Pass setIsAuthenticated to Login */}
        <Route path='/login' element={<Login setIsAuthenticated={setIsAuthenticated} />} />
        
        <Route path='/signup' element={<Signup />} />
        
        {/* Protect /home route */}
        <Route path='/home' element={<PrivateRoute element={<Home />} />} />
      </Routes>
    </div>
  );
}

export default App;
