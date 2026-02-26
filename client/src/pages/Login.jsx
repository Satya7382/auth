import React from 'react'
import { useState } from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import { useContext } from 'react'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'
const Login = () => {
  const navigate = useNavigate();
  const { backend_Url, setIsLoggedIn, getUserData } = useContext(AppContext);
  const [state, setState] = useState('Sign up');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const onSubmitHandler = async (e) => {
    try {
      e.preventDefault();
      if (state === 'Sign up') {
        const { data } = await axios.post(
          `${backend_Url}/api/auth/register`,
          { name, email, password },
          { withCredentials: true }
        );
        if (data.success) {
          toast.success(data.message);
          setIsLoggedIn(true);
          await getUserData();
          navigate('/');
        }
        else {
          toast.error(data.message);
        }
      }
      else {
        const { data } = await axios.post(
          `${backend_Url}/api/auth/login`,
          { email, password },
          { withCredentials: true } 
        );
        if (data.success) {
          toast.success(data.message);
          setIsLoggedIn(true);
          await getUserData();
          navigate('/');
        }
        else {
          toast.error(data.message);
        }
      }
    }
    catch (error) {
      toast.error(error.response?.data?.message || 'An error occurred. Please try again.');
    }
  }
  return (
    <div className='flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-500 to-purple-500 px-6 sm:px-0'>
      <img onClick={() => { navigate('/') }} src={assets.logo} alt="" className='absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer' />
      <div className='bg-slate-900 p-10 rounded-lg shadow-lg w-full sm:w-96 text-indigo-300 text-sm'>
        <h2 className='text-3xl font-semibold text-white text-center mb-3'>{state === 'Sign up' ? 'Create Account' : 'Login'}</h2>
        <p className='text-center text-small mb-4'>{state === 'Sign up' ? 'Create Your Account' : 'Login to your account!'}</p>
        <form onSubmit={onSubmitHandler}>
          {state === 'Sign up' && (<div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-white/20'>
            <img src={assets.person_icon} alt="" />
            <input onChange={e => setName(e.target.value)} value={name} className='bg-transparent outline-none' type="text" placeholder='Full Name' required />
          </div>)}
          <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-white/20'>
            <img src={assets.mail_icon} alt="" />
            <input onChange={e => setEmail(e.target.value)} value={email} className='bg-transparent outline-none w-full' type="email" placeholder='Email' required />
          </div>
          <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-white/20'>
            <img src={assets.lock_icon} alt="" />
            <input onChange={e => setPassword(e.target.value)} value={password} className='bg-transparent outline-none' type="password" placeholder='Password' required />
          </div>
          {state !== 'Sign up' && <p onClick={() => { navigate('/reset-password') }} className='mb-4 text-white-500 cursor-pointer'>Forget Password?</p>}
          <button className='w-full py-2.5 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold hover:from-blue-600 hover:to-purple-600 transition-colors'>{state === 'Sign up' ? 'Create Account' : 'Login'}</button>
        </form>
        {state === 'Sign up' ? (<p className='text-white-500 text-center text-s mt-4'>Already have an account?{' '}<span onClick={() => { setState('Login') }} className='text-blue-400 cursor-pointer underline text-s'>Login here</span></p>) : (<p className='text-white-500 text-center text-s mt-4'>Don't have an account?{' '}<span onClick={() => { setState('Sign up') }} className='text-blue-400 cursor-pointer underline text-s'>Sign up</span></p>)}
      </div>
    </div>
  )
}

export default Login
