import { useNavigate } from 'react-router-dom';
import { assets } from '../assets/assets';
import axios from 'axios';
import { toast } from 'react-toastify';
import { AppContext } from '../context/AppContext';
import { useRef, useState, useContext, useEffect } from 'react';
const ResetPassword = () => {
  const { backend_Url } = useContext(AppContext);
  axios.defaults.withCredentials = true;
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const inputsRef = useRef([]);
  const [newPassword, setNewPassword] = useState('');
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [isOtpSubmitted, setIsOtpSubmitted] = useState(false);

  const onSubmitemail = async (e) => {
    e.preventDefault();

    try {
      const { data } = await axios.post(`${backend_Url}/api/auth/send-reset-otp`, { email } , {withCredentials : true});

      if (data.success) {
        toast.success(data.message || 'Reset OTP sent to your email.');
        setIsEmailSent(true);
      } else {
        toast.error(data.message || 'Error sending reset OTP.');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Something went wrong');
    }
  };

  const onSubmitOtp = async (e) => {
    e.preventDefault();
    try {
      const otp = inputsRef.current.map((input) => input.value).join('');
      if (otp.split('').some((digit) => digit === '')) {
        toast.error('Please enter complete OTP');
        return;
      }
      setOtp(otp);
      setIsOtpSubmitted(true);
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  const onSubmitNewPassword = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(`${backend_Url}/api/auth/reset-password`, { email, otp, newPassword }, {withCredentials : true});

      if (data.success) {
        toast.success(data.message || 'Password reset successful. Please log in with your new password.');
        navigate('/login');
      } else {
        toast.error(data.message || 'Error resetting password.');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Something went wrong');
    }
  };

  const handleChange = (e, index) => {
    const value = e.target.value;
    if (!/^[0-9]?$/.test(value)) return;
    if (value && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !e.target.value && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  useEffect(() => {
    if (isEmailSent && !isOtpSubmitted) {
      inputsRef.current[0]?.focus();
    }
  }, [isEmailSent, isOtpSubmitted]);

  const handlePaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text').slice(0, 6);
    pasteData.split('').forEach((char, index) => {
      if (/^[0-9]$/.test(char) && inputsRef.current[index]) {
        inputsRef.current[index].value = char;
      }
    });
    const nextIndex = Math.min(pasteData.length, 5);
    inputsRef.current[nextIndex]?.focus();
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-500 to-purple-500 px-6 sm:px-0">
      <img
        onClick={() => navigate('/')}
        src={assets.logo}
        alt="logo"
        className="absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer"
      />
      {!isEmailSent && (
        <form
          onSubmit={onSubmitemail}
          className="bg-slate-900 p-10 rounded-lg shadow-lg w-full sm:w-96 text-indigo-300 text-sm"
        >
          <h1 className="text-2xl font-semibold text-white text-center mb-3">
            Reset Password
          </h1>

          <p className="text-center text-sm mb-4">
            Enter the registered email
          </p>
          <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]'>
            <img src={assets.mail_icon} alt="" className='w-3 h-3' />
            <input type="email" placeholder='Enter your email' className='bg-transparent outline-none w-full text-sm text-indigo-300' value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <button
            type="submit"
            className="w-full py-2 mt-4 bg-purple-600 text-white rounded-full hover:bg-blue-700 transition"
          >
            Send Reset Otp
          </button>
        </form>
      )}

      {isEmailSent && !isOtpSubmitted && (
        <form
          onSubmit={onSubmitOtp}
          className="bg-slate-900 p-10 rounded-lg shadow-lg w-full sm:w-96 text-indigo-300 text-sm"
        >
          <h1 className="text-2xl font-semibold text-white text-center mb-3">
            Reset Password OTP
          </h1>

          <p className="text-center text-sm mb-4">
            Enter the 6 digit OTP sent to your email
          </p>

          <div className="flex justify-between mb-8">
            {Array(6)
              .fill(0)
              .map((_, index) => (
                <input
                  key={index}
                  ref={(el) => (inputsRef.current[index] = el)}
                  type="text"
                  maxLength="1"
                  required
                  inputMode="numeric"
                  pattern="[0-9]*"
                  onFocus={(e) => e.target.select()}
                  onChange={(e) => handleChange(e, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  onPaste={handlePaste}
                  className="w-10 h-10 text-center text-lg rounded border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              ))}
          </div>

          <button
            type="submit"
            className="w-full py-2 mt-4 bg-purple-600 text-white rounded-full hover:bg-blue-700 transition"
          >
            Submit
          </button>
        </form>
      )}

      {isEmailSent && isOtpSubmitted && (
        <form
          onSubmit={onSubmitNewPassword}
          className="bg-slate-900 p-10 rounded-lg shadow-lg w-full sm:w-96 text-indigo-300 text-sm"
        >
          <h1 className="text-2xl font-semibold text-white text-center mb-3">
            New Password
          </h1>

          <p className="text-center text-sm mb-4">
            Enter your new password
          </p>
          <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]'>
            <img src={assets.lock_icon} alt="" className='w-3 h-3' />
            <input type="password" placeholder='Enter your new password' className='bg-transparent outline-none w-full text-sm text-indigo-300' value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
          </div>
          <button
            type="submit"
            className="w-full py-2 mt-4 bg-purple-600 text-white rounded-full hover:bg-blue-700 transition"
          >
            Submit
          </button>
        </form>
      )}
    </div>
  )
}

export default ResetPassword
