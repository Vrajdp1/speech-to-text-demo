import React from "react";

const SignUp = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md">
        <h2 className="text-2xl text-black font-bold text-center mb-6">Create an Account</h2>

        {/* Name Input */}
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold">Full Name</label>
          <input
            type="text"
            placeholder="Enter your name"
            className="w-full p-3 border border-gray-300 rounded-lg mt-1 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        {/* Email Input */}
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold">Email Address</label>
          <input
            type="email"
            placeholder="Enter your email"
            className="w-full p-3 border border-gray-300 rounded-lg mt-1 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        {/* Password Input */}
        <div className="mb-6">
          <label className="block text-gray-700 font-semibold">Password</label>
          <input
            type="password"
            placeholder="Enter your password"
            className="w-full p-3 border border-gray-300 rounded-lg mt-1 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        {/* Register Button */}
        <button className="w-full bg-purple-600 text-white p-3 rounded-lg font-semibold hover:bg-purple-700 transition">
          Sign Up
        </button>

        {/* Divider */}
        <div className="flex items-center my-4">
          <hr className="flex-grow border-gray-300" />
          <span className="px-2 text-gray-500">or</span>
          <hr className="flex-grow border-gray-300" />
        </div>

        {/* Google Sign-Up */}
        <button className="w-full flex items-center justify-center border border-gray-400 p-3 rounded-lg font-semibold hover:bg-gray-100 transition">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/4/4a/Google_2015_logo.svg"
            alt="Google"
            className="w-5 h-5 mr-2"
          />
          Register with Google
        </button>
      </div>
    </div>
  );
};

export default SignUp;
