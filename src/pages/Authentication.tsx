
import React from 'react';
import { useLocation } from 'react-router-dom';
import SignIn from '@/components/SignIn';
import SignUp from '@/components/SignUp';

const Authentication = () => {
  const location = useLocation();
  const isSignUp = location.pathname === '/signup';
  
  return (
    <>
      {isSignUp ? <SignUp /> : <SignIn />}
    </>
  );
};

export default Authentication;
