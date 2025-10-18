import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import './Login.css';

const Login = () => {
  const { t } = useLanguage();
  const { login, isAuthenticated } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm();

  const onSubmit = async (data) => {
    setIsLoading(true);
    setError('');
    
    try {
      const result = await login(data.email, data.password);
      
      if (result.success) {
        console.log('Login successful!', result.user);
        reset();
        navigate('/dashboard');
      } else {
        setError(result.error);
      }
    } catch (error) {
      console.error('Login error:', error);
      setError(t('loginFailed'));
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <div className="brand-logo">
            <h1>One-Click Content</h1>
          </div>
          <h2>{t('welcomeBack')}</h2>
          <p>{t('signInToAccount')}</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="login-form">
          {error && (
            <div className="error-banner" style={{
              background: '#fee', 
              color: '#c33', 
              padding: '10px', 
              borderRadius: '6px', 
              marginBottom: '20px',
              border: '1px solid #fcc'
            }}>
              {error}
            </div>
          )}
          
          <div className="form-group">
            <label htmlFor="email">{t('emailAddress')}</label>
            <input
              type="email"
              id="email"
              className={`form-input ${errors.email ? 'error' : ''}`}
              placeholder={t('enterEmail')}
              {...register('email', {
                required: t('emailRequired'),
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: t('invalidEmail')
                }
              })}
            />
            {errors.email && <span className="error-message">{errors.email.message}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="password">{t('password')}</label>
            <div className="password-input-container">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                className={`form-input ${errors.password ? 'error' : ''}`}
                placeholder={t('enterPassword')}
                {...register('password', {
                  required: t('passwordRequired'),
                  minLength: {
                    value: 6,
                    message: t('passwordMinLength')
                  }
                })}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && <span className="error-message">{errors.password.message}</span>}
          </div>

          <div className="form-options">
            <label className="checkbox-container">
              <input
                type="checkbox"
                {...register('rememberMe')}
              />
              <span className="checkmark"></span>
              {t('rememberMe')}
            </label>
          </div>

          <button
            type="submit"
            className={`login-button ${isLoading ? 'loading' : ''}`}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="spinner"></span>
                {t('signingIn')}
              </>
            ) : (
              t('signIn')
            )}
          </button>
        </form>

        <div className="login-footer">
          <p>
            {t('dontHaveAccount')}{' '}
            <a href="/register" className="signup-link">{t('signUpHere')}</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;