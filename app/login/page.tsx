// app/login/page.tsx
"use client";

import React, { useState } from 'react';
import LoginForm from '../components/LoginForm';
import RegisterForm from '../components/RegisterForm';

const LoginPage = () => {
  const [isRegistering, setIsRegistering] = useState(false);

  const handleRegisterClick = () => {
      setIsRegistering(true);
  };

  const handleLoginClick = () => {
      setIsRegistering(false);
  };

  return (
      <div>
          {isRegistering ? <RegisterForm onLoginClick={handleLoginClick} /> : <LoginForm onRegisterClick={handleRegisterClick} />}
      </div>
  );
};

export default LoginPage;