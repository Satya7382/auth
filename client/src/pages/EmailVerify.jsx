import { assets } from '../assets/assets';
import { useRef, useContext, useEffect } from 'react';
import axios from 'axios';
import { AppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const EmailVerify = () => {
  const inputsRef = useRef([]);
  const navigate = useNavigate();
  const { userData,isLoggedIn, backend_Url, getUserData } = useContext(AppContext);
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

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      const otp = inputsRef.current.map((input) => input.value).join('');
      const { data } = await axios.post(
        `${backend_Url}/api/auth/verify-account`,
        { otp },
        { withCredentials: true }
      );
      if (data.success) {
        toast.success(data.message);
        await getUserData();
        navigate('/');
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  useEffect(() => {
      if (isLoggedIn && userData && userData.isAccountVerified) {
        navigate('/');
      }
  }, [isLoggedIn,userData]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-500 to-purple-500 px-6 sm:px-0">
      <img
        onClick={() => navigate('/')}
        src={assets.logo}
        alt="logo"
        className="absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer"
      />

      <form
        onSubmit={onSubmitHandler}
        className="bg-slate-900 p-10 rounded-lg shadow-lg w-full sm:w-96 text-indigo-300 text-sm"
      >
        <h1 className="text-2xl font-semibold text-white text-center mb-3">
          Email Verify OTP
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
          Verify Email
        </button>
        
      </form>
    </div>
  );
};

export default EmailVerify;