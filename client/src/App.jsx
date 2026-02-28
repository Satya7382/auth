import React from 'react'
import './index.css';
import { Routes , Route, Link } from 'react-router-dom';
import EmailVerify from './pages/EmailVerify';
import ResetPassword from './pages/ResetPassword';
import Home from './pages/Home';
import Login from './pages/Login';
import { ToastContainer } from 'react-toastify';
const App = () => {
  return (
    <div>
      <ToastContainer />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route path='/email-verify' element={<EmailVerify />} />
        <Route path='/reset-password' element={<ResetPassword />} />
      </Routes>
    </div>
  )
}

export default App
