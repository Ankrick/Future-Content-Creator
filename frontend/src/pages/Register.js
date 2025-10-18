import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import './Register.css';

const Register = () => {
  const { t } = useLanguage();
  const { register: registerUser, isAuthenticated } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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
    watch,
    reset
  } = useForm();

  const password = watch('password');

  const onSubmit = async (data) => {
    setIsLoading(true);
    setError('');
    
    try {
      const result = await registerUser(data.name, data.username, data.email, data.password);
      
      if (result.success) {
        console.log('Registration successful!', result.user);
        reset();
        navigate('/dashboard');
      } else {
        setError(result.error);
      }
    } catch (error) {
      console.error('Registration error:', error);
      setError(t('registrationFailed'));
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <div className="register-header">
          <div className="brand-logo">
            <h1>One-Click Content</h1>
          </div>
          <h2>{t('createAccount')}</h2>
          <p>{t('joinUs')}</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="register-form">
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
            <label htmlFor="name">{t('fullName')}</label>
            <input
              type="text"
              id="name"
              className={`form-input ${errors.name ? 'error' : ''}`}
              placeholder={t('enterFullName')}
              {...register('name', {
                required: t('fullNameRequired'),
                minLength: {
                  value: 2,
                  message: t('nameMinLength')
                }
              })}
            />
            {errors.name && <span className="error-message">{errors.name.message}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="username">{t('username')}</label>
            <input
              type="text"
              id="username"
              className={`form-input ${errors.username ? 'error' : ''}`}
              placeholder={t('chooseUsername')}
              {...register('username', {
                required: t('usernameRequired'),
                minLength: {
                  value: 3,
                  message: t('usernameMinLength')
                },
                pattern: {
                  value: /^[a-zA-Z0-9_]+$/,
                  message: t('usernamePattern')
                }
              })}
            />
            {errors.username && <span className="error-message">{errors.username.message}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="email">{t('email')}</label>
            <input
              type="email"
              id="email"
              className={`form-input ${errors.email ? 'error' : ''}`}
              placeholder={t('enterEmailAddress')}
              {...register('email', {
                required: t('emailAddressRequired'),
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
                placeholder={t('createPassword')}
                {...register('password', {
                  required: t('passwordRequired'),
                  minLength: {
                    value: 8,
                    message: t('passwordMinLength8')
                  },
                  pattern: {
                    value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                    message: t('passwordPattern')
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

          <div className="form-group">
            <label htmlFor="confirmPassword">{t('confirmPassword')}</label>
            <div className="password-input-container">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                id="confirmPassword"
                className={`form-input ${errors.confirmPassword ? 'error' : ''}`}
                placeholder={t('confirmYourPassword')}
                {...register('confirmPassword', {
                  required: t('pleaseConfirmPassword'),
                  validate: value =>
                    value === password || t('passwordsNotMatch')
                })}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={toggleConfirmPasswordVisibility}
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.confirmPassword && <span className="error-message">{errors.confirmPassword.message}</span>}
          </div>



          <button
            type="submit"
            className={`register-button ${isLoading ? 'loading' : ''}`}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="spinner"></span>
                {t('creatingAccount')}
              </>
            ) : (
              t('createAccount')
            )}
          </button>
        </form>

        <div className="register-footer">
          <p>
            {t('alreadyHaveAccount')}{' '}
            <a href="/login" className="login-link">{t('signInHere')}</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;