// UMI Login Page
import React, { useState } from 'react'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import { Icon } from '@iconify/react'
import { useNavigate } from 'react-router-dom'

// Login Component
const Login = ({ setIsAuthenticated }) => {
  const [showPassword, setShowPassword] = useState(false)
  const [fieldError, setFieldError] = useState({ email: '', password: '' })
  const navigate = useNavigate()

  return (
    // Page Container
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
      {/* Logo and Title */}
      <img src="/Logo%20main.png" alt="UMI Logo" className="w-56 mb-2" />
     
      {/* Login Form Card */}
      <div className="bg-white rounded-2xl shadow-md p-10 min-w-[370px] max-w-[90vw]">
        <h2 className="text-center mb-6 text-2xl font-bold">Sign In</h2>
        {/* Formik Login Form */}
        <Formik
          initialValues={{ email: '', password: '', remember: false }}
          validationSchema={Yup.object({
            email: Yup.string()
              .email('Please enter a valid email address')
              .required('Email is required'),
            password: Yup.string().required('Password is required'),
          })}
          validateOnChange={true}
          validateOnBlur={true}
          onSubmit={(values, { setSubmitting, setStatus, setFieldError }) => {
            setFieldError('email', '')
            setFieldError('password', '')
            setStatus('')
            setTimeout(() => {
              // Simulate login error for demo
              setFieldError('email', '')
              setFieldError('password', '')
              setStatus('')
              if (values.email !== 'josh@gmail.com' || values.password !== 'password123') {
                setFieldError('email', values.email !== 'josh@gmail.com' ? 'Incorrect username or password. Please try again.' : '')
                setFieldError('password', values.password !== 'password123' ? 'Incorrect username or password. Please try again.' : '')
                setSubmitting(false)
                return
              }
              setSubmitting(false)
              setIsAuthenticated(true)
              navigate('/dashboard')
            }, 1200)
          }}
        >
          {({ isSubmitting, setFieldValue, values, errors, touched }) => (
            <Form>
              {/* Email Field */}
              <div className="mb-3">
                <label htmlFor="email" className="text-sm">Email or Username</label>
                <Field
                  name="email"
                  type="email"
                  autoComplete="username"
                  className={`w-full mt-1 px-3 py-2 rounded-md border text-base focus:outline-none focus:ring-2 focus:ring-blue-400 ${errors.email && touched.email ? 'border-red-500' : 'border-gray-300'}`}
                  onInput={() => setFieldError('email', '')}
                />
                <div className="text-red-500 text-xs mt-1 min-h-[18px]">
                  <ErrorMessage name="email" />
                  {fieldError.email && !errors.email && touched.email && <span>{fieldError.email}</span>}
                </div>
              </div>
              {/* Password Field */}
              <div className="mb-2 relative">
                <label htmlFor="password" className="text-sm">Password</label>
                <div className="relative">
                  <Field
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    className={`w-full mt-1 px-3 py-2 rounded-md border text-base focus:outline-none focus:ring-2 focus:ring-blue-400 ${errors.password && touched.password ? 'border-red-500' : 'border-gray-300'}`}
                    onInput={() => setFieldError('password', '')}
                  />
                  <button
                    type="button"
                    tabIndex={-1}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
                    onClick={() => setShowPassword((v) => !v)}
                  >
                    {showPassword ? (
                      <Icon icon="mdi:eye-off" className="w-5 h-5" />
                    ) : (
                      <Icon icon="mdi:eye" className="w-5 h-5" />
                    )}
                  </button>
                </div>
                <div className="text-red-500 text-xs mt-1 min-h-[18px]">
                  <ErrorMessage name="password" />
                  {fieldError.password && !errors.password && touched.password && <span>{fieldError.password}</span>}
                </div>
              </div>
              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between mb-4">
                <label className="flex items-center text-sm">
                  <input
                    type="checkbox"
                    checked={values.remember}
                    onChange={e => setFieldValue('remember', e.target.checked)}
                    className="mr-2 accent-blue-700"
                  />
                  Remember me
                </label>
                <a href="/forgot-password" className="text-yellow-600 text-sm font-medium hover:underline">Forgot password?</a>
              </div>
              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#23408e] text-white rounded-md py-2 text-lg font-medium mt-2 hover:bg-[#1a2e5c] transition-colors disabled:opacity-60 flex items-center justify-center"
              >
                {isSubmitting && (
                  <svg className="animate-spin h-5 w-5 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                  </svg>
                )}
                {isSubmitting ? 'Signing In...' : 'Sign In'}
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  )
}

// Export
export default Login
