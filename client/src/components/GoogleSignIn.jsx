import React from 'react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { motion } from 'motion/react';
import { toast } from 'react-toastify';

const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID || 'your_google_client_id_here';

const GoogleSignIn = ({ onSuccess, text = 'Sign in with Google' }) => {
  const handleSuccess = async (response) => {
    try {
      const { credential } = response;
      if (onSuccess) {
        onSuccess(credential);
      }
    } catch (error) {
      console.error('Google auth error:', error);
      toast.error('Google authentication failed.');
    }
  };

  const handleError = () => {
    toast.error('Google sign-in failed. Please try again.');
  };

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <motion.div
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.98 }}
        className="w-full dark:[&>div>div]:bg-gray-800 dark:[&>div>div]:border-gray-700"
      >
        <GoogleLogin
          onSuccess={handleSuccess}
          onError={handleError}
          useOneTap
          theme="outline"
          size="large"
          width="100%"
          text={text === 'Sign up with Google' ? 'signup_with' : 'signin_with'}
          shape="rectangular"
          logo_alignment="left"
        />
        {/* Note: GoogleLogin renders its own iframe; dark mode is controlled via Google's theme prop.
            For full dark mode support, use theme="filled_blue" or wrap in a container with dark: classes. */}
      </motion.div>
    </GoogleOAuthProvider>
  );
};

export default GoogleSignIn;
