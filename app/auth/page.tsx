'use client';

import React, { useState } from 'react';
import { loginAction, registerAction } from '../actions/auth'; 
import { HiEye, HiEyeOff } from 'react-icons/hi';
import { CgSpinner } from 'react-icons/cg'; 
import { useSearchParams } from 'next/navigation'; 

interface InputFieldProps {
  label: string;
  name: string;
  type?: string;
  placeholder: string;
  required?: boolean;
  isPassword?: boolean;
  showPassword?: boolean;
  togglePassword?: () => void;
}

const InputField = ({
  label,
  name,
  type = 'text',
  placeholder,
  required = true,
  isPassword = false,
  showPassword = false,
  togglePassword,
}: InputFieldProps) => (
  <div className="space-y-1">
    <label className="block text-sm font-bold ml-1 text-[#2e385b]">{label}</label>
    <div className="relative">
      <input
        name={name}
        type={isPassword ? (showPassword ? 'text' : 'password') : type}
        placeholder={placeholder}
        required={required}
        className="w-full p-4 rounded-xl border border-gray-300 bg-white text-gray-900 placeholder-gray-400 font-medium focus:ring-2 focus:ring-[#2e385b] focus:border-transparent outline-none transition-all shadow-sm"
      />
      {isPassword && togglePassword && (
        <button
          type="button"
          onClick={togglePassword}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#2e385b] transition-colors"
          tabIndex={-1} 
        >
          {showPassword ? <HiEyeOff size={22} /> : <HiEye size={22} />}
        </button>
      )}
    </div>
  </div>
);

const AuthPage = () => {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/'; 

  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setErrorMessage(null);
    setShowPassword(false);
    setShowConfirmPassword(false);
  };

  async function handleOnSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); 
    setIsLoading(true);
    setErrorMessage(null);

    const formData = new FormData(event.currentTarget);

    if (!isLogin) {
      const pass = formData.get('password') as string;
      const confirmPass = formData.get('confirmPassword') as string;
      if (pass !== confirmPass) {
        setErrorMessage("Password dan Konfirmasi Password tidak cocok!");
        setIsLoading(false);
        return;
      }
    }

    try {
      const actionToCall = isLogin ? loginAction : registerAction;
      const result = await actionToCall(formData);
      if (result?.error) {
        setErrorMessage(result.error);
      } 
    } catch (error) {
      setErrorMessage("Terjadi kesalahan sistem. Silakan coba lagi.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#f3f4f6] flex items-center justify-center p-4 font-sans">
      <div className="bg-white w-full max-w-lg p-8 md:p-10 rounded-3xl shadow-xl border border-gray-100">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-extrabold text-[#2e385b] mb-3">
            {isLogin ? 'Welcome Back!' : 'Create Account'}
          </h1>
          <p className="text-gray-500 text-sm font-medium">
            {isLogin ? 'Masuk untuk melanjutkan pembelajaranmu' : 'Daftar sekarang dan mulai belajar skill baru'}
          </p>
        </div>

        {errorMessage && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm font-bold rounded-r-lg animate-pulse">
            ⚠️ {errorMessage}
          </div>
        )}

        <form onSubmit={handleOnSubmit} className="space-y-5">
          {/* INPUT HIDDEN UNTUK CALLBACK URL */}
          <input type="hidden" name="callbackUrl" value={callbackUrl} />

          {!isLogin && (
            <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InputField label="First Name" name="firstName" placeholder="John" />
                    <InputField label="Last Name" name="lastName" placeholder="Doe" />
                </div>
                <div className="space-y-1">
                    <label className="block text-sm font-bold ml-1 text-[#2e385b]">Profile Picture (Optional)</label>
                    <input 
                        type="file" 
                        name="image" 
                        accept="image/*"
                        className="w-full p-3 rounded-xl border border-gray-300 bg-white text-gray-500 text-sm 
                                   file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 
                                   file:text-sm file:font-bold file:bg-[#2e385b] file:text-white 
                                   hover:file:bg-[#232b47] cursor-pointer"
                    />
                </div>
            </>
          )}

          <InputField label="Email Address" name="email" type="email" placeholder="name@example.com" />
          <InputField label="Password" name="password" placeholder="Enter your password" isPassword={true} showPassword={showPassword} togglePassword={() => setShowPassword(!showPassword)} />

          {!isLogin && (
            <InputField label="Confirm Password" name="confirmPassword" placeholder="Repeat your password" isPassword={true} showPassword={showConfirmPassword} togglePassword={() => setShowConfirmPassword(!showConfirmPassword)} />
          )}

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full py-4 bg-[#2e385b] text-white rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl hover:bg-[#232b47] hover:-translate-y-1 transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2 mt-4"
          >
            {isLoading && <CgSpinner className="animate-spin text-xl" />}
            {isLoading ? 'Processing...' : (isLogin ? 'Login' : 'Sign Up')}
          </button>

          <p className="text-center text-sm text-gray-500 font-medium pt-2">
            {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
            <button type="button" onClick={toggleMode} className="text-[#2e385b] font-extrabold hover:underline underline-offset-4 ml-1 transition-colors">
              {isLogin ? 'Sign Up' : 'Sign In'}
            </button>
          </p>
        </form>
      </div>
    </div>
  );
};

export default AuthPage;