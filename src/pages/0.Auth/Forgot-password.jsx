// UMI Forgot Password Page
import React from 'react'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'

// Forgot Password Component
const Forgotpassword = () => {
  return (
    // Page Container
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
      {/* Logo and Title */}
      <img src="/Logo%20main.png" alt="UMI Logo" className="w-56 mb-2" />
      <div className="font-semibold text-[#23408e] mb-8 text-base tracking-wide">UGANDA MANAGEMENT INSTITUTE</div>
      {/* Forgot Password Form Card */}
      <div className="bg-white rounded-2xl shadow-md p-10 min-w-[370px] max-w-[90vw]">
        <h2 className="text-center mb-3 text-2xl font-bold">Reset Password</h2>
        <div className="text-center text-gray-600 text-base mb-6">
          We'll send you a link to your email id if you're<br />registered in the system.
        </div>
        {/* Formik Forgot Password Form */}
        <Formik
          initialValues={{ email: '' }}
          validationSchema={Yup.object({
            email: Yup.string().email('Invalid email address').required('Required'),
          })}
          onSubmit={(values, { setSubmitting, setStatus }) => {
            setTimeout(() => {
              setStatus('If this email is registered, a reset link has been sent.')
              setSubmitting(false)
            }, 800)
          }}
        >
          {({ isSubmitting, status }) => (
            <Form>
              {/* Email Field */}
              <div className="mb-4">
                <label htmlFor="email" className="text-sm">School Email</label>
                <Field name="email" type="email" className="w-full mt-1 px-3 py-2 rounded-md border border-gray-300 text-base focus:outline-none focus:ring-2 focus:ring-blue-400" />
                <div className="text-red-500 text-xs mt-1"><ErrorMessage name="email" /></div>
              </div>
              {/* Status Message */}
              {status && <div className="text-[#23408e] text-sm mb-2 text-center">{status}</div>}
              {/* Submit Button */}
              <button type="submit" disabled={isSubmitting} className="w-full bg-[#23408e] text-white rounded-md py-2 text-lg font-medium mt-2 hover:bg-[#1a2e5c] transition-colors disabled:opacity-60">
                {isSubmitting ? 'Submitting...' : 'Submit'}
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  )
}

// Export
export default Forgotpassword
