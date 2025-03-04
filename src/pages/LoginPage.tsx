import React from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { login } from '../api/auth';
import { useAuthStore } from '../store/authStore';

interface LoginFormData {
  email: string;
  password: string;
}

const LoginPage: React.FC = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>();
  const navigate = useNavigate();
  const location = useLocation();
  const { setAuth } = useAuthStore();
  
  // Get the redirect path from location state or default to home
  const from = location.state?.from?.pathname || '/';
  
  const loginMutation = useMutation({
    mutationFn: (data: LoginFormData) => login(data.email, data.password),
    onSuccess: (data) => {
      setAuth(data.user, data.accessToken, data.refreshToken);
      toast.success('Login successful!');
      navigate(from, { replace: true });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Login failed. Please try again.');
    },
  });
  
  const onSubmit = (data: LoginFormData) => {
    loginMutation.mutate(data);
  };
  
  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-6">
        <h2 className="text-2xl font-bold text-center mb-6">Login to Your Account</h2>
        
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 font-medium mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              {...register('email', { 
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address',
                }
              })}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                errors.email ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Your email"
            />
            {errors.email && (
              <p className="mt-1 text-red-500 text-sm">{errors.email.message}</p>
            )}
          </div>
          
          <div className="mb-6">
            <label htmlFor="password" className="block text-gray-700 font-medium mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              {...register('password', { required: 'Password is required' })}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                errors.password ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Your password"
            />
            {errors.password && (
              <p className="mt-1 text-red-500 text-sm">{errors.password.message}</p>
            )}
          </div>
          
          <button
            type="submit"
            disabled={loginMutation.isPending}
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-70"
          >
            {loginMutation.isPending ? 'Logging in...' : 'Login'}
          </button>
        </form>
        
        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Don't have an account?{' '}
            <Link to="/register" className="text-indigo-600 hover:text-indigo-800">
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;