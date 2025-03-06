import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { register as registerUser } from '../api/auth';
import { PersonalInfo, BusinessInfo } from '../types';

const businessTypes = [
  'Corporation',
  'Limited Liability Company (LLC)',
  'Partnership',
  'Sole Proprietorship',
  'Non-Profit Organization',
  'Other'
];

const RegisterPage: React.FC = () => {
  const [step, setStep] = useState(1);
  const navigate = useNavigate();
  
  const {
    register: registerPersonal,
    handleSubmit: handlePersonalSubmit,
    watch: watchPersonal,
    formState: { errors: personalErrors }
  } = useForm<PersonalInfo>();
  
  const {
    register: registerBusiness,
    handleSubmit: handleBusinessSubmit,
    formState: { errors: businessErrors }
  } = useForm<BusinessInfo>();
  
  const [personalData, setPersonalData] = useState<PersonalInfo | null>(null);
  
  const registerMutation = useMutation({
    mutationFn: async (data: FormData) => {
      const response = await registerUser(data);
      return response;
    },
    onSuccess: () => {
      toast.success('Registration request submitted! Please wait for admin approval.');
      navigate('/login');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Registration failed. Please try again.');
    },
  });
  
  const personalPassword = watchPersonal('password');
  
  const onPersonalSubmit = (data: PersonalInfo) => {
    setPersonalData(data);
    setStep(2);
  };
  
  const onBusinessSubmit = async (data: BusinessInfo) => {
    if (!personalData) return;
    
    const formData = new FormData();
    
    // Personal Info
    formData.append('fullName', personalData.fullName);
    formData.append('email', personalData.email);
    formData.append('phoneNumber', personalData.phoneNumber);
    formData.append('password', personalData.password);
    
    // Business Info
    formData.append('businessName', data.businessName);
    formData.append('businessEmail', data.businessEmail);
    formData.append('businessPhone', data.businessPhone);
    formData.append('registrationNumber', data.registrationNumber);
    formData.append('taxId', data.taxId);
    formData.append('businessAddress', data.businessAddress);
    formData.append('website', data.website);
    formData.append('businessType', data.businessType);
    
    if (data.document) {
      formData.append('document', data.document);
    }
    
    registerMutation.mutate(formData);
  };
  
  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
      {/* Progress Bar */}
      <div className="bg-gray-50 px-6 py-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Registration Progress</span>
          <span className="text-sm text-gray-500">Step {step} of 2</span>
        </div>
        <div className="h-2 bg-gray-200 rounded-full">
          <div 
            className="h-full bg-indigo-600 rounded-full transition-all duration-300"
            style={{ width: `${(step / 2) * 100}%` }}
          ></div>
        </div>
      </div>
      
      <div className="p-6">
        <h2 className="text-2xl font-bold text-center mb-6">
          {step === 1 ? 'Personal Information' : 'Business Information'}
        </h2>
        
        {step === 1 ? (
          <form onSubmit={handlePersonalSubmit(onPersonalSubmit)}>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  {...registerPersonal('fullName', { required: 'Full name is required' })}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    personalErrors.fullName ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="John Doe"
                />
                {personalErrors.fullName && (
                  <p className="mt-1 text-red-500 text-sm">{personalErrors.fullName.message}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  {...registerPersonal('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email address',
                    }
                  })}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    personalErrors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="john@example.com"
                />
                {personalErrors.email && (
                  <p className="mt-1 text-red-500 text-sm">{personalErrors.email.message}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  {...registerPersonal('phoneNumber', {
                    required: 'Phone number is required',
                    pattern: {
                      value: /^\+?[1-9]\d{1,14}$/,
                      message: 'Invalid phone number',
                    }
                  })}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    personalErrors.phoneNumber ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="+1234567890"
                />
                {personalErrors.phoneNumber && (
                  <p className="mt-1 text-red-500 text-sm">{personalErrors.phoneNumber.message}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  {...registerPersonal('password', {
                    required: 'Password is required',
                    minLength: {
                      value: 6,
                      message: 'Password must be at least 6 characters',
                    }
                  })}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    personalErrors.password ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="••••••••"
                />
                {personalErrors.password && (
                  <p className="mt-1 text-red-500 text-sm">{personalErrors.password.message}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm Password
                </label>
                <input
                  type="password"
                  {...registerPersonal('confirmPassword', {
                    required: 'Please confirm your password',
                    validate: value => value === personalPassword || 'Passwords do not match',
                  })}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    personalErrors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="••••••••"
                />
                {personalErrors.confirmPassword && (
                  <p className="mt-1 text-red-500 text-sm">{personalErrors.confirmPassword.message}</p>
                )}
              </div>
            </div>
            
            <div className="mt-6 flex justify-end">
              <button
                type="submit"
                className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 flex items-center"
              >
                Next Step
                <ChevronRight size={20} className="ml-2" />
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleBusinessSubmit(onBusinessSubmit)}>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Business Name
                </label>
                <input
                  type="text"
                  {...registerBusiness('businessName', { required: 'Business name is required' })}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    businessErrors.businessName ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Company Name"
                />
                {businessErrors.businessName && (
                  <p className="mt-1 text-red-500 text-sm">{businessErrors.businessName.message}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Business Email
                </label>
                <input
                  type="email"
                  {...registerBusiness('businessEmail', {
                    required: 'Business email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email address',
                    }
                  })}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    businessErrors.businessEmail ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="contact@company.com"
                />
                {businessErrors.businessEmail && (
                  <p className="mt-1 text-red-500 text-sm">{businessErrors.businessEmail.message}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Business Phone
                </label>
                <input
                  type="tel"
                  {...registerBusiness('businessPhone', {
                    required: 'Business phone is required',
                    pattern: {
                      value: /^\+?[1-9]\d{1,14}$/,
                      message: 'Invalid phone number',
                    }
                  })}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    businessErrors.businessPhone ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="+1234567890"
                />
                {businessErrors.businessPhone && (
                  <p className="mt-1 text-red-500 text-sm">{businessErrors.businessPhone.message}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Registration Number
                </label>
                <input
                  type="text"
                  {...registerBusiness('registrationNumber', { required: 'Registration number is required' })}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    businessErrors.registrationNumber ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="REG123456789"
                />
                {businessErrors.registrationNumber && (
                  <p className="mt-1 text-red-500 text-sm">{businessErrors.registrationNumber.message}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tax ID
                </label>
                <input
                  type="text"
                  {...registerBusiness('taxId', { required: 'Tax ID is required' })}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    businessErrors.taxId ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="TAX123456789"
                />
                {businessErrors.taxId && (
                  <p className="mt-1 text-red-500 text-sm">{businessErrors.taxId.message}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Business Address
                </label>
                <input
                  type="text"
                  {...registerBusiness('businessAddress', { required: 'Business address is required' })}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    businessErrors.businessAddress ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="123 Business St, City, Country"
                />
                {businessErrors.businessAddress && (
                  <p className="mt-1 text-red-500 text-sm">{businessErrors.businessAddress.message}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Website
                </label>
                <input
                  type="url"
                  {...registerBusiness('website', {
                    pattern: {
                      value: /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/,
                      message: 'Invalid website URL',
                    }
                  })}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    businessErrors.website ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="https://www.company.com"
                />
                {businessErrors.website && (
                  <p className="mt-1 text-red-500 text-sm">{businessErrors.website.message}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Business Type
                </label>
                <select
                  {...registerBusiness('businessType', { required: 'Business type is required' })}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    businessErrors.businessType ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select Business Type</option>
                  {businessTypes.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
                {businessErrors.businessType && (
                  <p className="mt-1 text-red-500 text-sm">{businessErrors.businessType.message}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Business Document
                </label>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  {...registerBusiness('document', { required: 'Business document is required' })}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    businessErrors.document ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                <p className="mt-1 text-sm text-gray-500">
                  Upload business registration document (PDF, DOC, DOCX)
                </p>
                {businessErrors.document && (
                  <p className="mt-1 text-red-500 text-sm">{businessErrors.document.message}</p>
                )}
              </div>
            </div>
            
            <div className="mt-6 flex justify-between">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="text-gray-600 px-6 py-2 rounded-lg hover:bg-gray-100 flex items-center"
              >
                <ChevronLeft size={20} className="mr-2" />
                Previous Step
              </button>
              
              <button
                type="submit"
                disabled={registerMutation.isPending}
                className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-70"
              >
                {registerMutation.isPending ? 'Registering...' : 'Complete Registration'}
              </button>
            </div>
          </form>
        )}
        
        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="text-indigo-600 hover:text-indigo-800">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;